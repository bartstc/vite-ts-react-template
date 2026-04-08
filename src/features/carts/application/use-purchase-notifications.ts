import { useToast } from "@/lib/components/Toast/use-toast";
import { useTranslations } from "@/lib/i18n/use-transations";

export const usePurchaseNotifications = () => {
  const t = useTranslations("features.carts.checkout.notifications");
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

  return { notifySuccess, notifyFailure };
};
