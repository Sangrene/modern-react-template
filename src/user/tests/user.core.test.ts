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
    vi.resetAllMocks();
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
      const result = await userCore.queryCurrentUser();

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

      const result = await userCore.queryCurrentUser();

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

      userCore.queryCurrentUser();

      expect(userStore.currentUserState).toStrictEqual({
        user: null,
        status: "loading",
        error: null,
      });
    });
  });
  describe("updateCurrentUser", () => {
    beforeEach(async () => {
      // Set up a current user first
      await userCore.queryCurrentUser();
    });

    it("should set loading state before updating", async () => {
      // Arrange
      const updateData = { name: "Jane Doe" };
      let loadingStateCaptured = false;
      const originalUpdateCurrentUser = userRepository.updateCurrentUser;

      userRepository.updateCurrentUser = vi.fn().mockImplementation(() => {
        // Capture the state right before the repository call
        loadingStateCaptured = userStore.currentUserState.status === "loading";
        return originalUpdateCurrentUser(updateData);
      });

      // Act
      await userCore.updateCurrentUser(updateData);

      // Assert
      expect(loadingStateCaptured).toBe(true);
      expect(userRepository.updateCurrentUser).toHaveBeenCalledWith(updateData);
    });

    it("should reject invalid input", async () => {
      // Arrange
      const invalidInput = { name: "Jo" }; // Less than 3 characters

      // Act
      const result = await userCore.updateCurrentUser(invalidInput);

      // Assert
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.message).toContain("name");
      }
    });

    it("should perform optimistic update", async () => {
      // Arrange
      const updateData = { name: "Jane Doe" };
      const expectedOptimisticUser = {
        id: "fake-user-id-123",
        name: "Jane Doe",
        email: "john.doe@example.com",
      };

      // Mock a slow repository call to see the optimistic update
      userRepository.updateCurrentUser = vi.fn().mockReturnValue(
        ResultAsync.fromPromise(
          new Promise((resolve) => {
            setTimeout(() => {
              resolve(expectedOptimisticUser);
            }, 100);
          }),
          () => new Error("Network error")
        )
      );

      // Act
      const updatePromise = userCore.updateCurrentUser(updateData);

      // Check optimistic update immediately
      expect(userStore.currentUserState).toStrictEqual({
        user: expectedOptimisticUser,
        status: "loading",
        error: null,
      });

      // Wait for the actual update to complete
      await updatePromise;

      // Assert final state
      expect(userStore.currentUserState).toStrictEqual({
        user: expectedOptimisticUser,
        status: "success",
        error: null,
      });
    });

    it("should revert optimistic update on error", async () => {
      // Arrange
      const updateData = { name: "Jane Doe" };
      const originalState = userStore.currentUserState;
      const mockError = new Error("Network error");

      userRepository.updateCurrentUser = vi
        .fn()
        .mockReturnValue(errAsync(mockError));

      // Act
      const result = await userCore.updateCurrentUser(updateData);

      // Assert
      expect(result.isErr()).toBe(true);
      expect(userStore.currentUserState).toStrictEqual(originalState);
    });

    it("should reject update when no current user is set", async () => {
      // Arrange
      const updateData = { name: "Jane Doe" };
      userStore.setCurrentUserState({
        user: null,
        status: "idle",
        error: null,
      });

      // Act
      const result = await userCore.updateCurrentUser(updateData);

      // Assert
      expect(result.isErr()).toBe(true);
      if (result.isErr()) {
        expect(result.error.message).toBe("Current user not set");
      }
    });
  });
});
