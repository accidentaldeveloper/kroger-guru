// import got from "got";

const { KROGER_CLIENT_ID, KROGER_CLIENT_SECRET } = process.env;
const base64Creds = Buffer.from(
  `${KROGER_CLIENT_ID}:${KROGER_CLIENT_SECRET}`
).toString("base64");
const authString = `Basic ${base64Creds}`;

type ClientCredentialsResponse = {
  access_token: string;
  expires_in: number;
};

type TokenCache = { token: ClientCredentialsToken };

type ClientCredentialsToken = {
  access_token: string;
  expiration: number;
};

const tokenCache = (global.tokenCache ||
  (global.tokenCache = {
    token: {
      access_token: "",
      expiration: 0,
    },
  })) as TokenCache;

async function fetchAccessToken() {
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
  const data = (await res.json()) as ClientCredentialsResponse;
  const requestTime = performance.now() - startRequest;
  console.log(`Token request took ${requestTime}ms`);
  if (!res.ok) {
    throw Error(`Failed to get token: ${JSON.stringify(data)}`);
  }
  return data;
}

const msInOneMinute = 60 * 1000;
export async function fetchAndSet() {
  const data = await fetchAccessToken();
  const { access_token, expires_in } = data;
  tokenCache.token = {
    access_token,
    expiration: Date.now() + expires_in * 1000,
  };
  return access_token;
}

export const getAccessToken = async () => {
  const { expiration, access_token } = tokenCache.token;
  const msToExpiration = expiration - Date.now();
  console.log({ msToExpiration });
  if (msToExpiration > 0) {
    if (msToExpiration < msInOneMinute) {
      fetchAndSet();
    }
    return access_token;
  }

  return await fetchAndSet();
};
