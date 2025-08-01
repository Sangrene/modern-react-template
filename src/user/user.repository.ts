import { type HTTPClient } from "src/shared/httpClient/httpClient";
import { CurrentUserSchema } from "./user.model";
import { UpdateCurrentUserInputSchema } from "./features/updateCurrentUser/updateCurrentUser.core";

export type UserRepository = ReturnType<typeof createUserRepository>;

export const createUserRepository = ({
  httpClient,
}: {
  httpClient: HTTPClient;
}) => {
  const queryCurrentUser = () => {
    return httpClient.get({
      url: "/api/user/current",
      responseType: CurrentUserSchema,
    });
  };

  const updateCurrentUser = (
    user: typeof UpdateCurrentUserInputSchema.infer
  ) => {
    return httpClient.post({
      url: "/api/user/current",
      body: user,
      responseType: CurrentUserSchema,
    });
  };

  return {
    queryCurrentUser,
    updateCurrentUser,
  };
};
