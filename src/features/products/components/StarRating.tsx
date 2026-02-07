import { StarIcon } from "@chakra-ui/icons";
import { HStack, Tooltip, useColorModeValue } from "@chakra-ui/react";

import { useTranslations } from "@/lib/i18n/useTransations";

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
    <Tooltip label={t("tooltip", { rating })}>
      <HStack spacing={1} display="flex" alignItems="center" mt={2}>
        {Array.from([1, 2, 3, 4, 5]).map((number) => (
          <StarIcon key={number} color={countColor(number)} />
        ))}
      </HStack>
    </Tooltip>
  );
};

export { StarRating };
