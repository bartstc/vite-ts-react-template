import { Button } from "@chakra-ui/react";

import { CheckoutDialog } from "@/features/checkout/components/CheckoutDialog";
import { useCheckoutDialogStore } from "@/features/checkout/components/use-checkout-dialog-store";
import { useTranslations } from "@/lib/i18n/use-transations";

interface Props {
  cartId: string;
}

// AIDEV-NOTE: trigger + dialog for the checkout flow, owned entirely by the checkout slice.
// The Cart page renders this with the active cartId. See 003.
const CheckoutButton = ({ cartId }: Props) => {
  const onOpen = useCheckoutDialogStore((state) => state.onOpen);
  const t = useTranslations("features.checkout.button");

  return (
    <>
      <Button w="100%" colorPalette="orange" onClick={() => onOpen()}>
        {t("checkout")}
      </Button>
      <CheckoutDialog cartId={cartId} />
    </>
  );
};

export { CheckoutButton };
