import { useToast } from "@/lib/components/Toast/use-toast";
import { useTranslations } from "@/lib/i18n/use-transations";

export const useReviewFormNotifications = () => {
  const t = useTranslations("features.marketing.reviews.notifications");
  const toast = useToast();

  const notifySuccess = () =>
    toast({
      status: "success",
      title: t("title"),
      description: t("success"),
    });

  const notifyConflict = () =>
    toast({
      status: "warning",
      title: t("title"),
      description: t("conflict"),
    });

  const notifyFailure = () =>
    toast({
      status: "error",
      title: t("title"),
      description: t("error"),
    });

  return { notifySuccess, notifyConflict, notifyFailure } as const;
};
