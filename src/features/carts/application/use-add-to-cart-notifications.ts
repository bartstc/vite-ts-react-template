import { useToast } from "@/lib/components/Toast/use-toast";
import { useTranslations } from "@/lib/i18n/use-transations";

export const useAddToCartNotifications = () => {
  const t = useTranslations("features.carts.add-to-cart.notifications");
  const toast = useToast();

  const notifySuccess = () =>
    toast({
      status: "success",
      title: t("title"),
      description: t("success"),
    });

  const notifyNotAuthenticated = () =>
    toast({
      status: "warning",
      title: t("title"),
      description: t("not-authenticated"),
    });

  const notifyUnknownProduct = () =>
    toast({
      status: "error",
      title: t("title"),
      description: t("unknown-product-error"),
    });

  const notifyProductNotAvailable = () =>
    toast({
      status: "error",
      title: t("title"),
      description: t("product-not-available-error"),
    });

  const notifyFailure = () =>
    toast({
      status: "error",
      title: t("title"),
      description: t("error"),
    });

  return {
    notifySuccess,
    notifyFailure,
    notifyNotAuthenticated,
    notifyUnknownProduct,
    notifyProductNotAvailable,
  } as const;
};
