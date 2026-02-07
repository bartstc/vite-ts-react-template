import { Button, type ButtonProps } from "@chakra-ui/react";

import { useNotImplementedYetToast } from "@/lib/components/Toast/use-not-implemented-yet-toast";
import { useTranslations } from "@/lib/i18n/use-transations";

interface IProps extends ButtonProps {}

const ContactUsButton = (props: IProps) => {
  const t = useTranslations("shared.buttons");
  const notImplemented = useNotImplementedYetToast();

  return (
    <Button onClick={notImplemented} {...props}>
      {t("contact-us")}
    </Button>
  );
};

export { ContactUsButton };
