import { describe, it, expect, beforeEach } from "vitest";
import { getServerEnv, getClientEnv, type ServerEnvSchema } from "./env";

describe("env", () => {
  const mockEnv: typeof ServerEnvSchema.infer  = {
    OIDC_CLIENT_ID: "test",
    OIDC_CLIENT_SECRET: "test",
    OIDC_LOGIN_URL: "http://localhost:3000/test",
    BASE_URL: "http://localhost:3000",
    APPLICATION_NAME: "test",
    DOMAIN: "test",
    OIDC_TOKEN_URL: "http://localhost:3000/test",
    OIDC_LOGOUT_URL: "http://localhost:3000/test",
  }

  beforeEach(() => {
    process.env = mockEnv;
    // @ts-expect-error we are testing in server mode
    window = undefined;
  });
  it("should get server env without errors", () => {
    const serverEnv = getServerEnv();
    
    expect(serverEnv.isOk()).toBe(true);
  });

  it("should get client env without errors", () => {
    const clientEnv = getClientEnv();
    clientEnv.mapErr((error) => {
      throw new Error(error.join("\n"));
    });
    expect(clientEnv.isOk()).toBe(true);
  });

  it("client env should not contain server env", () => {
    const clientEnv = getClientEnv();
    clientEnv.match(
      (clientEnv) => {
        // @ts-expect-error - we are testing the error case
        expect(clientEnv["OIDC_CLIENT_SECRET"]).toBeUndefined();
      },
      (error) => {
        throw new Error(error.join("\n"));
      }
    );
  });

  it("server env should contain client env", () => {
    const serverEnv = getServerEnv();
    serverEnv.map((serverEnv) => {
      expect(serverEnv.OIDC_CLIENT_ID).toBeDefined();
    });
  });
});