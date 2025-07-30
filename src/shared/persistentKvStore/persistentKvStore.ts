import { Result } from "neverthrow";

export interface PersistentKvStore {
  getItem: (key: string) => Result<string, Error>;
  setItem: (key: string, value: string) => Result<void, Error>;
  removeItem: (key: string) => Result<void, Error>;
}