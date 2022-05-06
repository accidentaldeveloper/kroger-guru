import { useFetcher } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import type { Product } from "~/models/kroger/products.types";
import { searchProducts } from "~/models/product.server";
import { ProductCard } from "~/components/product-card";
import type { ReactNode } from "react";

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

export const ProductSearch = ({
  productRenderChildren,
}: {
  productRenderChildren: (product: Product) => ReactNode;
}) => {
  const search = useFetcher<LoaderData>();
  const { data } = search;

  const state = search.state;
  const searching = state === "submitting";
  return (
    <>
      <div>
        <search.Form method="get" action="/search">
          <h2 className="py-4 text-2xl">Search for Products</h2>
          <input
            type={"text"}
            name="query"
            className="border-2"
            placeholder="Type a query"
          />
          <button
            type="submit"
            className="my-4 block  rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
          >
            {searching ? "Searching..." : "Search"}
          </button>
        </search.Form>
      </div>

      {data && data.searchResults ? (
        <>
          <div className="flex flex-wrap">
            {data.searchResults.map((item) => (
              <ProductCard item={item} key={item.productId}>
                {productRenderChildren(item)}
              </ProductCard>
            ))}
          </div>
        </>
      ) : (
        <div className="pt-4 pb-20 "></div>
      )}
    </>
  );
};
