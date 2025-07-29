import { oidcAuth } from "~/authentication/oauth/oidcAuth";

import { useTranslation } from "react-i18next";
import { localStore } from "~/persistentKvStore/localStorageKvStore";
import { httpClient } from "~/http/httpClient";
import { useEffect, useState } from "react";

export function Welcome() {
  const { t } = useTranslation();
  const [isLoaded, setIsLoaded] = useState(false);
  // const { redirectToOidcProvider } = oidcAuth({
  //   httpClient: httpClient,
  //   localKvStore: localStore,
  // });

  useEffect(() => {
    setIsLoaded(true);
  }, []);


  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <div className="max-w-[300px] w-full space-y-6 px-4">
          <nav className="rounded-3xl border border-gray-200 p-6 dark:border-gray-700 space-y-4">
            <p className="leading-6 text-gray-700 dark:text-gray-200 text-center">
              {t("welcome")}
            </p>
          </nav>
          <div>
            <p>Testing if React is working...</p>
            {isLoaded ? <p>React is working</p> : <p>React is not working</p>}
          </div>
        </div>
      </div>
    </main>
  );
}
