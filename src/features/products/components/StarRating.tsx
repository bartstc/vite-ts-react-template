import { HStack, Icon, Portal, Tooltip } from "@chakra-ui/react";
import { Star } from "lucide-react";

import { useTranslations } from "@/lib/i18n/use-transations";
import { useColorModeValue } from "@/lib/theme/use-color-mode";

interface IProps {
  rating: number;
}

const StarRating = ({ rating }: IProps) => {
  const idleStar = useColorModeValue("gray.400", "gray.600");
  const activeStar = useColorModeValue("gray.700", "gray.300");
  const t = useTranslations("features.products.rating");

  const countColor = (index: number) => {
    return Math.round(rating) >= index ? activeStar : idleStar;
  };

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <HStack gap={1} display="flex" alignItems="center" mt={2}>
          {Array.from([1, 2, 3, 4, 5]).map((number) => (
            <Icon key={number} color={countColor(number)} boxSize={3}>
              <Star fill="currentColor" />
            </Icon>
          ))}
        </HStack>
      </Tooltip.Trigger>
      <Portal>
        <Tooltip.Positioner>
          <Tooltip.Content>{t("tooltip", { rating })}</Tooltip.Content>
        </Tooltip.Positioner>
      </Portal>
    </Tooltip.Root>
  );
};

export { StarRating };
