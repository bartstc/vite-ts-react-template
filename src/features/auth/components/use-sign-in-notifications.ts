import { useToast } from "@/lib/components/Toast/use-toast";
import { useTranslations } from "@/lib/i18n/use-transations";

export const useSignInNotifications = () => {
  const t = useTranslations("features.auth.sign-in.notifications");

  const toast = useToast();

  const success = () => toast({ status: "success", description: t("success") });

  const failure = () => toast({ status: "error", description: t("error") });

  return [success, failure] as const;
};
