import type { Route } from "./+types/token.page";
import { getServerEnv } from "~/env/env";
import { computeSetCookieHeader } from "~/authentication/oauth/cookies";

export async function action({ request }: Route.ActionArgs) {
  const env = getServerEnv();
  console.log("test");
  if (env.isErr()) {
    return new Response("Internal Server Error - no env", { status: 500 });
  }
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }
  const body = await request.json();
  const authCode = body.auth_code;
  if (typeof authCode !== "string") {
    return new Response("Bad Request", { status: 400 });
  }

  const params = new URLSearchParams({
    code: authCode,
    client_id: env.value.OIDC_CLIENT_ID,
    client_secret: env.value.OIDC_CLIENT_SECRET,
    redirect_uri: env.value.BASE_URL + "/oidc/callback",
    grant_type: "authorization_code",
    scope: "openid",
  });
  try {
    const response = await fetch(`${env.value.OIDC_TOKEN_URL}?${params}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    const body = await response.json();
    const cookieHeader = computeSetCookieHeader(body.access_token);
    if(cookieHeader.isErr()){
      console.error(cookieHeader.error);
      return new Response(
        "Can't compute set-cookie header",
        { status: 500 }
      );
    }
    if (body.access_token) {
      return Response.json(
        {
          refresh_token: body.refresh_token,
          expires_in: body.expires_in,
        },
        {
          headers: {
            "Set-Cookie": cookieHeader.value,
          },
          status: 200,
        }
      );
    } else {
      console.error(
        new Error(
          "Authorization error, no access token in response, body: " +
            JSON.stringify(body)
        )
      );
      return new Response(
        "Authorization error, no access token in response",
        { status: 500 }
      );
    }
  } catch (e) {
    console.error(e);
    return new Response("Authorization error", { status: 500 });
  }
}
