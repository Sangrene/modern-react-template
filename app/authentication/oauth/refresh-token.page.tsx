import type { Route } from "./+types/refresh-token.page";
import { getServerEnv } from "src/shared/env/env";
import { computeSetCookieHeader } from "src/authentication/oauth/cookies";
import { Result, ResultAsync, ok, err } from "neverthrow";



export async function action({ request }: Route.ActionArgs) {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }
  const result = await ResultAsync.fromPromise(request.json(), (e) => {
    console.error(e);
    return "Failed to parse request body";
  })
    .andThen((body) => {
      const refreshToken = body.refresh_token;
      if (typeof refreshToken !== "string") {
        return err("Bad Request");
      }
      return Result.combine([ok(refreshToken), getServerEnv()]);
    })
    .andThen(([refreshToken, env]) => {
      const params = new URLSearchParams({
        client_id: env.OIDC_CLIENT_ID,
        client_secret: env.OIDC_CLIENT_SECRET,
        grant_type: "refresh_token",
        refresh_token: refreshToken,
      });
      return ResultAsync.fromPromise(
        fetch(`${env.OIDC_TOKEN_URL}?${params}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
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
      if (!body.access_token) return err("No access token in response");
      if (!body.expires_in) return err("No expires-in in response");
      if (!body.refresh_token) return err("No refresh token in response");
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
