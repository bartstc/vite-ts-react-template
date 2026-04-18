import { HStack, Icon } from "@chakra-ui/react";
import { Star } from "lucide-react";

import { useColorModeValue } from "@/lib/theme/use-color-mode";

const ProductRatingFallback = () => {
  const mutedStar = useColorModeValue("gray.300", "gray.600");

  return (
    <HStack gap={4}>
      <HStack gap={1} alignItems="center" mt={2} opacity={0.5}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Icon key={n} color={mutedStar} boxSize={3}>
            <Star fill="currentColor" />
          </Icon>
        ))}
      </HStack>
    </HStack>
  );
};

export { ProductRatingFallback };
