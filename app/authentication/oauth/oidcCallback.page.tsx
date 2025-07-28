import type { Route } from "./+types/oidcCallback.page";
import { oidcAuth } from "~/authentication/oauth/oidcAuth";
import { redirect } from "react-router";
import { localStore } from "~/persistentKvStore/localStorageKvStore";
import { httpClient } from "~/http/httpClient";

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
