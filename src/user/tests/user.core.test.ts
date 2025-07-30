import { describe, it, expect, vi, beforeEach } from "vitest";
import { createUserCore } from "../user.core";
import { UserStore } from "../user.store";
import { createFakeUserRepository } from "./user.repository.fake";
import { errAsync, okAsync, ResultAsync } from "neverthrow";
import { CurrentUserSchema } from "../user.model";

describe("UserCore", () => {
  let userStore: UserStore;
  let userRepository: ReturnType<typeof createFakeUserRepository>;
  let userCore: ReturnType<typeof createUserCore>;

  beforeEach(() => {
    userStore = new UserStore();
    userRepository = createFakeUserRepository();
    userCore = createUserCore({ userStore, userRepository });
  });

  describe("setCurrentUser", () => {
    it("should set the correct state when request succeeds", async () => {
      // Arrange
      const expectedUser: typeof CurrentUserSchema.infer = {
        id: "fake-user-id-123",
        name: "John Doe",
        email: "john.doe@example.com",
      };

      // Act
      const result = await userCore.setCurrentUser();

      // Assert
      expect(result.isOk()).toBe(true);
      expect(userStore.currentUserState).toStrictEqual({
        user: expectedUser,
        status: "success",
        error: null,
      });
    });

    it("Should set the correct state when request fails", async () => {
      // Arrange
      const mockError = new Error("Network error");
      userRepository.queryCurrentUser = vi
        .fn()
        .mockReturnValue(errAsync(mockError));

      const result = await userCore.setCurrentUser();

      expect(result.isErr()).toBe(true);
      expect(userStore.currentUserState).toStrictEqual({
        user: null,
        status: "error",
        error: mockError,
      });
    });

    it("Should set the correct state when request is loading", () => {
      // Arrange
      userRepository.queryCurrentUser = vi.fn().mockReturnValue(
        ResultAsync.fromPromise(
          new Promise((resolve) => {
            setTimeout(() => {
              resolve(null);
            }, 1000);
          }),
          () => new Error("Network error")
        )
      );

      userCore.setCurrentUser();

      expect(userStore.currentUserState).toStrictEqual({
        user: null,
        status: "loading",
        error: null,
      });
    });
  });
});
