import { Button, Text, VStack } from "@chakra-ui/react";

import { useTranslations } from "@/lib/i18n/use-transations";

interface Props {
  onRetry: () => void;
}

// AIDEV-NOTE: generic failure for non-typed/unexpected errors; RETRY re-invokes the step
// that failed (the machine tracks which one). (R9)
export const CheckoutErrorNotice = ({ onRetry }: Props) => {
  const t = useTranslations("features.checkout.error");

  return (
    <VStack align="stretch" gap={3}>
      <Text fontWeight="semibold">{t("title")}</Text>
      <Text fontSize="sm" color="fg.muted">
        {t("message")}
      </Text>
      <Button colorPalette="orange" onClick={onRetry}>
        {t("retry")}
      </Button>
    </VStack>
  );
};
