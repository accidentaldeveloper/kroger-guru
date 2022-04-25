// const credentials =

import { apiSearch } from "./kroger.server";

export function searchProducts(query: string) {
  const response = apiSearch(query);
  console.log(response)
  return ["foo", query];
}
