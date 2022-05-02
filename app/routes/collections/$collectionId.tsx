import type { CollectionProduct } from "@prisma/client";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { ProductCard } from "~/components/product-card";

import { deleteCollection } from "~/models/collection.server";
import { getCollection, removeProduct } from "~/models/collection.server";
import { fetchProductsByProductIds } from "~/models/kroger.server";
import type { Product } from "~/models/kroger/products.types";
import { requireUserId } from "~/session.server";
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

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  const { collectionId } = params;
  invariant(collectionId, "collectionId not found");
  const formData = await request.formData();
  const productId = formData.get("productId");
  const { _action, ...values } = Object.fromEntries(formData);
  switch (_action) {
    case "delete":
      await deleteCollection({ userId, id: collectionId });
      return redirect("/collections");
    case "remove-product":
      invariant(
        productId && typeof productId == "string",
        "productId required"
      );
      return await removeProduct({ userId, collectionId, productId });
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

export default function CollectionDetailsPage() {
  const { collection, productDetails } = useLoaderData() as LoaderData;

  if (collection === null) {
    throw Error("collection is null!");
  }

  return (
    <div>
      <h3 className="text-2xl font-bold">{collection.title}</h3>
      <p className="py-6">{collection.body}</p>
      <div>
        {productDetails.map((p) => (
          <ProductCard key={p.productId} item={p}>
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
          </ProductCard>
        ))}
      </div>
      <hr className="my-4" />
      <Form method="post">
        <button
          type="submit"
          name="_action"
          value="delete"
          className="rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Delete
        </button>
      </Form>
      <ProductSearch />
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
