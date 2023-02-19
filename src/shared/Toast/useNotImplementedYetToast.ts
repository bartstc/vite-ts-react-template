import { t } from "utils";

import { useToast } from "./useToast";

export const useNotImplementedYetToast = () => {
  const toast = useToast();

  return () =>
    toast({
      status: "info",
      title: t("Feature not available yet"),
      description: t("We are working on it day and night :))"),
    });
};
