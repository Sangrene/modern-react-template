import { type } from "arktype";
import { Result, ok, err } from "neverthrow";

export const ClientEnvSchema = type({
  APPLICATION_NAME: "string",
  OIDC_CLIENT_ID: "string",
  BASE_URL: "string",
  OIDC_LOGIN_URL: "string",
  DOMAIN: "string",
  OIDC_LOGOUT_URL: "string",
});

export const ServerEnvSchema = type({
  OIDC_CLIENT_SECRET: "string",
  OIDC_TOKEN_URL: "string",
})
  .and(ClientEnvSchema)
  .onDeepUndeclaredKey("delete");

export const getServerEnv = (): Result<
  typeof ServerEnvSchema.infer,
  type.errors
> => {
  const serverEnv = ServerEnvSchema(process.env);
  if (serverEnv instanceof type.errors) {
    return err(serverEnv);
  }
  return ok(serverEnv);
};

export const getClientEnv = (): Result<
  typeof ClientEnvSchema.infer,
  type.errors
> => {
  const env = typeof window !== "undefined" ? window?.env : process.env;
  const clientEnv = ClientEnvSchema.onDeepUndeclaredKey("delete")(env);
  if (clientEnv instanceof type.errors) {
    return err(clientEnv);
  }
  return ok(clientEnv);
};

declare global {
  interface Window {
    env: typeof ClientEnvSchema.infer;
  }
}
