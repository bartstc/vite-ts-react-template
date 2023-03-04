import { DeleteIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";

import { t } from "utils";

import {
  ConfirmClearCartDialog,
  useConfirmClearCartDialogStore,
} from "./ConfirmClearCartDialog";

interface IProps {
  cartId: string;
}

const ClearCartButton = ({ cartId }: IProps) => {
  const onOpen = useConfirmClearCartDialogStore((state) => state.onOpen);

  return (
    <>
      <Button leftIcon={<DeleteIcon />} onClick={() => onOpen(cartId)}>
        {t("Clear cart")}
      </Button>
      <ConfirmClearCartDialog />
    </>
  );
};

export { ClearCartButton };
