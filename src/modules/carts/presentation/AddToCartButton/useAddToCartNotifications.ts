import { t } from "utils";

import { useToast } from "shared/Toast";

export const useAddToCartNotifications = () => {
  const toast = useToast();

  const notifySuccess = () =>
    toast({
      status: "success",
      title: t("New product"),
      description: t("A product has been successfully added to your cart."),
    });

  const notifyFailure = () =>
    toast({
      status: "error",
      title: t("New product"),
      description: t(
        "Something went wrong with adding a product to a cart. Pleas try again or contact us."
      ),
    });

  const notifyNotAuthenticated = () =>
    toast({
      status: "warning",
      title: t("New product"),
      description: t("Please log in in order to add products."),
    });

  return { notifySuccess, notifyFailure, notifyNotAuthenticated } as const;
};
