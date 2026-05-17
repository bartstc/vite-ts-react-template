import { Text } from "@chakra-ui/react";

import { useTranslations } from "@/lib/i18n/use-transations";
import { useSecondaryTextColor } from "@/lib/theme/use-secondary-text-color";

const ReviewListEmpty = () => {
  const t = useTranslations("features.marketing.reviews.list");
  const secondaryColor = useSecondaryTextColor();

  return <Text color={secondaryColor}>{t("empty")}</Text>;
};

export { ReviewListEmpty };
