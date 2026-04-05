import { useMutation } from "@tanstack/react-query";

import { DateVO } from "@/lib/date/date";
import { httpService } from "@/lib/http";
import { Logger } from "@/lib/logger";
import { UnknownError } from "@/lib/types/unknown-error";

interface AddToCartPayload {
  productId: number;
  quantity?: number;
  cartId: number;
  userId: number;
}

interface AddToCartDto {
  userId: number;
  date: string;
  products: { productId: number; quantity: number }[];
}

export const useAddToCartMutation = () => {
  const { mutateAsync, isPending } = useMutation<
    void,
    unknown,
    AddToCartPayload
  >({
    mutationFn: (body) =>
      httpService.put<void, AddToCartDto>(`carts/${body.cartId}`, {
        userId: body.userId,
        date: DateVO.now(),
        products: [{ productId: body.productId, quantity: body.quantity ?? 1 }],
      }),
  });

  const handler = async (body: AddToCartPayload) => {
    try {
      return await mutateAsync(body);
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
