import { Text, VStack } from "@chakra-ui/react";

import { useTranslations } from "@/lib/i18n/use-transations";

// AIDEV-NOTE: empty-cart message with no retry into the flow — terminal state (R8).
export const EmptyCartNotice = () => {
  const t = useTranslations("features.checkout.empty-cart");

  return (
    <VStack align="stretch" gap={2}>
      <Text fontWeight="semibold">{t("title")}</Text>
      <Text fontSize="sm" color="fg.muted">
        {t("message")}
      </Text>
    </VStack>
  );
};
