import { ReactNode } from "react";

import { ButtonGroup } from "@chakra-ui/react";

import { t } from "utils";

import { RestFiltersButton } from "./Buttons";
import { WarningIcon } from "./Icons";
import { Result } from "./Result";

interface IProps {
  children?: ReactNode;
}

const EmptyStateResult = ({ children }: IProps) => {
  return (
    <Result
      image={<WarningIcon />}
      heading={t("No results found")}
      subheading={t("Unfortunately, there is nothing for you here yet!")}
    >
      <ButtonGroup>
        <RestFiltersButton />
        {children}
      </ButtonGroup>
    </Result>
  );
};

export { EmptyStateResult };
