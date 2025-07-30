import { UserStore } from "./user.store";
import type { UserRepository } from "./user.repository";
import { err, ok, okAsync, ResultAsync } from "neverthrow";
import { UpdateCurrentUserInputSchema } from "./user.input";
import { validateType } from "src/shared/schema/validateType";
import type { CurrentUserSchema } from "./user.model";

export const createUserCore = ({
  userStore,
  userRepository,
}: {
  userStore: UserStore;
  userRepository: UserRepository;
}) => {
  const updateCurrentUser = async (
    user: typeof UpdateCurrentUserInputSchema.infer
  ) => {
    return validateType(UpdateCurrentUserInputSchema, user)
      .andThen((user) => {
        const currentUser: typeof CurrentUserSchema.infer | null =
          userStore.currentUserState.user;
        if (!currentUser) {
          return err(new Error("Current user not set"));
        }
        const oldState = Object.assign({}, userStore.currentUserState);
        // Optimistic update
        userStore.setCurrentUserState({
          user: {
            ...currentUser,
            ...user,
          },
          status: "loading",
          error: null,
        });
        return ok(oldState);
      })
      .asyncAndThen((oldState) =>
        userRepository
          .updateCurrentUser(user)
          .mapErr((e) => {
            userStore.setCurrentUserState(oldState);
            return e;
          })
          .map((newUser) => {
            userStore.setCurrentUserState({
              user: newUser,
              status: "success",
              error: null,
            });
            return ok();
          })
      );
  };
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
    updateCurrentUser,
  };
};
