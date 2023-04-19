import { Button } from "@chakra-ui/react";

import { t } from "utils";

import { CheckoutDialog, usePurchaseDialogStore } from "./CheckoutDialog";

const CheckoutButton = () => {
  const onOpen = usePurchaseDialogStore((state) => state.onOpen);

  return (
    <>
      <Button w="100%" colorScheme="orange" onClick={() => onOpen()}>
        {t("Checkout")}
      </Button>
      <CheckoutDialog />
    </>
  );
};

export { CheckoutButton };
