import { Button, Separator, VStack } from "@chakra-ui/react";

import { CheckoutLineItems } from "@/features/checkout/components/CheckoutLineItems";
import { CheckoutTotals } from "@/features/checkout/components/CheckoutTotals";
import { PromoShippingControls } from "@/features/checkout/components/PromoShippingControls";
import type {
  CheckoutSession,
  ShippingOption,
} from "@/features/checkout/models/checkout-session";
import { useTranslations } from "@/lib/i18n/use-transations";

interface Props {
  session: CheckoutSession;
  promoError: string | null;
  isBusy: boolean;
  onApply: (input: {
    promoCode?: string;
    shippingOption?: ShippingOption;
  }) => void;
  onConfirm: () => void;
}

// AIDEV-NOTE: happy-path review — line items + server totals + promo/shipping controls +
// confirm. Totals rendered verbatim from the server session (R11). See 003.
export const ReviewStep = ({
  session,
  promoError,
  isBusy,
  onApply,
  onConfirm,
}: Props) => {
  const t = useTranslations("features.checkout.review");

  return (
    <VStack align="stretch" gap={4}>
      <CheckoutLineItems lineItems={session.lineItems} />
      <Separator />
      <PromoShippingControls
        promoCode={session.promoCode}
        shippingOption={session.shippingOption}
        promoError={promoError}
        isBusy={isBusy}
        onApply={onApply}
      />
      <Separator />
      <CheckoutTotals
        subtotal={session.subtotal}
        discount={session.discount}
        shipping={session.shipping}
        total={session.total}
      />
      <Button colorPalette="orange" loading={isBusy} onClick={onConfirm}>
        {t("confirm")}
      </Button>
    </VStack>
  );
};
