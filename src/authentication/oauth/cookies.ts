import { serialize, parse } from "cookie";
import { getClientEnv } from "src/shared/env/env";
import { ok, err } from "neverthrow";

export const ACCESS_TOKEN_COOKIE_NAME = "Authorization";

export const computeSetCookieHeader = (token: string, expiresIt?: boolean) => {
  return getClientEnv().andThen((env) => {
    return ok(
      serialize(ACCESS_TOKEN_COOKIE_NAME, token, {
        domain: env.DOMAIN,
        httpOnly: true,
        path: "/",
        sameSite: "lax",
        secure:
          env.BASE_URL.includes("localhost") ||
          env.BASE_URL.includes("127.0.0.1")
            ? false
            : true,
        maxAge: expiresIt ? -1 : undefined,
      })
    );
  });
};

export const hasAccessTokenInCookies = (request: Request) => {
  if (!request.headers.get("Cookie")) {
    return ok(false);
  }
  try {
    const cookies = parse(request.headers.get("Cookie") ?? "");
    const accessToken = cookies[ACCESS_TOKEN_COOKIE_NAME];

    if (!accessToken) {
      return ok(false);
    }
    return ok(true);
  } catch (e) {
    return err(new Error("Failed to parse cookies"));
  }
};

export const clearAllCookies = () => {
  document.cookie = "";
};
