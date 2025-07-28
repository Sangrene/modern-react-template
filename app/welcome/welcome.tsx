import { oidcAuth } from "~/authentication/oauth/oidcAuth";
import logoDark from "./logo-dark.svg";
import logoLight from "./logo-light.svg";
import { useTranslation } from "react-i18next";
import { localStore } from "~/persistentKvStore/localStorageKvStore";
import { httpClient } from "~/http/httpClient";
import { useEffect } from "react";

export function Welcome() {
  const { t } = useTranslation();
  // const { redirectToOidcProvider } = oidcAuth({
  //   httpClient: httpClient,
  //   localKvStore: localStore,
  // });
  useEffect(() => {
    console.log("Welcome component mounted on client side!");
  }, []);
  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <header className="flex flex-col items-center gap-9">
          <div className="w-[500px] max-w-[100vw] p-4">
            <img
              src={logoLight}
              alt="React Router"
              className="block w-full dark:hidden"
            />
            <img
              src={logoDark}
              alt="React Router"
              className="hidden w-full dark:block"
            />
          </div>
        </header>
        <div className="max-w-[300px] w-full space-y-6 px-4">
          <nav className="rounded-3xl border border-gray-200 p-6 dark:border-gray-700 space-y-4">
            <p className="leading-6 text-gray-700 dark:text-gray-200 text-center">
              {t("welcome")}
            </p>
          </nav>
          <div>
            <p>Testing if React is working...</p>
            <button
              onClick={() => {
                console.log("Simple button clicked!");
                alert("Simple button works!");
              }}
              style={{ 
                backgroundColor: 'green', 
                color: 'white', 
                padding: '10px', 
                margin: '10px 0',
                border: 'none',
                borderRadius: '5px'
              }}
            >
              Simple Test
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
