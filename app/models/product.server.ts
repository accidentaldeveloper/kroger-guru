import { fetchProductsByQuery } from "./kroger.server";

export async function searchProducts(query: string) {
  const response = await fetchProductsByQuery(query);
  return response.data;
}
