import { useToast } from "@/lib/components/Toast/useToast";
import { useTranslations } from "@/lib/i18n/useTransations";

export const useAddToCartNotifications = () => {
  const t = useTranslations("features.carts.add-to-cart.notifications");
  const toast = useToast();

  const notifySuccess = () =>
    toast({
      status: "success",
      title: t("title"),
      description: t("success"),
    });

  const notifyFailure = () =>
    toast({
      status: "error",
      title: t("title"),
      description: t("error"),
    });

  const notifyNotAuthenticated = () =>
    toast({
      status: "warning",
      title: t("title"),
      description: t("not-authenticated"),
    });

  return { notifySuccess, notifyFailure, notifyNotAuthenticated } as const;
};
