import { oidcAuth } from "~/authentication/oauth/oidcAuth";
import { useNavigate, useSearchParams } from "react-router";
import { localStore } from "~/persistentKvStore/localStorageKvStore";
import { httpClient } from "~/http/httpClient";

export default function OidcCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  if (!code || !state) {
    return <div>Invalid oidc callback</div>;
  }
  const { handleOidcCallback } = oidcAuth({
    localKvStore: localStore,
    httpClient: httpClient,
  });

  handleOidcCallback(code, state).map(() => {
    navigate("/");
  }).mapErr((error) => {
    console.error(error);
    navigate("/");
  });

  return <div>LOADING</div>;
}
