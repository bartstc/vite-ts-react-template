import { useToast } from "@/lib/components/Toast/use-toast";
import { useTranslations } from "@/lib/i18n/use-transations";

export const useRateProductNotifications = () => {
  const t = useTranslations("features.marketing.rating.notifications");
  const toast = useToast();

  const notifyNotAuthenticated = () =>
    toast({
      status: "warning",
      title: t("title"),
      description: t("not-authenticated"),
    });

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

  return { notifyNotAuthenticated, notifySuccess, notifyFailure } as const;
};
