import { useMutation } from "@tanstack/react-query";

import { httpService } from "utils/http";

export const useClearCart = (cartId: number) => {
  const { mutateAsync, isLoading } = useMutation(() =>
    httpService.delete(`carts/${cartId}`)
  );

  const handler = () => {
    return mutateAsync()
      .then(async () => {
        // todo: optionally mutate related data
      })
      .catch((e) => {
        // todo: notify backend about the error
        throw e;
      });
  };

  return [handler, isLoading] as const;
};
