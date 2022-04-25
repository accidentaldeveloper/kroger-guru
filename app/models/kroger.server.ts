const { KROGER_CLIENT_ID, KROGER_CLIENT_SECRET } = process.env;
const base64Creds = Buffer.from(
  `${KROGER_CLIENT_ID}:${KROGER_CLIENT_SECRET}`
).toString("base64");
const authString = `Basic ${base64Creds}`;

export async function apiSearch(query: string) {
  const url = new URL("https://api.kroger.com/v1/products");
  url.searchParams.append("filter.term", query);
  const res = await fetch(url.toString(), {
    method: "GET",
    headers: { Authorization: authString },
  });
  const foo = await res.text();
  console.log(foo);
  if (!res.ok) {
    throw Error(`Request failed: ${JSON.stringify(res)}`);
  }
  const data = res.json();
  return data;
}
