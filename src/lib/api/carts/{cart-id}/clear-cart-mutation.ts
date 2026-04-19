import { mutationOptions } from "@tanstack/react-query";

import { httpService } from "@/lib/http";
import { Logger } from "@/lib/logger";
import { UnknownError } from "@/lib/types/unknown-error";

interface ClearCartDto {
  cartId: string;
}

export const clearCartMutationOptions = mutationOptions({
  mutationFn: async (body: ClearCartDto): Promise<void> => {
    try {
      await httpService.delete(`carts/${body.cartId}`);
    } catch (e) {
      Logger.error("An error occurred during clearing the cart", e as Error);
      throw new UnknownError();
    }
  },
});
