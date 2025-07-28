import Backend from "i18next-fs-backend/cjs";
import { resolve } from "node:path";
import { URL } from "node:url";
import { RemixI18Next } from "remix-i18next/server";
import i18n from "~/i18n/i18n";

let i18next = new RemixI18Next({
	detection: {
		supportedLanguages: i18n.supportedLngs,
		fallbackLanguage: i18n.fallbackLng,
		async findLocale(request) {
			const url = new URL(request.url);
			let locale = url.pathname.split("/").at(1);
			if(locale && this.supportedLanguages.includes(locale)) {
				return locale;
			}
			return this.fallbackLanguage;
		},
	},
	i18next: {
		...i18n,
		backend: {
			loadPath: resolve("./public/locales/{{lng}}/{{ns}}.json"),
		},
	},
	plugins: [Backend],
});

export default i18next;