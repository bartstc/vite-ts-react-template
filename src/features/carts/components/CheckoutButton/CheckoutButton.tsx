import { Button } from "@chakra-ui/react";

import { usePurchaseDialogStore } from "@/features/carts/components/CheckoutButton/use-purchase-dialog-store";
import { useTranslations } from "@/lib/i18n/use-transations";

import { CheckoutDialog } from "./CheckoutDialog";

const CheckoutButton = () => {
  const onOpen = usePurchaseDialogStore((state) => state.onOpen);
  const t = useTranslations("features.carts.checkout");

  return (
    <>
      <Button w="100%" colorScheme="orange" onClick={() => onOpen()}>
        {t("button")}
      </Button>
      <CheckoutDialog />
    </>
  );
};

export { CheckoutButton };
