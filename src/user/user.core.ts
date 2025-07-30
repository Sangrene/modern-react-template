import { UserStore } from "./user.store";
import type { UserRepository } from "./user.repository";
import { err, ok } from "neverthrow";

export const createUserCore = ({
  userStore,
  userRepository,
}: {
  userStore: UserStore;
  userRepository: UserRepository;
}) => {
  const setCurrentUser = async () => {
    userStore.setCurrentUserState({
      user: null,
      status: "loading",
      error: null,
    });
    return userRepository.queryCurrentUser().match(
      (user) => {
        userStore.setCurrentUserState({
          user,
          status: "success",
          error: null,
        });
        return ok();
      },
      (error) => {
        userStore.setCurrentUserState({
          user: null,
          status: "error",
          error,
        });
        return err(error);
      }
    );
  };

  return {
    setCurrentUser,
  };
};
