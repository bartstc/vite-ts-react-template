import { useToast } from "@/lib/components/Toast/use-toast";
import { useTranslations } from "@/lib/i18n/use-transations";

export const useRemoveCartProductNotifications = () => {
  const t = useTranslations("features.carts.remove-product.notifications");
  const toast = useToast();

  const notifyDecrementSuccess = () =>
    toast({
      status: "success",
      title: t("title"),
      description: t("decrement-success"),
    });

  const notifyRemoveAllSuccess = () =>
    toast({
      status: "success",
      title: t("title"),
      description: t("remove-all-success"),
    });

  const notifyProductNotFoundError = () =>
    toast({
      status: "error",
      title: t("title"),
      description: t("product-not-found-error"),
    });

  const notifyFailure = () =>
    toast({
      status: "error",
      title: t("title"),
      description: t("error"),
    });

  return {
    notifyDecrementSuccess,
    notifyRemoveAllSuccess,
    notifyProductNotFoundError,
    notifyFailure,
  };
};
