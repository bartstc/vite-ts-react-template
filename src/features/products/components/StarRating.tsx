import { HStack, Icon, Portal, Tooltip } from "@chakra-ui/react";
import { Star } from "lucide-react";
import { useState } from "react";

import { useRateProduct } from "@/features/products/application/use-rate-product";
import { useTranslations } from "@/lib/i18n/use-transations";
import { useColorModeValue } from "@/lib/theme/use-color-mode";

interface IProps {
  rating: number;
  productId: string;
}

const StarRating = ({ rating, productId }: IProps) => {
  const idleStar = useColorModeValue("gray.300", "gray.600");
  const activeStar = useColorModeValue("gray.700", "gray.300");
  const t = useTranslations("features.products.rating");
  const { rate, isPending, hasRated } = useRateProduct();
  const isDisabled = isPending || hasRated;
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const starColor = (index: number) => {
    if (!isDisabled && hoveredIndex !== null) {
      return index <= hoveredIndex ? "yellow.400" : idleStar;
    }
    return Math.round(rating) >= index ? activeStar : idleStar;
  };

  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <HStack
          gap={1}
          display="flex"
          alignItems="center"
          mt={2}
          opacity={isDisabled ? 0.5 : 1}
          cursor={isDisabled ? "not-allowed" : "pointer"}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {Array.from([1, 2, 3, 4, 5]).map((number) => (
            <Icon
              key={number}
              color={starColor(number)}
              boxSize={3}
              style={{ transition: "color 0.15s ease" }}
              onMouseEnter={
                isDisabled ? undefined : () => setHoveredIndex(number)
              }
              onClick={isDisabled ? undefined : () => rate(productId, number)}
              cursor={isDisabled ? "not-allowed" : "pointer"}
            >
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
