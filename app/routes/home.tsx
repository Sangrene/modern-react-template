import type { Route } from "./+types/home";
import { Navbar } from "~/components/navbar";
import { Outlet, redirect, useLocation } from "react-router";
import { useAppContext } from "src/shared/app/app.provider";
import { observer } from "mobx-react-lite";
import { hasAccessTokenInCookies } from "src/authentication/oauth/cookies";
import { oidcAuth } from "src/authentication/oauth/oidcAuth.core";
import { localStore } from "src/shared/persistentKvStore/localStorageKvStore";
import { httpClient } from "src/shared/httpClient/httpClient";
import { LinkInterceptorComponent } from "~/lib/linkInterceptor";
import { useTranslation } from "react-i18next";

export const clientLoader = async ({ request }: Route.ClientLoaderArgs) => {
  const { handleRefreshAccessTokenIfNeeded, handleLogout } = oidcAuth({
    localKvStore: localStore,
    httpClient: httpClient,
  });
  const updateResult = await handleRefreshAccessTokenIfNeeded();
  if (updateResult.isErr()) {
    handleLogout({ dontRedirect: true }).match(
      (url) => {
        return redirect(url);
      },
      (error) => {
        console.error(error);
        return redirect("/oidc/login");
      }
    );
  }
  return null;
};

export const loader = async ({ request }: Route.LoaderArgs) => {
  const isAuthenticated = hasAccessTokenInCookies(request);
  if (isAuthenticated.isErr() || !isAuthenticated.value) {
    return redirect("/oidc/login");
  }
};

const Home = observer(() => {
  const { userStore, userCore } = useAppContext();
  const { t } = useTranslation(["common", "user"]);
  const location = useLocation();
  const currentUser = userStore.currentUserState.user;

  if (!currentUser) {
    userCore.queryCurrentUser();
  }

  const navigationLinks = [
    {
      label: t("common:home", "Home"),
      href: "/",
      active: location.pathname === "/",
    },
    ...(currentUser
      ? [
          {
            label: t("user:update_profile", "Update Profile"),
            href: "/user/update",
            active: location.pathname === "/user/update",
          },
        ]
      : []),
  ];

  return (
    <>
      <LinkInterceptorComponent />
      <Navbar
        links={navigationLinks}
        user={
          currentUser
            ? {
                name: currentUser.name,
                email: currentUser.email,
              }
            : undefined
        }
      />
      <Outlet />
    </>
  );
});

export default Home;
