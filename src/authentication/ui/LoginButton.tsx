import { oidcAuth } from "src/authentication/oauth/oidcAuth";
import { localStore } from "src/shared/persistentKvStore/localStorageKvStore";
import { httpClient } from "src/shared/httpClient/httpClient";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

export function LoginButton() {
  const { t } = useTranslation();
  const [loginUrl, setLoginUrl] = useState<string | null>(null);

  const { handleRedirectToOidcProvider: redirectToOidcProvider } = oidcAuth({
    httpClient: httpClient,
    localKvStore: localStore,
  });

  useEffect(() => {
    const loginUrl = redirectToOidcProvider({ dontRedirect: true });

    if (loginUrl.isErr()) {
      console.error("Failed to generate login URL:", loginUrl.error);
      return;
    }
    setLoginUrl(loginUrl.value);
  }, []);

  return (
    <a
      href={loginUrl || "#"}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-center block no-underline"
    >
      {t("login", "Login")}
    </a>
  );
}
