import { Button, HStack, Text, VStack } from "@chakra-ui/react";

import type { OutOfStockItem } from "@/features/checkout/models/checkout-session";
import { useTranslations } from "@/lib/i18n/use-transations";

interface Props {
  items: OutOfStockItem[];
  onBackToCart: () => void;
}

// AIDEV-NOTE: lists unavailable items (requested vs available) + back-to-cart. Quantity
// edits live in the cart UI, so there's no in-machine recovery — parent closes the flow (R5).
export const OutOfStockNotice = ({ items, onBackToCart }: Props) => {
  const t = useTranslations("features.checkout.out-of-stock");

  return (
    <VStack align="stretch" gap={3}>
      <Text fontWeight="semibold">{t("title")}</Text>
      <VStack align="stretch" gap={1}>
        {items.map((item) => (
          <HStack key={item.productId} justify="space-between">
            <Text>{item.productId}</Text>
            <Text fontSize="sm" color="fg.muted">
              {t("quantities", {
                requested: item.requested,
                available: item.available,
              })}
            </Text>
          </HStack>
        ))}
      </VStack>
      <Button colorPalette="orange" onClick={onBackToCart}>
        {t("back-to-cart")}
      </Button>
    </VStack>
  );
};
