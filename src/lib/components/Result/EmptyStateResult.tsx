import { ButtonGroup } from "@chakra-ui/react";
import type { ReactNode } from "react";

import { useTranslations } from "@/lib/i18n/use-transations";

import { RestFiltersButton } from "./Buttons/ResetFiltersButton";
import { WarningIcon } from "./Icons/WarningIcon";
import { Result } from "./Result";

interface IProps {
  children?: ReactNode;
}

const EmptyStateResult = ({ children }: IProps) => {
  const t = useTranslations("shared.result.empty-state");

  return (
    <Result
      image={<WarningIcon />}
      heading={t("heading")}
      subheading={t("description")}
    >
      <ButtonGroup>
        <RestFiltersButton />
        {children}
      </ButtonGroup>
    </Result>
  );
};

export { EmptyStateResult };
