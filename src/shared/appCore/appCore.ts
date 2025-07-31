import { createUserCore } from "src/user/user.core";
import { RootStore } from "../appStore/rootStore";
import { createUserRepository } from "src/user/user.repository";
import { httpClient } from "../httpClient/httpClient";

const createAppCore = (rootStore: RootStore) => {
  const userRepository = createUserRepository({
    httpClient,
  });
  const userCore = createUserCore({
    userRepository,
    userStore: rootStore.userStore,
  });
  return {
    userCore,
  };
};

export default createAppCore;
