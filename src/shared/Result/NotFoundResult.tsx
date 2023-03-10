import { ReactNode } from "react";

import { ButtonGroup } from "@chakra-ui/react";

import { t } from "utils";

import { ContactUsButton } from "./Buttons";
import { WarningIcon } from "./Icons";
import { Result } from "./Result";

interface IProps {
  children?: ReactNode;
}

const NotFoundResult = ({ children }: IProps) => {
  return (
    <Result
      image={<WarningIcon />}
      heading={t("Page doesn't exist")}
      subheading={t(
        "Probably you got here by accident. If you think there is something wrong on our side, please contact us!"
      )}
    >
      <ButtonGroup>
        <ContactUsButton />
        {children}
      </ButtonGroup>
    </Result>
  );
};

export { NotFoundResult };
