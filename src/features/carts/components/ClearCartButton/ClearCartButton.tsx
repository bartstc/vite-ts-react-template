import { Button } from "@chakra-ui/react";
import { Trash2 } from "lucide-react";

import { useConfirmClearCartDialogStore } from "@/features/carts/components/ClearCartButton/use-confirm-clear-cart-dialog-store";
import { useTranslations } from "@/lib/i18n/use-transations";

import { ConfirmClearCartDialog } from "./ConfirmClearCartDialog";

const ClearCartButton = () => {
  const onOpen = useConfirmClearCartDialogStore((state) => state.onOpen);
  const t = useTranslations("features.carts.clear-cart");

  return (
    <>
      <Button onClick={() => onOpen()}>
        <Trash2 />
        {t("button")}
      </Button>
      <ConfirmClearCartDialog />
    </>
  );
};

export { ClearCartButton };
