import { err, errAsync, ok, okAsync, Result, ResultAsync } from "neverthrow";
import { getClientEnv } from "~/env/env";
import { type PersistentKvStore } from "~/persistentKvStore/persistentKvStore";
import { type } from "arktype";
import { type HTTPClient } from "~/http/httpClient";

export const OAUTH_STATE_KEY = "oauth_state";
export const REFRESH_TOKEN_KEY = "refresh_token";
export const ACCESS_TOKEN_EXPIRES_AT_KEY = "access_token_expires_at";
export const TOKEN_LIMIT_MS = 2 * 60 * 1000; // refresh access token 2 minutes before expiration

export const TokenResponse = type({
  refresh_token: "string",
  expires_in: "number",
});

const generateUuid = function () {
  return ([1e7].toString() + -1e3 + -4e3 + -8e3 + -1e11).replace(
    /[018]/g,
    (c) =>
      (
        Number(c) ^
        (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(c) / 4)))
      ).toString(16)
  );
};

export const oidcAuth = ({
  localKvStore,
  httpClient,
}: {
  localKvStore: PersistentKvStore;
  httpClient: HTTPClient;
}) => {
  const redirectToOidcProvider = () => {
    const env = getClientEnv();
    if (env.isErr()) {
      return err(env.error);
    }
    const state = generateUuid();
    localKvStore.setItem(OAUTH_STATE_KEY, state);
    const params = new URLSearchParams({
      client_id: env.value.OIDC_CLIENT_ID,
      response_type: "code",
      redirect_uri: env.value.BASE_URL + "/oidc/callback",
      state,
      scope: "offline_access",
    });
    window.location.href = `${env.value.OIDC_LOGIN_URL}?${params}`;
  };

  const storeRefreshTokenAndExpiration = (
    refreshToken: string,
    expiresIn: number
  ) => {
    const result = Result.combine([
      localKvStore.setItem(REFRESH_TOKEN_KEY, refreshToken),
      localKvStore.setItem(
        ACCESS_TOKEN_EXPIRES_AT_KEY,
        (new Date().getTime() + expiresIn * 1000).toString()
      ),
    ]);
    if (result.isErr()) {
      return err(result.error);
    }
    return ok(true);
  };

  const sendAccessTokenRequest = async (code: string) => {
    const env = getClientEnv();
    if (env.isErr()) {
      return errAsync(env.error);
    }
    const tokenResponse = await httpClient.post({
      url: `${env.value.BASE_URL}/oidc/token`,
      body: {
        auth_code: code,
      },
      responseType: TokenResponse,
    });
    return tokenResponse;
  };

  const sendRefreshTokenRequest = async (refreshToken: string) => {
    const env = getClientEnv();
    if (env.isErr()) {
      return err(env.error);
    }
    const tokenResponse = await httpClient.post({
      url: `${env.value.BASE_URL}/oidc/refresh-token`,
      body: {
        refresh_token: refreshToken,
      },
      responseType: TokenResponse,
    });
    return tokenResponse;
  };

  const isAccessTokenExpiring = (limitMs: number = TOKEN_LIMIT_MS) => {
    const accessTokenExpiresAt = localKvStore.getItem(
      ACCESS_TOKEN_EXPIRES_AT_KEY
    );
    if (accessTokenExpiresAt.isErr()) {
      return err(accessTokenExpiresAt.error);
    }
    try {
      const expiresAt = Number(accessTokenExpiresAt.value);
      const now = new Date().getTime();
      return ok(expiresAt - now < limitMs);
    } catch (error) {
      return err(new Error("Failed to parse access token expires at"));
    }
  };

  const updateAccessToken = () => {
    return localKvStore
      .getItem(REFRESH_TOKEN_KEY)
      .asyncAndThen((refreshToken) => {
        if (!refreshToken) {
          return errAsync(new Error("No refresh token found"));
        }
        return ResultAsync.fromPromise(
          sendRefreshTokenRequest(refreshToken),
          (error) => error
        );
      })
      .andThen((result) => {
        return result.match(
          ({ expires_in, refresh_token }) => {
            return storeRefreshTokenAndExpiration(refresh_token, expires_in);
          },
          (error) => {
            return err(error);
          }
        );
      });
  };

  const handleOidcCallback = (code: string, state: string) => {
    if (!code) {
      return err(new Error("No code provided"));
    }
    return localKvStore
      .getItem(OAUTH_STATE_KEY)
      .andThen((storedState) => {
        if (storedState !== state) {
          return err(new Error("State mismatch"));
        }
        return ok(true);
      })
      .andThen(() => {
        return localKvStore.removeItem(OAUTH_STATE_KEY);
      })
      .asyncAndThen(() => {
        return ResultAsync.fromPromise(
          sendAccessTokenRequest(code),
          (error) => error
        );
      })
      .andThen((result) => {
        return result.match(
          ({ expires_in, refresh_token }) => {
            return storeRefreshTokenAndExpiration(refresh_token, expires_in);
          },
          (error) => {
            return err(error);
          }
        );
      });
  };

  const handleRefreshAccessTokenIfNeeded = () => {
    return isAccessTokenExpiring().match(
      (isExpiring) => {
        if (isExpiring) {
          return updateAccessToken();
        }
        return okAsync(false);
      },
      (error) => {
        return errAsync(error);
      }
    );
  };

  return {
    redirectToOidcProvider,
    handleOidcCallback,
    handleRefreshAccessTokenIfNeeded,
  };
};
