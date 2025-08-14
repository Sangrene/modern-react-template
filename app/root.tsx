import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { getClientEnv } from "../src/shared/env/env";
import { getLocale, i18nextMiddleware } from "./i18n/i18nextMiddleware";
import { useChangeLanguage } from "remix-i18next/react";
import { AppProvider } from "src/shared/app/app.provider";
import { cspMiddleware, getNonce } from "./lib/cspMiddleware";

export const unstable_middleware = [i18nextMiddleware, cspMiddleware];

export async function loader({ context }: Route.LoaderArgs) {
  const env = getClientEnv();
  if (env.isErr()) {
    throw new Error(env.error.join("\n"));
  }
  const nonce = getNonce(context);
  const locale = getLocale(context);
  return Response.json({ env: env.value, locale, nonce });
}

export function Layout({ children }: { children: React.ReactNode }) {
  const { env, locale, nonce } = useLoaderData<typeof loader>();
  return (
    <html lang={locale}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: `window.env = ${JSON.stringify(env)}`,
          }}
        />
      </head>
      <body>
        <AppProvider>{children}</AppProvider>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export default function App({ loaderData }: Route.ComponentProps) {
  useChangeLanguage((loaderData as any).locale);
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
