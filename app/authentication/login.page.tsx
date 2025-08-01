import { useTranslation } from "react-i18next";
import { LoginButton } from "src/authentication/ui/LoginButton";

export default function LoginPage() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("meta.title", "New React Router App")}
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {t("meta.description", "Welcome to React Router!")}
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 py-8 px-6 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t("welcome", "Welcome to the app")}
              </h2>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Please sign in to continue
              </p>
            </div>
            
            <div className="space-y-4">
              <LoginButton />
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Secure authentication powered by OIDC
          </p>
        </div>
      </div>
    </main>
  );
}
