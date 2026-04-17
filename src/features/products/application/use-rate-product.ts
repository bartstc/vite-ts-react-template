import { useState } from "react";

import { useAuthStore } from "@/features/auth/application/auth-store";
import { useRateProductMutation } from "@/features/products/providers/use-rate-product-mutation";

import { useRateProductNotifications } from "./use-rate-product-notifications";

export const useRateProduct = () => {
  const isAuthenticated = useAuthStore((store) => store.isAuthenticated);
  const [mutateAsync, isPending] = useRateProductMutation();
  const { notifyNotAuthenticated, notifySuccess, notifyFailure } =
    useRateProductNotifications();
  const [hasRated, setHasRated] = useState(false);

  const rate = async (productId: string, rating: number) => {
    if (!isAuthenticated) {
      notifyNotAuthenticated();
      return;
    }

    try {
      await mutateAsync(productId, rating);
      setHasRated(true);
      notifySuccess();
    } catch {
      notifyFailure();
    }
  };

  return { rate, isPending, hasRated };
};
