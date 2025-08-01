import type { UserStoreInterface } from "src/user/user.store";
import { enableStaticRendering } from "mobx-react-lite";

enableStaticRendering(typeof window === "undefined");

export class RootStore {
  userStore: UserStoreInterface;

  constructor({ userStore }: { userStore: UserStoreInterface }) {
    this.userStore = userStore;
  }
}
