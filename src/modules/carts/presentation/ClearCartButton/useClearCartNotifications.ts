import { t } from "utils";

import { useToast } from "shared/Toast";

export const useClearCartNotifications = () => {
  const toast = useToast();

  const success = () =>
    toast({
      status: "success",
      title: t("Clear cart"),
      description: t("Your cart has been successfully cleared."),
    });

  const failure = () =>
    toast({
      status: "error",
      title: t("Clear cart"),
      description: t(
        "Something went wrong with clearing your cart. Pleas try again or contact us."
      ),
    });

  return [success, failure] as const;
};
