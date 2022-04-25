import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { json } from "@remix-run/server-runtime";
import { searchProducts } from "~/models/product.server";

type LoaderData = {
  searchResults: string[] | null;
};

export const loader: LoaderFunction = async ({ request, params, context }) => {
  const url = new URL(request.url);
  const query = url.searchParams.get("query");
  let searchResults = null;
  if (query) {
    searchResults = searchProducts(query);
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
          {searchResults.map((item) => (
            <div key={item}>{item}</div>
          ))}
        </>
      ) : (
        <div>Submit a query</div>
      )}
    </>
  );
};
