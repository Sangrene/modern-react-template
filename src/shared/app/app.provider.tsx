import { createContext, useContext, useMemo } from "react";
import { type AppCore, createAppCore } from "./app.core";
import { RootStore } from "./app.store";
import { UserStore } from "src/user/user.store";
import { createUserRepository } from "src/user/user.repository";
import { httpClient } from "../httpClient/httpClient";
import { createFakeUserRepository } from "src/user/tests/user.repository.fake";

const AppContext = createContext<AppCore & RootStore | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const rootStore = useMemo(
    () =>
      new RootStore({
        userStore: new UserStore(),
      }),
    []
  );
  
  const userRepository = useMemo(
    () =>
      createFakeUserRepository(),
    []
  );
  const appCore = useMemo(
    () =>
      createAppCore({
        rootStore,
        userRepository,
      }),
    []
  );
  return <AppContext.Provider value={{...appCore, ...rootStore}}>{children}</AppContext.Provider>;
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
