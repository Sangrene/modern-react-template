import { describe, expect, it, vi, beforeEach } from "vitest";
import { createMemoryStore } from "src/shared/persistentKvStore/inMemoryKvStore";
import {
  oidcAuth,
  OAUTH_STATE_KEY,
  REFRESH_TOKEN_KEY,
  TokenResponse,
} from "./oidcAuth.core";
import type { HTTPClient } from "src/shared/httpClient/httpClient";
import { ClientEnvSchema, ServerEnvSchema } from "src/shared/env/env";
import { err, errAsync, ok, okAsync, ResultAsync } from "neverthrow";
import type { Type } from "arktype";

const clientEnv: typeof ClientEnvSchema.infer = {
  OIDC_CLIENT_ID: "test",
  OIDC_LOGIN_URL: "http://oidc.com/login",
  BASE_URL: "http://localhost:3000",
  APPLICATION_NAME: "test",
  DOMAIN: "test",
  OIDC_LOGOUT_URL: "http://oidc.com/logout",
};
const serverEnv: typeof ServerEnvSchema.infer = {
  OIDC_CLIENT_ID: "test",
  OIDC_LOGIN_URL: "http://oidc.com/login",
  OIDC_CLIENT_SECRET: "secretTest",
  BASE_URL: "http://localhost:3000",
  APPLICATION_NAME: "test",
  DOMAIN: "test",
  OIDC_TOKEN_URL: "http://oidc.com/authorize",
  OIDC_LOGOUT_URL: "http://oidc.com/logout",
};
describe("OIDC Auth", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.mock("src/shared/env/env", () => ({
      getClientEnv: () => ok(clientEnv),
      getServerEnv: () => ok(serverEnv),
    }));
  });
  describe("redirectToOidcProvider", () => {
    const mockHttpClient: HTTPClient = {
      post: vi.fn(),
      get: vi.fn(),
    };
    it("should redirect to the OIDC provider, with the correct parameters", () => {
      const inMemoryStore = createMemoryStore();
      const { handleRedirectToOidcProvider: redirectToOidcProvider } = oidcAuth(
        {
          localKvStore: inMemoryStore,
          httpClient: mockHttpClient,
        }
      );
      const result = redirectToOidcProvider({ dontRedirect: true })
        .map((url) => new URL(url))
        .mapErr((e) => e.join("\n"));
      if (result.isErr()) {
        console.error(result.error);
        throw result.error;
      }
      const url = result.value;
      expect(url.href).toContain("http://oidc.com/login?");
      expect(url.searchParams.get("client_id")).toEqual("test");
      expect(url.searchParams.get("response_type")).toEqual("code");
      expect(url.searchParams.get("redirect_uri")).toEqual(
        "http://localhost:3000/oidc/callback"
      );
      expect(url.searchParams.get("state")).toBeDefined();
    });
  });
  describe("handleOidcCallback", () => {
    it("should reject if state doesn't match stored state", async () => {
      const inMemoryStore = createMemoryStore();
      const mockHttpClient = {
        post: vi
          .fn()
          .mockImplementation(<T>(params: any): ResultAsync<T, Error> => {
            return okAsync({
              refresh_token: "refresh_token",
              expires_in: 3600,
            } as T);
          }),
        get: vi.fn(),
      } as HTTPClient;
      const { handleOidcCallback } = oidcAuth({
        localKvStore: inMemoryStore,
        httpClient: mockHttpClient,
      });
      inMemoryStore.setItem(OAUTH_STATE_KEY, "state");
      const result = await handleOidcCallback("code", "wrongState");
      expect(result).toStrictEqual(err(new Error("State mismatch")));
    });
    it("Should not store refresh token if token request fails", async () => {
      const inMemoryStore = createMemoryStore();
      const mockHttpClient = {
        post: vi
          .fn()
          .mockImplementation(<T>(params: any): ResultAsync<T, Error> => {
            return errAsync(new Error("Failed to fetch"));
          }),
        get: vi.fn(),
      } as HTTPClient;
      const { handleOidcCallback } = oidcAuth({
        localKvStore: inMemoryStore,
        httpClient: mockHttpClient,
      });
      inMemoryStore.setItem(OAUTH_STATE_KEY, "state");
      const result = await handleOidcCallback("code", "state");
      expect(result).toStrictEqual(err(new Error("Failed to fetch")));
      expect(inMemoryStore.getItem(REFRESH_TOKEN_KEY)).toStrictEqual(
        err(new Error(`Key '${REFRESH_TOKEN_KEY}' not found`))
      );
    });
    it("Should store refresh token and expiration if token request succeeds", async () => {
      const inMemoryStore = createMemoryStore();
      const mockHttpClient = {
        post: vi
          .fn()
          .mockImplementation(<T>(params: any): ResultAsync<T, Error> => {
            return okAsync({
              refresh_token: "refresh_token",
              expires_in: 3600,
            } as T);
          }),
        get: vi.fn(),
      } as HTTPClient;
      const { handleOidcCallback } = oidcAuth({
        localKvStore: inMemoryStore,
        httpClient: mockHttpClient,
      });
      inMemoryStore.setItem(OAUTH_STATE_KEY, "state");
      const result = await handleOidcCallback("code", "state");
      expect(result.isOk()).toBe(true);
      expect(inMemoryStore.getItem(REFRESH_TOKEN_KEY)).toStrictEqual(
        ok("refresh_token")
      );
    });
  });

  describe("handleRefreshAccessTokenIfNeeded", () => {
    it("should not do anything if access token is not expiring in a minute or less", async () => {
      const inMemoryStore = createMemoryStore();
      const mockHttpClient = {
        post: vi
          .fn()
          .mockImplementation(<T>(params: any): ResultAsync<T, Error> => {
            return okAsync({
              refresh_token: "refresh_token",
              expires_in: 120,
            } as T);
          }),
        get: vi.fn(),
      } as HTTPClient;
      const {
        handleRefreshAccessTokenIfNeeded,
        handleOidcCallback,
        handleRedirectToOidcProvider: redirectToOidcProvider,
      } = oidcAuth({
        localKvStore: inMemoryStore,
        httpClient: mockHttpClient,
      });
      redirectToOidcProvider();
      const state = inMemoryStore.getItem(OAUTH_STATE_KEY).unwrapOr("state");
      await handleOidcCallback("code", state);
      const result = await handleRefreshAccessTokenIfNeeded();
      expect(result).toStrictEqual(ok(false));
      expect(mockHttpClient.post).toHaveBeenCalledTimes(1);
    });
    it("should refresh access token if it is expiring in a minute or less", async () => {
      const inMemoryStore = createMemoryStore();

      const mockHttpClient = {
        post: vi
          .fn()
          .mockImplementation(
            <T>(p: {
              url: string;
              body: any;
              responseType: Type<T>;
              headers?: Record<string, string>;
            }): ResultAsync<T, Error> => {
              return okAsync({
                refresh_token: "refresh_token",
                expires_in: 30,
              } as T);
            }
          ),
        get: vi.fn(),
      } as HTTPClient;
      const {
        handleRefreshAccessTokenIfNeeded,
        handleOidcCallback,
        handleRedirectToOidcProvider: redirectToOidcProvider,
      } = oidcAuth({
        localKvStore: inMemoryStore,
        httpClient: mockHttpClient,
      });
      redirectToOidcProvider();
      const state = inMemoryStore.getItem(OAUTH_STATE_KEY).unwrapOr("state");
      await handleOidcCallback("code", state);

      const result = await handleRefreshAccessTokenIfNeeded();
      expect(result).toStrictEqual(ok(true));
      expect(mockHttpClient.post).toHaveBeenLastCalledWith({
        url: "http://localhost:3000/oidc/refresh-token",
        responseType: TokenResponse,
        body: {
          refresh_token: "refresh_token",
        },
      });
    });
  });
});
