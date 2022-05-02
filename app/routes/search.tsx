import { Form, useLoaderData } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { SizeEnum } from "~/models/kroger/products.types";
import type { Product } from "~/models/kroger/products.types";
import { searchProducts } from "~/models/product.server";
import { requireUserId } from "~/session.server";
import invariant from "tiny-invariant";
import { addProduct } from "~/models/collection.server";

type LoaderData = {
  searchResults: Product[] | null;
};

type ActionData = {
  errors?: {
    productId?: string;
  };
};

export const loader: LoaderFunction = async ({ request, params, context }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("query");
  let searchResults = null;
  if (query) {
    searchResults = await searchProducts(query);
  }
  return json<LoaderData>({ searchResults });
};

export const action: ActionFunction = async ({ request, params, context }) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const productId = formData.get("productId");

  if (typeof productId !== "string" || productId.length != 13) {
    return json<ActionData>(
      { errors: { productId: "Valid ProductId is required" } },
      { status: 400 }
    );
  }
  const collectionId = "cl2j76w5q0020rsswhw0pi28x";
  const addedProduct = await addProduct({
    productId,
    collectionId,
    userId,
  });

  return redirect(`/collections/${addedProduct.collectionId}`);
};
export default () => {
  const { searchResults } = useLoaderData() as LoaderData;
  return (
    <>
      {searchResults ? (
        <>
          <h1 className="text-xl">Search results:</h1>
          <div className="flex flex-wrap lg:w-3/4">
            {searchResults.map((item) => {
              const image = item.images[0];
              const mediumImage = image.sizes.find(
                (i) => i.size === SizeEnum.Medium
              );
              return (
                <div key={item.productId} className="w-96 border-2 py-4">
                  <div>{item.description}</div>
                  <div>{item.brand}</div>
                  <img src={mediumImage?.url} alt=""></img>
                  <Form method="post">
                    <input
                      type="hidden"
                      name="productId"
                      value={item.productId}
                    />
                    <button className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700">
                      Add to collection
                    </button>
                  </Form>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div>
          <Form>
            <div>Submit a query</div>
            <input type={"text"} name="query" className="border-2" />
          </Form>
        </div>
      )}
    </>
  );
};
