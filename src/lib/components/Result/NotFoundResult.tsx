import { ButtonGroup } from "@chakra-ui/react";
import type { ReactNode } from "react";

import { useTranslations } from "@/lib/i18n/use-transations";

import { ContactUsButton } from "./Buttons/ContactUsButton";
import { WarningIcon } from "./Icons/WarningIcon";
import { Result } from "./Result";

interface IProps {
  children?: ReactNode;
}

const NotFoundResult = ({ children }: IProps) => {
  const t = useTranslations("shared.result.not-found");

  return (
    <Result
      image={<WarningIcon />}
      heading={t("heading")}
      subheading={t("description")}
    >
      <ButtonGroup>
        <ContactUsButton />
        {children}
      </ButtonGroup>
    </Result>
  );
};

export { NotFoundResult };
