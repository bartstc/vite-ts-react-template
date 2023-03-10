import { ReactNode } from "react";

import { ButtonGroup } from "@chakra-ui/react";

import { t } from "utils";

import { ContactUsButton } from "./Buttons";
import { ErrorIcon } from "./Icons";
import { Result } from "./Result";

interface IProps {
  children?: ReactNode;
}

const InternalServerErrorResult = ({ children }: IProps) => {
  return (
    <Result
      image={<ErrorIcon />}
      heading={t("Something went seriously wrong")}
      subheading={t(
        "It sounds like something unexpected happened right now. Please, inform our support team about this issue ASAP!"
      )}
    >
      <ButtonGroup>
        <ContactUsButton />
        {children}
      </ButtonGroup>
    </Result>
  );
};

export { InternalServerErrorResult };
