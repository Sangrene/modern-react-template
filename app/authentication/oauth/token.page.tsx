import type { Route } from "./+types/token.page";
import { getServerEnv } from "src/shared/env/env";
import { computeSetCookieHeader } from "src/authentication/oauth/cookies";
import { err, ok, ResultAsync, Result } from "neverthrow";

export async function action({ request }: Route.ActionArgs) {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }
  const result = await ResultAsync.fromPromise(request.json(), (e) => {
    console.error(e);
    return "Failed to parse request body";
  })
    .andThen((body) => {
      const authCode = body.auth_code;
      if (typeof authCode !== "string") {
        return err("Bad Request");
      }
      return Result.combine([ok(authCode), getServerEnv()]);
    })
    .andThen(([authCode, env]) => {
      const params = {
        code: authCode,
        client_id: env.OIDC_CLIENT_ID,
        client_secret: env.OIDC_CLIENT_SECRET,
        grant_type: "authorization_code",
        scope: "openid offline_access",
        redirect_uri: env.BASE_URL + "/oidc/callback",
      };
      return ResultAsync.fromPromise(
        fetch(`${env.OIDC_TOKEN_URL}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams(params),
        }),
        (e) => {
          console.error(e);
          return err("Failed to fetch token");
        }
      );
    })
    .andThen((response) => {
      return ResultAsync.fromPromise(response.json(), (e) => {
        console.error(e);
        return err("Failed to parse token response");
      });
    })
    .andThen((body) => {
      if (!body.access_token)
        return err("No access token in response" + JSON.stringify(body));
      if (!body.expires_in)
        return err("No expires-in in response" + JSON.stringify(body));
      if (!body.refresh_token)
        return err("No refresh token in response" + JSON.stringify(body));
      return Result.combine([
        computeSetCookieHeader(body.access_token),
        ok({
          refresh_token: body.refresh_token,
          expires_in: body.expires_in,
        }),
      ]);
    })
    .match(
      ([cookieHeader, body]) => {
        return Response.json(
          {
            refresh_token: body.refresh_token,
            expires_in: body.expires_in,
          },
          {
            headers: {
              "Set-Cookie": cookieHeader,
            },
            status: 200,
          }
        );
      },
      (e) => {
        console.error(e);
        if (e === "Bad Request") {
          return new Response("Bad Request", { status: 400 });
        }
        if (e === "No access token in response") {
          return new Response(
            "Authorization error, no access token in response",
            {
              status: 500,
            }
          );
        }
        return new Response("Authorization error", { status: 500 });
      }
    );

  return result;
}
