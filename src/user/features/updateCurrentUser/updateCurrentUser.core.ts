import { err, ok } from "neverthrow";
import type { UserCoreArgs } from "src/user/user.core";
import { validateType } from "src/shared/schema/validateType";
import type { CurrentUserSchema } from "src/user/user.model";
import { type } from "arktype";

export const UpdateCurrentUserInputSchema = type({
  "name?": "string > 3",
  "email?": "string.email",
});

export const createUpdateCurrentUserCore = ({
  userRepository,
  userStore,
}: UserCoreArgs) => (user: typeof UpdateCurrentUserInputSchema.infer) => {
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