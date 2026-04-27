import { mutationOptions } from "@tanstack/react-query";

import { httpService } from "@/lib/http";
import { Logger } from "@/lib/logger";
import { UnknownError } from "@/lib/types/unknown-error";

export interface RemoveCartProductDto {
  cartId: string;
  productId: string;
}

export const removeCartProductMutationOptions = mutationOptions({
  mutationFn: async ({
    cartId,
    productId,
  }: RemoveCartProductDto): Promise<void> => {
    try {
      await httpService.delete(`carts/${cartId}/products/${productId}`);
    } catch (e) {
      Logger.error("Failed to remove product from cart", e as Error);
      if (httpService.isError(e) && e.message === "Product not found in cart") {
        throw new ProductNotFoundInCartError();
      }
      throw new UnknownError();
    }
  },
});

export class ProductNotFoundInCartError extends Error {
  constructor() {
    super("Product not found in cart");
    this.name = "ProductNotFoundInCartError";
  }
}
