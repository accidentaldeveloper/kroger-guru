import type { Collection, CollectionProduct } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { ProductCard } from "~/components/product-card";

import {
  addProduct,
  deleteCollection,
  setCollectionVisibility,
} from "~/models/collection.server";
import { getCollection, removeProduct } from "~/models/collection.server";
import { fetchProductsByProductIds } from "~/models/kroger.server";
import type { Product } from "~/models/kroger/products.types";
import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";
import { ProductSearch } from "../search";

type LoaderData = {
  collection: Awaited<ReturnType<typeof getCollection>>;
  productDetails: Product[];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.collectionId, "collectionId not found");

  const collection = await getCollection({ userId, id: params.collectionId });
  if (!collection) {
    throw new Response("Not Found", { status: 404 });
  }
  const { products } = collection;
  const productDetails = await fetchProductDetails(products);
  return json<LoaderData>({ collection, productDetails });
};

function dataToBoolean(maybeBool: FormDataEntryValue) {
  if (typeof maybeBool !== "string") {
    return null;
  }
  if (maybeBool === "true") {
    return true;
  }
  if (maybeBool === "false") {
    return false;
  }
  return null;
}

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  const { collectionId } = params;
  invariant(collectionId, "collectionId not found");
  const formData = await request.formData();
  const { _action, productId, setPublic } = Object.fromEntries(formData);
  switch (_action) {
    case "delete":
      await deleteCollection({ userId, id: collectionId });
      return redirect("/collections");
    case "publish":
      const isPublic = dataToBoolean(setPublic);
      invariant(isPublic !== null, "isPublic not found");
      return await setCollectionVisibility({
        id: collectionId,
        userId,
        isPublic,
      });
    case "remove-product":
      invariant(
        typeof productId === "string" && productId.length === 13,
        "productId not found"
      );
      return await removeProduct({ userId, collectionId, productId });
    case "add-product":
      invariant(
        typeof productId === "string" && productId.length === 13,
        "productId not found"
      );
      return await addProduct({ userId, collectionId, productId });
    default:
      throw new Error("Unhandled action type");
  }
};

async function fetchProductDetails(
  products: CollectionProduct[]
): Promise<Product[]> {
  if (products.length === 0) {
    return [];
  }

  const productIds = products.map((p) => p.productId);
  const productDetails = await fetchProductsByProductIds(productIds);
  return productDetails.data;
}

const addProductForm = (
  item: Product,
  collection: Collection,
  collectionProducts: CollectionProduct[]
) => {
  const isInCollection = Boolean(
    collectionProducts.find((cp) => cp.productId === item.productId)
  );
  return (
    <Form method="post">
      <input type="hidden" name="productId" value={item.productId} />
      <input type="hidden" name="collectionId" value={collection.id} />
      <button
        name="_action"
        // Need to change style when disabled
        disabled={isInCollection}
        value="add-product"
        className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
      >
        {isInCollection ? "In Collection" : "Add to collection"}
      </button>
    </Form>
  );
};

export default function CollectionDetailsPage() {
  const { collection, productDetails } = useLoaderData() as LoaderData;
  const user = useUser();

  if (collection === null) {
    throw Error("collection is null!");
  }

  const canEdit = collection.userId === user.id;
  const createdBy = canEdit ? "you" : collection.user.email;
  return (
    <div>
      <h3 className="text-2xl font-bold">{collection.title}</h3>
      <p className="py-6">{collection.body}</p>
      <div>Created by {createdBy}</div>
      {canEdit ? (
        <>
          <Form method="post" className="py-4">
            <input
              type="hidden"
              name="setPublic"
              value={(!collection.isPublic).toString()}
            />
            <button
              type="submit"
              name="_action"
              value="publish"
              className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
            >
              {collection.isPublic
                ? "Unpublish Collection"
                : "Publish Collection"}
            </button>
          </Form>
          <Form method="post" className="py-4">
            <button
              type="submit"
              name="_action"
              value="delete"
              className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
            >
              Delete Collection
            </button>
          </Form>
        </>
      ) : null}
      <div className="flex flex-wrap">
        {productDetails.map((p) => (
          <ProductCard key={p.productId} item={p}>
            {canEdit ? (
              <Form method="post">
                <input type="hidden" value={p.productId} name="productId" />
                <button
                  type="submit"
                  name="_action"
                  value="remove-product"
                  className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
                >
                  Remove
                </button>
              </Form>
            ) : null}
          </ProductCard>
        ))}
      </div>
      <hr className="my-4" />
      {canEdit ? (
        <ProductSearch
          productRenderChildren={(item) =>
            addProductForm(item, collection, collection.products)
          }
        />
      ) : null}{" "}
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Collection not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
