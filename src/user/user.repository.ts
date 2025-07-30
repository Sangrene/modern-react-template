import { type HTTPClient } from "src/shared/httpClient/httpClient";
import { CurrentUserSchema } from "./user.model";
import { ResultAsync } from "neverthrow";

export type UserRepository = ReturnType<typeof createUserRepository>;

export const createUserRepository = ({ httpClient }: { httpClient: HTTPClient }) => {
  const queryCurrentUser = () => {
    return httpClient.get({url:"/api/user/current", responseType: CurrentUserSchema});
  };

  return {
    queryCurrentUser,
  };
};