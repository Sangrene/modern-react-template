import { oidcAuth } from "src/authentication/oauth/oidcAuth.core";
import { localStore } from "src/shared/persistentKvStore/localStorageKvStore";
import { httpClient } from "src/shared/httpClient/httpClient";
import { useTranslation } from "react-i18next";
import { Button } from "~/components/Button/Button";

export function LogoutButton() {
  const { t } = useTranslation();

  const { handleLogout } = oidcAuth({
    httpClient: httpClient,
    localKvStore: localStore,
  });

  const handleLogoutClick = () => {
    const result = handleLogout();
    if (result.isErr()) {
      console.error("Failed to logout:", result.error);
    }
  };

  return (
    <Button
      variant="secondary"
      size="md"
      onClick={handleLogoutClick}
      className="w-full"
    >
      {t("logout", "Logout")}
    </Button>
  );
}
