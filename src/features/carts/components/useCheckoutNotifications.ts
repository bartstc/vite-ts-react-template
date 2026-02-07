import { useToast } from "@/lib/components/Toast/useToast";
import { useTranslations } from "@/lib/i18n/useTransations";

export const usePurchaseNotifications = () => {
  const t = useTranslations("features.carts.checkout.notifications");
  const toast = useToast();

  const success = () =>
    toast({
      status: "success",
      title: t("title"),
      description: t("success"),
    });

  const failure = () =>
    toast({
      status: "error",
      title: t("title"),
      description: t("error"),
    });

  return [success, failure] as const;
};
