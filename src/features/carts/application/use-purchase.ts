import { usePurchaseMutation } from "@/features/carts/providers/use-purchase-mutation";

import { usePurchaseNotifications } from "./use-purchase-notifications";

export const usePurchase = () => {
  const [mutateAsync, isPending] = usePurchaseMutation();
  const { notifySuccess, notifyFailure } = usePurchaseNotifications();

  const purchase = async (): Promise<boolean> => {
    try {
      await mutateAsync();
      notifySuccess();
      return true;
    } catch {
      notifyFailure();
      return false;
    }
  };

  return { purchase, isPending };
};
