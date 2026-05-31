import { Button, HStack, Text, VStack } from "@chakra-ui/react";

import type { PriceChange } from "@/features/checkout/models/checkout-session";
import { moneyVO } from "@/lib/format/money";
import { useTranslations } from "@/lib/i18n/use-transations";

interface Props {
  changes: PriceChange[];
  onContinue: () => void;
}

// AIDEV-NOTE: shows was/now per product; CONTINUE re-runs initiate back to review (R6).
export const PriceChangedNotice = ({ changes, onContinue }: Props) => {
  const t = useTranslations("features.checkout.price-changed");

  return (
    <VStack align="stretch" gap={3}>
      <Text fontWeight="semibold">{t("title")}</Text>
      <VStack align="stretch" gap={1}>
        {changes.map((change) => (
          <HStack key={change.productId} justify="space-between">
            <Text>{change.productId}</Text>
            <Text fontSize="sm" color="fg.muted">
              {t("was-now", {
                was: moneyVO.format(change.was.amount, change.was.currency),
                now: moneyVO.format(change.now.amount, change.now.currency),
              })}
            </Text>
          </HStack>
        ))}
      </VStack>
      <Button colorPalette="orange" onClick={onContinue}>
        {t("continue")}
      </Button>
    </VStack>
  );
};
