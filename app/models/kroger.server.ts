// import got from "got";
const { KROGER_CLIENT_ID, KROGER_CLIENT_SECRET } = process.env;
const base64Creds = Buffer.from(
  `${KROGER_CLIENT_ID}:${KROGER_CLIENT_SECRET}`
).toString("base64");
const authString = `Basic ${base64Creds}`;

async function fetchAccessToken() {
  const tokenUrl = "https://api.kroger.com/v1/connect/oauth2/token";
  const params = new URLSearchParams({
    grant_type: "client_credentials",
    scope: "product.compact",
  });
  // const data = await got
  //   .post(tokenUrl, {
  //     headers: {
  //       Authorization: authString,
  //       "Content-Type": "application/x-www-form-urlencoded",
  //     },
  //     body: params.toString(),
  //   })
  //   .json();
  const res = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      Authorization: authString,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });
  const data = await res.json();
  if (!res.ok) {
    throw Error(`Failed to get token: ${JSON.stringify(data)}`);
  }
  return data.access_token;
}

export async function apiSearch(query: string) {
  const token = await fetchAccessToken();
  const url = new URL("https://api.kroger.com/v1/products");
  url.searchParams.append("filter.term", query);
  const res = await fetch(url.toString(), {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw Error(`Request failed: ${JSON.stringify(res)}`);
  }
  const data = await res.json();
  return data;
}
