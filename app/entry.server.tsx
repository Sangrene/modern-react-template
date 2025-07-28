import { createReadableStreamFromReadable } from "@react-router/node";
import { createInstance } from "i18next";
import Backend from "i18next-fs-backend/cjs";
import { isbot } from "isbot";
import { resolve as resolvePath } from "node:path";
import { PassThrough } from "node:stream";
import type { RenderToPipeableStreamOptions } from "react-dom/server";
import { renderToPipeableStream } from "react-dom/server";
import { I18nextProvider, initReactI18next } from "react-i18next";
import type { EntryContext, unstable_RouterContextProvider } from "react-router";
import { ServerRouter } from "react-router";
import i18n from "./i18n/i18n";
import i18next from "./i18n/i18n.server";

export const streamTimeout = 5_000;

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  entryContext: EntryContext,
  routerContext: unstable_RouterContextProvider
) {
  return new Promise(async (resolve, reject) => {
    let i18nextInstance = createInstance();
    let lng = await i18next.getLocale(request);
    let namespaces = i18next.getRouteNamespaces(entryContext);

    await i18nextInstance
      .use(initReactI18next)
      .use(Backend)
      .init({
        ...i18n,
        lng,
        ns: namespaces,
        backend: {
          addPath: resolvePath("./public/locales"),
          loadPath: resolvePath("./public/locales/{{lng}}/{{ns}}.json"),
        },
      });

    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");

    // Ensure requests from bots and SPA Mode renders wait for all content to load before responding
    let readyOption: keyof RenderToPipeableStreamOptions =
      (userAgent && isbot(userAgent)) || entryContext.isSpaMode
        ? "onAllReady"
        : "onShellReady";

    const { pipe, abort } = renderToPipeableStream(
      <I18nextProvider i18n={i18nextInstance}>
        <ServerRouter context={entryContext} url={request.url} />
      </I18nextProvider>,
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);

          responseHeaders.set("Content-Type", "text/html");

          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode,
            })
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        },
      }
    );

    setTimeout(abort, streamTimeout + 1000);
  });
}
