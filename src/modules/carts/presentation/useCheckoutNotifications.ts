import { t } from "utils";

import { useToast } from "shared/Toast";

export const usePurchaseNotifications = () => {
  const toast = useToast();

  const success = () =>
    toast({
      status: "success",
      title: t("Checkout"),
      description: t("You have successfully purchased all selected products."),
    });

  const failure = () =>
    toast({
      status: "error",
      title: t("Checkout"),
      description: t(
        "Something went wrong with finalizing a transaction. Pleas try again or contact us."
      ),
    });

  return [success, failure] as const;
};
