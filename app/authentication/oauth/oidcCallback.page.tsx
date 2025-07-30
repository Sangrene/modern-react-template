import type { Route } from "./+types/oidcCallback.page";
import { oidcAuth } from "src/authentication/oauth/oidcAuth.core";
import { redirect } from "react-router";
import { localStore } from "src/shared/persistentKvStore/localStorageKvStore";
import { httpClient } from "src/shared/httpClient/httpClient";

export async function clientLoader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code || !state) {
    return Response.json({
      success: false,
      error: "Invalid oidc callback",
    });
  }
  const { handleOidcCallback } = oidcAuth({
    localKvStore: localStore,
    httpClient: httpClient,
  });

  return handleOidcCallback(code, state)
    .map(() => {
      redirect("/");
    })
    .mapErr((error) => {
      console.error(error);
      redirect("/");
    });
}

export default function OidcCallback() {
  return <div>LOADING</div>;
}
