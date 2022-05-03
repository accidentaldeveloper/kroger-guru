import { Form, useFetcher } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import type { Product } from "~/models/kroger/products.types";
import { searchProducts } from "~/models/product.server";
import { requireUserId } from "~/session.server";
import invariant from "tiny-invariant";
import { addProduct } from "~/models/collection.server";
import { ProductCard } from "~/components/product-card";

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

  return addedProduct;
};

export const ProductSearch = () => {
  const products = useFetcher<LoaderData>();
  const { data } = products;

  return (
    <>
      <div>
        <products.Form method="get" action="/search">
          <div>Submit a query</div>
          <input type={"text"} name="query" className="border-2" />
        </products.Form>
      </div>

      {data && data.searchResults ? (
        <>
          <h1 className="text-xl">Search results:</h1>
          <div className="flex flex-wrap lg:w-3/4">
            {data.searchResults.map((item) => {
              return (
                <ProductCard item={item} key={item.productId}>
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
                </ProductCard>
              );
            })}
          </div>
        </>
      ) : (
        <div>make a query</div>
      )}
    </>
  );
};
