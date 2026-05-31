import { Heading, Separator, Text, VStack } from "@chakra-ui/react";

import { CheckoutLineItems } from "@/features/checkout/components/CheckoutLineItems";
import { CheckoutTotals } from "@/features/checkout/components/CheckoutTotals";
import type { Order } from "@/features/checkout/models/order";
import { useTranslations } from "@/lib/i18n/use-transations";

interface Props {
  order: Order;
  onClose: () => void;
}

// AIDEV-NOTE: terminal success — order id, line items, server totals. No payment/persistence
// this iteration. onClose lets the parent dismiss the dialog. See 003.
export const ConfirmationStep = ({ order, onClose }: Props) => {
  const t = useTranslations("features.checkout.confirmation");

  return (
    <VStack align="stretch" gap={4}>
      <Heading size="md">{t("title")}</Heading>
      <Text fontSize="sm" color="fg.muted">
        {t("order-id", { id: order.id })}
      </Text>
      <Separator />
      <CheckoutLineItems lineItems={order.lineItems} />
      <Separator />
      <CheckoutTotals
        subtotal={order.subtotal}
        discount={order.discount}
        shipping={order.shipping}
        total={order.total}
      />
      <Text
        as="button"
        color="blue.500"
        fontWeight="medium"
        onClick={onClose}
        textAlign="center"
      >
        {t("done")}
      </Text>
    </VStack>
  );
};
