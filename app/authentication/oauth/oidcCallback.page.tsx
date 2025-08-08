import type { Route } from "./+types/oidcCallback.page";
import { oidcAuth } from "src/authentication/oauth/oidcAuth.core";
import { useNavigate } from "react-router";
import { localStore } from "src/shared/persistentKvStore/localStorageKvStore";
import { httpClient } from "src/shared/httpClient/httpClient";
import { Spinner } from "app/components/Spinner";
import { useEffect } from "react";

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

  return await handleOidcCallback(code, state);
}

export function HydrateFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner size="large" />
    </div>
  );
}

export default function OidcCallback({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();
  useEffect(() => {
    loaderData.match(
      () => {
        navigate("/");
      },
      (error) => {
        console.error(error);
      }
    );
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Spinner size="large" />
    </div>
  );
}
