import { createUserCore } from "src/user/user.core";
import { RootStore } from "./app.store";
import { type UserRepository } from "src/user/user.repository";

export type AppCore = ReturnType<typeof createAppCore>;

interface AppCoreArgs {
  rootStore: RootStore;
  userRepository: UserRepository;
}

export const createAppCore = ({ rootStore, userRepository }: AppCoreArgs) => {
  const userCore = createUserCore({
    userRepository,
    userStore: rootStore.userStore,
  });
  return {
    userCore,
  };
};
