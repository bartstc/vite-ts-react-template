import { ButtonGroup } from "@chakra-ui/react";
import type { ReactNode } from "react";

import { useTranslations } from "@/lib/i18n/use-transations";

import { ContactUsButton } from "./Buttons/ContactUsButton";
import { ErrorIcon } from "./Icons/ErrorIcon";
import { Result } from "./Result";

interface IProps {
  children?: ReactNode;
}

const InternalServerErrorResult = ({ children }: IProps) => {
  const t = useTranslations("shared.result.server-error");

  return (
    <Result
      image={<ErrorIcon />}
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

export { InternalServerErrorResult };
