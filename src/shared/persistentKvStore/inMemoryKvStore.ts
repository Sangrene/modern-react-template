import { type PersistentKvStore } from "./persistentKvStore";
import { Result, ok, err } from "neverthrow";

export const createMemoryStore = (): PersistentKvStore => {
  const memoryStore = new Map<string, string>();

  return {
    getItem: (key: string) => {
      try {
        const value = memoryStore.get(key);
        if (value === undefined) {
          return err(new Error(`Key '${key}' not found`));
        }
        return ok(value);
      } catch (error) {
        return err(
          error instanceof Error ? error : new Error("Unknown error occurred")
        );
      }
    },
    setItem: (key: string, value: string) => {
      try {
        memoryStore.set(key, value);
        return ok(undefined);
      } catch (error) {
        return err(
          error instanceof Error ? error : new Error("Unknown error occurred")
        );
      }
    },
    removeItem: (key: string) => {
      try {
        const deleted = memoryStore.delete(key);
        if (!deleted) {
          return err(new Error(`Key '${key}' not found`));
        }
        return ok(undefined);
      } catch (error) {
        return err(
          error instanceof Error ? error : new Error("Unknown error occurred")
        );
      }
    },
  };
};
