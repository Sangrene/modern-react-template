import { observable, action } from "mobx";
import { CurrentUserSchema } from "./user.model";

export type CurrentUserStatus = "idle" | "loading" | "success" | "error";

export type CurrentUserState = {
  user: typeof CurrentUserSchema.infer | null;
  status: CurrentUserStatus;
  error: Error | null;
};

export class UserStore {
  @observable accessor currentUserState: CurrentUserState = {
    user: null,
    status: "idle",
    error: null,
  };

  @action
  setCurrentUserState(state: CurrentUserState) {
    this.currentUserState = state;
  }
}
