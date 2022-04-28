import { fetchAccessToken } from "./kroger-auth.server";
import type { ProductsResponse } from "./kroger/products.types";




const productsUrl = "https://api.kroger.com/v1/products";
async function searchProducts(searchParams: URLSearchParams) {
  const token = await fetchAccessToken();
  const url = productsUrl + "?" + searchParams.toString();
  const res = await fetch(url, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw Error(`Request failed: ${JSON.stringify(res)}`);
  }
  const data = await res.json();
  return data;
}

export async function fetchProductsByQuery(query: string): Promise<ProductsResponse> {
  const searchParams = new URLSearchParams({ "filter.term": query });
  return searchProducts(searchParams);
}

export async function fetchProductsByProductIds(
  productIds: string[]
): Promise<ProductsResponse> {
  const productIdsString = productIds.join(",");
  const searchParams = new URLSearchParams({
    "filter.productId": productIdsString,
  });
  return searchProducts(searchParams);
}
