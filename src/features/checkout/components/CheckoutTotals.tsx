import { HStack, Text, VStack } from "@chakra-ui/react";

import type { Money } from "@/features/checkout/models/checkout-session";
import { moneyVO } from "@/lib/format/money";
import { useTranslations } from "@/lib/i18n/use-transations";

interface Props {
  subtotal: Money;
  discount: Money;
  shipping: Money;
  total: Money;
}

// AIDEV-NOTE: renders server-computed totals verbatim — no client arithmetic (R11). See 003.
export const CheckoutTotals = ({
  subtotal,
  discount,
  shipping,
  total,
}: Props) => {
  const t = useTranslations("features.checkout.totals");

  return (
    <VStack align="stretch" gap={1} w="100%">
      <Row label={t("subtotal")} money={subtotal} />
      <Row label={t("discount")} money={discount} />
      <Row label={t("shipping")} money={shipping} />
      <Row label={t("total")} money={total} bold />
    </VStack>
  );
};

const Row = ({
  label,
  money,
  bold,
}: {
  label: string;
  money: Money;
  bold?: boolean;
}) => (
  <HStack justify="space-between" fontWeight={bold ? "semibold" : "normal"}>
    <Text>{label}</Text>
    <Text>{moneyVO.format(money.amount, money.currency)}</Text>
  </HStack>
);
