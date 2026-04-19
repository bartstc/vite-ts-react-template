import { useMutation } from "@tanstack/react-query";

import { purchaseMutationOptions } from "@/lib/api/carts/{cart-id}/purchase-mutation";

export const usePurchaseMutation = () => {
  const { mutateAsync, isPending } = useMutation({
    ...purchaseMutationOptions,
  });

  return [mutateAsync, isPending] as const;
};
