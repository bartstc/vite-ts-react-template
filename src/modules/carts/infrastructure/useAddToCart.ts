import { useMutation } from "@tanstack/react-query";

import { dateVO } from "utils";
import { httpService } from "utils/http";
import { Logger } from "utils/logger";

import { useAuthStore } from "modules/auth/application";

interface IAddToCartValues {
  productId: number;
  quantity?: number;
}

interface IAddToCartDto {
  userId: number;
  date: string;
  products: Array<{ productId: number; quantity: number }>;
}

export const useAddToCart = () => {
  const cartId = useAuthStore((store) => store.user?.cartId);
  const userId = useAuthStore((store) => store.user?.id);

  const { mutateAsync, isLoading } = useMutation<
    void,
    unknown,
    IAddToCartValues
  >((body) =>
    httpService.put<void, IAddToCartDto>(`carts/${cartId}`, {
      userId,
      date: dateVO.now(),
      products: [{ productId: body.productId, quantity: body.quantity ?? 1 }],
    })
  );

  const handler = (body: IAddToCartValues) => {
    return mutateAsync(body)
      .then(async () => {
        // optionally mutate related data
      })
      .catch((e) => {
        // listen for a specific error and act respectively (e.g. throwing a specific error and catch it later)

        // notify backend about the error if needed
        Logger.error("An error occurred during adding an item to the cart", e);

        throw e;
      });
  };

  return [handler, isLoading] as const;
};
