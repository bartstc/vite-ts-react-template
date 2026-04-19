import { mutationOptions } from "@tanstack/react-query";

import { httpService } from "@/lib/http";
import { Logger } from "@/lib/logger";
import { UnknownError } from "@/lib/types/unknown-error";

export interface AddToCartPayload {
  productId: string;
  quantity?: number;
}

export interface AddToCartDto {
  cartId: string;
  payload: AddToCartPayload;
}

export const addToCartMutationOptions = mutationOptions({
  mutationFn: async (body: AddToCartDto): Promise<void> => {
    try {
      await httpService.put<void, AddToCartPayload>(
        `carts/${body.cartId}`,
        body.payload
      );
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
  },
});

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
