import type { UserStoreInterface } from "./user.store";
import type { UserRepository } from "./user.repository";
import { createQueryCurrentUserCore } from "./features/queryCurrentUser/queryCurrentUser.core";
import { createUpdateCurrentUserCore } from "./features/updateCurrentUser/updateCurrentUser.core";

export interface UserCoreArgs {
  userStore: UserStoreInterface;
  userRepository: UserRepository;
}
export const createUserCore = (args: UserCoreArgs) => {
  const updateCurrentUser = createUpdateCurrentUserCore(args);
  const queryCurrentUser = createQueryCurrentUserCore(args);

  return {
    queryCurrentUser,
    updateCurrentUser,
  };
};
