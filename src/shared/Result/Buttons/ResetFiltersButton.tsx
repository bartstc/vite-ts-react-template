import { Button, ButtonProps } from "@chakra-ui/react";

import { t } from "utils";

import { useNotImplementedYetToast } from "shared/Toast";

interface IProps extends ButtonProps {}

const RestFiltersButton = (props: IProps) => {
  const notImplemented = useNotImplementedYetToast();

  return (
    <Button onClick={notImplemented} {...props}>
      {t("Reset filters")}
    </Button>
  );
};

export { RestFiltersButton };
