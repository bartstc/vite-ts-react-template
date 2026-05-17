import { Text } from "@chakra-ui/react";

import { useTranslations } from "@/lib/i18n/use-transations";

const ReviewListFallback = () => {
  const t = useTranslations("features.marketing.reviews.list");

  return <Text color="red.500">{t("error")}</Text>;
};

export { ReviewListFallback };
