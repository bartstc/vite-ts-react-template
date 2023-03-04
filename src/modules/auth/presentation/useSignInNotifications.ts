import { t } from "utils";

import { useToast } from "shared/Toast";

export const useSignInNotifications = () => {
  const toast = useToast();

  const success = () =>
    toast({
      status: "success",
      title: t("Sign in"),
      description: t("Logged in successfully."),
    });

  const failure = () =>
    toast({
      status: "error",
      title: t("Sign in"),
      description: t(
        "Something went wrong while signing in. Pleas try again or contact us."
      ),
    });

  return [success, failure] as const;
};
