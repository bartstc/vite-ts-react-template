import { useToast } from "@/lib/components/Toast/use-toast";
import { useTranslations } from "@/lib/i18n/use-transations";

export const useClearCartNotifications = () => {
  const t = useTranslations("features.carts.clear-cart.notifications");
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
