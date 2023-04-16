import { DeleteIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";

import { t } from "utils";

import {
  ConfirmClearCartDialog,
  useConfirmClearCartDialogStore,
} from "./ConfirmClearCartDialog";

const ClearCartButton = () => {
  const onOpen = useConfirmClearCartDialogStore((state) => state.onOpen);

  return (
    <>
      <Button leftIcon={<DeleteIcon />} onClick={() => onOpen()}>
        {t("Clear cart")}
      </Button>
      <ConfirmClearCartDialog />
    </>
  );
};

export { ClearCartButton };
