import { HStack, Text, VStack } from "@chakra-ui/react";

import type { CheckoutLineItem } from "@/features/checkout/models/checkout-session";
import { moneyVO } from "@/lib/format/money";

interface Props {
  lineItems: CheckoutLineItem[];
}

// AIDEV-NOTE: renders server-priced line items verbatim — no client arithmetic (R11).
export const CheckoutLineItems = ({ lineItems }: Props) => (
  <VStack align="stretch" gap={2} w="100%">
    {lineItems.map((item) => (
      <HStack key={item.productId} justify="space-between" gap={4}>
        <Text>
          {item.name}
          {" × "}
          {item.quantity}
        </Text>
        <Text>
          {moneyVO.format(item.lineTotal.amount, item.lineTotal.currency)}
        </Text>
      </HStack>
    ))}
  </VStack>
);
