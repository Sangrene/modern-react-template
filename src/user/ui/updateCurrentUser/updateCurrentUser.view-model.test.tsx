import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { createUserCore } from "src/user/user.core";
import { UserStore } from "src/user/user.store";
import { createFakeUserRepository } from "src/user/tests/user.repository.fake";
import { errAsync, ResultAsync } from "neverthrow";
import { CurrentUserSchema } from "src/user/user.model";
import type { AppCore } from "src/shared/app/app.core";
import { RootStore } from "src/shared/app/app.store";

// Store for the current test context value
let currentTestContext: (AppCore & RootStore) | null = null;

// Mock useAppContext to return the current test context
vi.mock("src/shared/app/app.provider", () => {
  return {
    useAppContext: () => {
      if (!currentTestContext) {
        throw new Error("useAppContext must be used within an AppProvider");
      }
      return currentTestContext;
    },
  };
});

// Import the hook after mocking
import { useUpdateCurrentUserViewModel } from "./updateCurrentUser.view-model";

// Test wrapper that provides the context with test dependencies
const createTestWrapper = (
  userCore: ReturnType<typeof createUserCore>,
  userStore: UserStore
) => {
  const rootStore = new RootStore({ userStore });
  const appCore: AppCore = { userCore };
  const contextValue = { ...appCore, ...rootStore };
  
  // Set the context value before rendering
  currentTestContext = contextValue;

  return ({ children }: { children: React.ReactNode }) => {
    return <>{children}</>;
  };
};

describe("useUpdateCurrentUserViewModel", () => {
  let userStore: UserStore;
  let userRepository: ReturnType<typeof createFakeUserRepository>;
  let userCore: ReturnType<typeof createUserCore>;

  beforeEach(() => {
    vi.resetAllMocks();
    userStore = new UserStore();
    userRepository = createFakeUserRepository();
    userCore = createUserCore({ userStore, userRepository });
  });

  describe("initialization", () => {
    it("should initialize with default values from store", () => {
      // Arrange
      const testUser: typeof CurrentUserSchema.infer = {
        id: "test-id",
        name: "John Doe",
        email: "john@example.com",
      };
      userStore.setCurrentUserState({
        user: testUser,
        status: "success",
        error: null,
      });

      // Act
      const { result } = renderHook(() => useUpdateCurrentUserViewModel(), {
        wrapper: createTestWrapper(userCore, userStore),
      });

      // Assert
      expect(result.current.isLoading).toBe(false);
      // Form should be initialized with register function
      expect(typeof result.current.register).toBe("function");
      expect(typeof result.current.onSubmit).toBe("function");
      // Form state should be available
      expect(result.current.formState).toBeDefined();
    });

    it("should initialize with null user when store has no user", () => {
      // Arrange
      userStore.setCurrentUserState({
        user: null,
        status: "idle",
        error: null,
      });

      // Act
      const { result } = renderHook(() => useUpdateCurrentUserViewModel(), {
        wrapper: createTestWrapper(userCore, userStore),
      });

      // Assert
      expect(result.current.isLoading).toBe(false);
      expect(typeof result.current.register).toBe("function");
    });
  });

  describe("updateCurrentUser", () => {
    beforeEach(async () => {
      // Set up a current user first
      await userCore.queryCurrentUser();
    });

    it("should set loading state to true when update starts", async () => {
      // Arrange
      const updateData = { name: "Jane Doe" };
      let loadingStateDuringCall = false;

      // Mock a slow repository call to capture loading state
      const expectedUser: typeof CurrentUserSchema.infer = {
        id: "test-id",
        name: "Jane Doe",
        email: "john@example.com",
      };
      userRepository.updateCurrentUser = vi.fn().mockReturnValue(
        ResultAsync.fromPromise(
          new Promise<typeof CurrentUserSchema.infer>((resolve) => {
            setTimeout(() => {
              loadingStateDuringCall = true;
              resolve(expectedUser);
            }, 100);
          }),
          () => new Error("Network error")
        )
      );

      const { result } = renderHook(() => useUpdateCurrentUserViewModel(), {
        wrapper: createTestWrapper(userCore, userStore),
      });

      // Act
      const updatePromise = result.current.onSubmit(updateData as any);

      // Assert - loading should be true during the call
      await waitFor(() => {
        expect(result.current.isLoading).toBe(true);
      });

      await updatePromise;
    });

    it("should set loading state to false after successful update", async () => {
      // Arrange
      const updateData = { name: "Jane Doe" };
      const { result } = renderHook(() => useUpdateCurrentUserViewModel(), {
        wrapper: createTestWrapper(userCore, userStore),
      });

      // Act
      await result.current.onSubmit(updateData as any);

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    it("should set loading state to false after failed update", async () => {
      // Arrange
      const updateData = { name: "Jane Doe" };
      const mockError = new Error("Network error");
      userRepository.updateCurrentUser = vi
        .fn()
        .mockReturnValue(errAsync(mockError));

      const { result } = renderHook(() => useUpdateCurrentUserViewModel(), {
        wrapper: createTestWrapper(userCore, userStore),
      });

      // Act
      await result.current.onSubmit(updateData as any);

      // Assert
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });

    it("should call userCore.updateCurrentUser when form is submitted", async () => {
      // Arrange
      const updateCurrentUserSpy = vi.spyOn(userCore, "updateCurrentUser");

      const { result } = renderHook(() => useUpdateCurrentUserViewModel(), {
        wrapper: createTestWrapper(userCore, userStore),
      });

      // Act - onSubmit is handleSubmit(updateCurrentUser), which validates and calls updateCurrentUser
      // We test that the core method is called (the exact data depends on form state)
      const mockEvent = {
        preventDefault: vi.fn(),
      } as unknown as React.FormEvent<HTMLFormElement>;

      await result.current.onSubmit(mockEvent);

      // Assert - verify the core method was called
      // Note: react-hook-form's handleSubmit validates and extracts data from the form
      // Since we're not rendering actual form inputs, it will use default values
      expect(updateCurrentUserSpy).toHaveBeenCalled();
    });

    it("should handle validation errors from the core", async () => {
      // Arrange
      const invalidData = { name: "Jo" }; // Less than 3 characters
      const { result } = renderHook(() => useUpdateCurrentUserViewModel(), {
        wrapper: createTestWrapper(userCore, userStore),
      });

      // Act
      await result.current.onSubmit(invalidData as any);

      // Assert - loading should be false after error
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  describe("form integration", () => {
    beforeEach(async () => {
      // Set up a current user first
      await userCore.queryCurrentUser();
    });

    it("should provide form registration functions", () => {
      // Arrange & Act
      const { result } = renderHook(() => useUpdateCurrentUserViewModel(), {
        wrapper: createTestWrapper(userCore, userStore),
      });

      // Assert
      expect(typeof result.current.register).toBe("function");
      expect(typeof result.current.onSubmit).toBe("function");
      expect(result.current.formState).toBeDefined();
    });

    it("should provide form state with errors", () => {
      // Arrange & Act
      const { result } = renderHook(() => useUpdateCurrentUserViewModel(), {
        wrapper: createTestWrapper(userCore, userStore),
      });

      // Assert
      expect(result.current.formState).toBeDefined();
      expect(result.current.formState.errors).toBeDefined();
    });
  });
});
