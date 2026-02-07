import { DeleteIcon } from "@chakra-ui/icons";
import { Button } from "@chakra-ui/react";

import { useConfirmClearCartDialogStore } from "@/features/carts/components/ClearCartButton/use-confirm-clear-cart-dialog-store";
import { useTranslations } from "@/lib/i18n/use-transations";

import { ConfirmClearCartDialog } from "./ConfirmClearCartDialog";

const ClearCartButton = () => {
  const onOpen = useConfirmClearCartDialogStore((state) => state.onOpen);
  const t = useTranslations("features.carts.clear-cart");

  return (
    <>
      <Button leftIcon={<DeleteIcon />} onClick={() => onOpen()}>
        {t("button")}
      </Button>
      <ConfirmClearCartDialog />
    </>
  );
};

export { ClearCartButton };
