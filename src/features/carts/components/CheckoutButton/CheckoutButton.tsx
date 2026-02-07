import { Button } from "@chakra-ui/react";

import { usePurchaseDialogStore } from "@/features/carts/components/CheckoutButton/usePurchaseDialogStore";
import { useTranslations } from "@/lib/i18n/useTransations";

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
