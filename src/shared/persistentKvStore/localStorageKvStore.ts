import { getClientEnv } from "src/shared/env/env";
import { ok, err, Result } from "neverthrow";
import type { PersistentKvStore } from "./persistentKvStore";



const getItem = (key: string) => {
  const env = getClientEnv();
  if(env.isErr()) {
    return err(new Error(env.error.join("\n")));
  }
  const oauthState = localStorage.getItem(`${env.value.APPLICATION_NAME}:${key}`);
  if (!oauthState) {
    return err(new Error(`Key '${key}' not found`));
  }
  return ok(oauthState);
};


const setItem = (key: string, value: string) => {
  const env = getClientEnv();
  if(env.isErr()) {
    return err(new Error(env.error.join("\n")));
  }
  localStorage.setItem(`${env.value.APPLICATION_NAME}:${key}`, value);
  return ok();
};



const removeItem = (key: string) => {
  const env = getClientEnv();
  if(env.isErr()) {
    return err(new Error(env.error.join("\n")));
  }
  localStorage.removeItem(`${env.value.APPLICATION_NAME}:${key}`);
  return ok();
};


export const localStore = {
  getItem,
  setItem,
  removeItem,
} satisfies PersistentKvStore;

