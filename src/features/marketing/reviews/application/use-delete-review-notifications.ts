import { useToast } from "@/lib/components/Toast/use-toast";
import { useTranslations } from "@/lib/i18n/use-transations";

export const useDeleteReviewNotifications = () => {
  const t = useTranslations("features.marketing.reviews.delete-notifications");
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

  return { notifySuccess, notifyFailure } as const;
};
