// const credentials =

import { apiSearch } from "./kroger.server";

export async function searchProducts(query: string) {
  const response = await apiSearch(query);
  console.log(response);
  return response.data.map((p) => p.description);
}
