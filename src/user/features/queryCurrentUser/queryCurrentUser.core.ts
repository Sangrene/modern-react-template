import { err, ok } from "neverthrow";
import type { UserCoreArgs } from "src/user/user.core";

export const createQueryCurrentUserCore =
  ({ userRepository, userStore }: UserCoreArgs) =>
  () => {
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
