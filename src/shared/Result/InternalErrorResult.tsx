import { ReactNode } from "react";

import { ButtonGroup } from "@chakra-ui/react";

import { t } from "utils";

import { ContactUsButton } from "./Buttons";
import { ErrorIcon } from "./Icons";
import { Result } from "./Result";

interface IProps {
  children?: ReactNode;
}

const InternalErrorResult = ({ children }: IProps) => {
  return (
    <Result
      image={<ErrorIcon />}
      heading={t("Something went wrong")}
      subheading={t(
        "It sounds like something unexpected happened right now. Please, give it a try later or, if it's urgent, contact our support team."
      )}
    >
      <ButtonGroup>
        <ContactUsButton />
        {children}
      </ButtonGroup>
    </Result>
  );
};

export { InternalErrorResult };
