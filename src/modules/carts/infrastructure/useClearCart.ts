import { useMutation } from "@tanstack/react-query";

import { httpService } from "utils/http";

export const useClearCart = (cartId: string) => {
  const { mutateAsync, isLoading } = useMutation(() =>
    httpService.delete(`carts/${cartId}`)
  );

  const handler = () => {
    return mutateAsync()
      .then(async () => {
        // optionally mutate related data
      })
      .catch((e) => {
        // listen for a specific error and act respectively (e.g. throwing a specific error and catch it later)
        // or notify backend about the error if needed
        throw e;
      });
  };

  return [handler, isLoading] as const;
};
