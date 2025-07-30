import { UserStore } from "src/user/user.store";

export class RootStore {
  userStore: UserStore;

  constructor({ userStore }: { userStore: UserStore }) {
    this.userStore = userStore;
  }
}
