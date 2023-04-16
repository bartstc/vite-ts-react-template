import { t } from "utils";

import { useToast } from "shared/Toast";

export const useAddToCartNotifications = () => {
  const toast = useToast();

  const success = () =>
    toast({
      status: "success",
      title: t("New product"),
      description: t("A product has been successfully added to your cart."),
    });

  const failure = () =>
    toast({
      status: "error",
      title: t("New product"),
      description: t(
        "Something went wrong with adding a product to a cart. Pleas try again or contact us."
      ),
    });

  return [success, failure] as const;
};
