import type { UserStoreInterface } from "src/user/user.store";

export class RootStore {
  userStore: UserStoreInterface;

  constructor({ userStore }: { userStore: UserStoreInterface }) {
    this.userStore = userStore;
  }
}
