import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { SizeEnum } from "~/models/kroger/products.types";
import type { Product } from "~/models/kroger/products.types";
import { searchProducts } from "~/models/product.server";

type LoaderData = {
  searchResults: Product[] | null;
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

export default () => {
  const { searchResults } = useLoaderData() as LoaderData;
  return (
    <>
      {searchResults ? (
        <>
          <h1 className="text-xl">Search results:</h1>
          {searchResults.map((item) => {
            const image = item.images[0];
            const mediumImage = image.sizes.find(
              (i) => i.size === SizeEnum.Medium
            );
            return (
              <div key={item.upc}>
                <div>{item.description}</div>
                <div>{item.brand}</div>
                <img src={mediumImage?.url} alt=""></img>
              </div>
            );
          })}
        </>
      ) : (
        <div>Submit a query</div>
      )}
    </>
  );
};
