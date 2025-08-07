import { oidcAuth } from "src/authentication/oauth/oidcAuth.core";
import { localStore } from "src/shared/persistentKvStore/localStorageKvStore";
import { httpClient } from "src/shared/httpClient/httpClient";

export async function loader() {
  const { handleLogout } = oidcAuth({
    localKvStore: localStore,
    httpClient: httpClient,
  });
  return handleLogout({ dontRedirect: true });
}