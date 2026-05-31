import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import { cartQueryKeys } from "@/lib/api/carts/cart-query-keys";

// AIDEV-NOTE: returns the onConfirmed callback that clears the cart cache after an order is
// placed. Lives in checkout/providers (the data gateway) — checkout owns the consequence,
// carts stays unaware. detail() is a prefix of products(), so one invalidate covers both.
export const useCartInvalidation = (cartId: string) => {
  const queryClient = useQueryClient();

  return useCallback(() => {
    void queryClient.invalidateQueries({
      queryKey: cartQueryKeys.detail(cartId),
    });
  }, [queryClient, cartId]);
};
