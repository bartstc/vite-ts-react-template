import { Button, type ButtonProps } from "@chakra-ui/react";

import { useNotImplementedYetToast } from "@/lib/components/Toast/use-not-implemented-yet-toast";
import { useTranslations } from "@/lib/i18n/use-transations";

interface IProps extends ButtonProps {}

const RestFiltersButton = (props: IProps) => {
  const notImplemented = useNotImplementedYetToast();
  const t = useTranslations("shared.buttons");

  return (
    <Button onClick={notImplemented} {...props}>
      {t("reset-filters")}
    </Button>
  );
};

export { RestFiltersButton };
