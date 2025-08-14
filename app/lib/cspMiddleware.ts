import type {
  unstable_MiddlewareFunction,
  unstable_RouterContextProvider,
} from "react-router";
import { unstable_createContext } from "react-router";

const generateNonce = () => Buffer.from(crypto.randomUUID()).toString("base64");

const unstable_createCspMiddleware = (): {
  getNonce: (context: unstable_RouterContextProvider) => string;
  cspMiddleware: unstable_MiddlewareFunction;
} => {
  let nonceContext = unstable_createContext<string>();

  return {
    getNonce: (context: unstable_RouterContextProvider) =>
      context.get(nonceContext),
    cspMiddleware: async function cspMiddleware({ request, context }, next) {
      const nonce = generateNonce();
      context.set(nonceContext, nonce);
      return await next();
    },
  };
};

export const generateCspString = (nonce?: string) => {
  return [
    `default-src 'self'`,
    `style-src 'self' 'unsafe-inline'`,
    `script-src 'self' 'nonce-${nonce}'`,
    `connect-src 'self'`,
    `img-src 'self'`,
    `worker-src 'self' blob: ;`,
  ].join(";");
};

export const { getNonce, cspMiddleware } = unstable_createCspMiddleware();
