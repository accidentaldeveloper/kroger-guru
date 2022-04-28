// import got from "got";

const { KROGER_CLIENT_ID, KROGER_CLIENT_SECRET } = process.env;
const base64Creds = Buffer.from(
  `${KROGER_CLIENT_ID}:${KROGER_CLIENT_SECRET}`
).toString("base64");
const authString = `Basic ${base64Creds}`;

export async function fetchAccessToken(): Promise<string> {
  const startRequest = performance.now();
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
  const requestTime = performance.now() - startRequest;
  console.log(`Token request took ${requestTime}ms`);
  if (!res.ok) {
    throw Error(`Failed to get token: ${JSON.stringify(data)}`);
  }
  return data.access_token;
}
