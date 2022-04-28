import { apiSearch } from "./kroger.server";

export async function searchProducts(query: string) {
  const response = await apiSearch(query);
  return response.data;
}
