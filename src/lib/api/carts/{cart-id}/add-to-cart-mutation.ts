import { useMutation } from "@tanstack/react-query";

import { httpService } from "@/lib/http";
import { Logger } from "@/lib/logger";
import { UnknownError } from "@/lib/types/unknown-error";

interface AddToCartPayload {
  productId: number;
  quantity?: number;
}

interface AddToCartDto {
  cartId: number;
  payload: AddToCartPayload;
}

export const useAddToCartMutation = () => {
  const { mutateAsync, isPending } = useMutation<void, unknown, AddToCartDto>({
    mutationFn: (body) =>
      httpService.put<void, AddToCartPayload>(`carts/${body.cartId}`, {
        productId: body.payload.productId,
        quantity: body.payload.quantity,
      }),
  });

  const handler = async (cartId: number, payload: AddToCartPayload) => {
    try {
      return await mutateAsync({ cartId, payload });
    } catch (e) {
      Logger.error(
        "An error occurred during adding an item to the cart",
        e as Error
      );

      if (httpService.isError(e) && e.message === "Unknown product") {
        throw new UnknownProductError();
      }

      if (httpService.isError(e) && e.message === "Product not available") {
        throw new ProductNotAvailableError();
      }

      throw new UnknownError();
    }
  };

  return [handler, isPending] as const;
};

export class UnknownProductError extends Error {
  constructor() {
    super("Unknown product");
    this.name = "UnknownProductError";
  }
}

export class ProductNotAvailableError extends Error {
  constructor() {
    super("Product not available");
    this.name = "ProductNotAvailableError";
  }
}
