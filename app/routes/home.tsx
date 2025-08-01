import type { Route } from "./+types/home";
import { Navbar } from "~/components/navbar";
import { Outlet, redirect, useLocation } from "react-router";
import { useAppContext } from "src/shared/app/app.provider";
import { observer } from "mobx-react-lite";
import { hasAccessTokenInCookies } from "src/authentication/oauth/cookies";

export const loader = async ({ request }: Route.LoaderArgs) => {
  const isAuthenticated = hasAccessTokenInCookies(request);
  if (isAuthenticated.isErr() || !isAuthenticated.value) {
    return redirect("/oidc/login");
  }
};

const Home = observer(() => {
  const { userStore, userCore } = useAppContext();
  const location = useLocation();
  const currentUser = userStore.currentUserState.user;
  if(!currentUser) {
    userCore.queryCurrentUser();
  }

  const navigationLinks = [
    {
      label: "Home",
      href: "/",
      active: location.pathname === "/",
    },
    ...(currentUser
      ? [
          {
            label: "Update Profile",
            href: "/user/update",
            active: location.pathname === "/user/update",
          },
        ]
      : []),
  ];

  return (
    <>
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
