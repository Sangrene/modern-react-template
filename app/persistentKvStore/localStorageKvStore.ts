import { getClientEnv } from "~/env/env";
import { ok, err, Result } from "neverthrow";
import type { PersistentKvStore } from "./persistentKvStore";



const getItem = (key: string) => {
  const env = getClientEnv();
  if(env.isErr()) {
    return err(env.error);
  }
  const oauthState = localStorage.getItem(`${env.value.APPLICATION_NAME}:${key}`);
  if (!oauthState) {
    return ok(null);
  }
  return ok(oauthState);
};


const setItem = (key: string, value: string) => {
  const env = getClientEnv();
  if(env.isErr()) {
    return err(env.error);
  }
  localStorage.setItem(`${env.value.APPLICATION_NAME}:${key}`, value);
  return ok();
};



const removeItem = (key: string) => {
  const env = getClientEnv();
  if(env.isErr()) {
    return err(env.error);
  }
  localStorage.removeItem(`${env.value.APPLICATION_NAME}:${key}`);
  return ok();
};


export const localStore = {
  getItem,
  setItem,
  removeItem,
} as PersistentKvStore;

