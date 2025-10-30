import { oidcAuth } from "src/authentication/oauth/oidcAuth.core";
import { localStore } from "src/shared/persistentKvStore/localStorageKvStore";
import { httpClient } from "src/shared/httpClient/httpClient";
import { useTranslation } from "react-i18next";

export function LoginButton() {
  if (typeof window === "undefined") {
    return null;
  }
  const { t } = useTranslation();
  const { handleRedirectToOidcProvider } = oidcAuth({
    httpClient: httpClient,
    localKvStore: localStore,
  });
  const redirection = handleRedirectToOidcProvider({ dontRedirect: true });

  return (
    <a
      href={redirection.isOk() ? redirection.value : "#"}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-center block no-underline"
    >
      {redirection.isOk() ? t("login", "Login") : "Error generating login URL"}
    </a>
  );
}
