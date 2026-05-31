import { Button, Text, VStack } from "@chakra-ui/react";

import { useTranslations } from "@/lib/i18n/use-transations";

interface Props {
  onRestart: () => void;
}

// AIDEV-NOTE: expiry message; RESTART re-runs initiate (R7).
export const SessionExpiredNotice = ({ onRestart }: Props) => {
  const t = useTranslations("features.checkout.session-expired");

  return (
    <VStack align="stretch" gap={3}>
      <Text fontWeight="semibold">{t("title")}</Text>
      <Text fontSize="sm" color="fg.muted">
        {t("message")}
      </Text>
      <Button colorPalette="orange" onClick={onRestart}>
        {t("restart")}
      </Button>
    </VStack>
  );
};
