import { ResultAsync, okAsync } from "neverthrow";
import { type UserRepository } from "../user.repository";
import { CurrentUserSchema } from "../user.model";

// Fixture user data
const fixtureUser: typeof CurrentUserSchema.infer = {
  id: "fake-user-id-123",
  name: "John Doe",
  email: "john.doe@example.com",
};

export const createFakeUserRepository = (): UserRepository => {
  const queryCurrentUser = (): ResultAsync<
    typeof CurrentUserSchema.infer,
    never
  > => {
    return okAsync(fixtureUser);
  };

  return {
    queryCurrentUser,
  };
};
