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

export const action: ActionFunction = async ({ request, params, context }) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const collectionId = formData.get("collectionId");
  invariant(typeof collectionId === "string", "collectionId is required");

  const productId = formData.get("productId");
  if (typeof productId !== "string" || productId.length != 13) {
    return json<ActionData>(
      { errors: { productId: "Valid ProductId is required" } },
      { status: 400 }
    );
  }

  const addedProduct = await addProduct({
    productId,
    collectionId,
    userId,
  });

  return addedProduct;
};

export const ProductSearch = ({ productRenderChildren }: { productRenderChildren: ((product: Product) => ReactNode) }) => {
  const search = useFetcher<LoaderData>();
  const { data } = search;

  return (
    <>
      <div>
        <search.Form method="get" action="/search">
          <div>Submit a query</div>
          <input type={"text"} name="query" className="border-2" />
        </search.Form>
      </div>

      {data && data.searchResults ? (
        <>
          <h1 className="text-xl">Search results:</h1>
          <div className="flex flex-wrap lg:w-3/4">
            {data.searchResults.map((item) => (
              <ProductCard
                item={item}
                key={item.productId}
                renderChildren={productRenderChildren}
              ></ProductCard>
            ))}
          </div>
        </>
      ) : (
        <div>make a query</div>
      )}
    </>
  );
};
