import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
  route(
    ".well-known/appspecific/com.chrome.devtools.json",
    "routes/[.]well-known.appspecific.[com.chrome.devtools.json].tsx"
  ),
  route(":locale?/oidc/token", "authentication/oauth/token.page.tsx"),
  route(
    ":locale?/oidc/refresh-token",
    "authentication/oauth/refresh-token.page.tsx"
  ),
  route(":locale?/oidc/callback", "authentication/oauth/oidcCallback.page.tsx"),
  route(":locale?/oidc/logout", "authentication/oauth/logout.page.tsx"),
  route(":locale?/oidc/login", "authentication/login.page.tsx"),

  route(":locale?", "routes/home.tsx", [
    route(
      "user/update",
      "user/updateCurrentUser.page.tsx"
    ),
  ]),
] satisfies RouteConfig;
