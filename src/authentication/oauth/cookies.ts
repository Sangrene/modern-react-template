import { serialize } from "cookie";
import { getClientEnv } from "src/shared/env/env";
import { ok } from "neverthrow";

export const computeSetCookieHeader = (token: string, expiresIt?: boolean) => {
  return getClientEnv().andThen((env) => {
    return ok(serialize("Authorization", token, {
      domain: env.DOMAIN,
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure:
        env.BASE_URL.includes("localhost") || env.BASE_URL.includes("127.0.0.1")
          ? false
          : true,
      maxAge: expiresIt ? -1 : undefined,
    }));
  });
};
