import { unstable_createI18nextMiddleware } from "remix-i18next/middleware";
import { resolve } from "node:path";
import Backend from "i18next-fs-backend/cjs";
import i18n from "./i18n";

export const [i18nextMiddleware, getLocale, getInstance] =
  unstable_createI18nextMiddleware({
    detection: {
      supportedLanguages: i18n.supportedLngs,
      fallbackLanguage: i18n.fallbackLng,
      async findLocale(request) {
        const url = new URL(request.url);
        const locale = url.pathname.split("/").at(1);
        return locale || "en";
      },
    },
    i18next: {
      defaultNS: i18n.defaultNS,
      
      backend: {
        addPath: resolve("./public/locales"),
        loadPath: resolve("./public/locales/{{lng}}/{{ns}}.json"),
      },
    },
    plugins: [Backend],
  });
