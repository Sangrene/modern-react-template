import { useCallback, useState } from "react";
import { useAppContext } from "src/shared/app/app.provider";
import { useForm } from "react-hook-form";
import { arktypeResolver } from "@hookform/resolvers/arktype";
import { UpdateCurrentUserInputSchema } from "src/user/features/updateCurrentUser/updateCurrentUser.core";

export const useUpdateCurrentUserViewModel = () => {
  const { userCore, userStore } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);

  const updateCurrentUser = useCallback(
    async (user: typeof UpdateCurrentUserInputSchema.infer) => {
      setIsLoading(true);
      return await userCore.updateCurrentUser(user).match(
        () => {
          setIsLoading(false);
        },
        () => {
          setIsLoading(false);
        }
      );
    },
    [userCore]
  );

  const { handleSubmit, formState, register } = useForm<
    typeof UpdateCurrentUserInputSchema.infer
  >({
    defaultValues: {
      name: userStore.currentUserState.user?.name,
      email: userStore.currentUserState.user?.email,
    },
    resolver: arktypeResolver(UpdateCurrentUserInputSchema),
  });
  return {
    formState,
    register,
    isLoading,
    onSubmit: handleSubmit(updateCurrentUser),
  };
};
