import { useMutation, useQueryClient } from "@tanstack/react-query";

import { cartQueryKeys } from "@/lib/api/carts/cart-query-keys";
import { clearCartMutationOptions } from "@/lib/api/carts/{cart-id}/clear-cart-mutation";

export const useClearCartMutation = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    ...clearCartMutationOptions,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: cartQueryKeys.all });
    },
  });

  return [mutateAsync, isPending] as const;
};
