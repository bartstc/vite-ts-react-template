import { Box, HStack, Heading, Icon, Text, VStack } from "@chakra-ui/react";
import { Star } from "lucide-react";

import { useFormatDate } from "@/lib/date/use-format-date";
import { useColorModeValue } from "@/lib/theme/use-color-mode";
import { useSecondaryTextColor } from "@/lib/theme/use-secondary-text-color";

import type { Review } from "../models/review";

interface IProps {
  review: Review;
}

const ReviewListItem = ({ review }: IProps) => {
  const idleStar = useColorModeValue("gray.300", "gray.600");
  const activeStar = useColorModeValue("gray.700", "gray.300");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const secondaryColor = useSecondaryTextColor();
  const formatDate = useFormatDate();

  return (
    <Box
      as="li"
      borderTopWidth="1px"
      borderColor={borderColor}
      py={4}
      listStyleType="none"
    >
      <VStack align="stretch" gap={2}>
        <HStack justify="space-between" align="center">
          <HStack gap={2}>
            <Text fontWeight="semibold">{review.authorName}</Text>
            <HStack gap={0.5}>
              {[1, 2, 3, 4, 5].map((n) => (
                <Icon
                  key={n}
                  color={review.rating >= n ? activeStar : idleStar}
                  boxSize={3}
                >
                  <Star fill="currentColor" />
                </Icon>
              ))}
            </HStack>
          </HStack>
          <Text fontSize="sm" color={secondaryColor}>
            {formatDate(review.createdAt)}
          </Text>
        </HStack>
        {review.title && (
          <Heading as="h4" size="sm">
            {review.title}
          </Heading>
        )}
        {review.comment && (
          <Text whiteSpace="pre-wrap" color={secondaryColor}>
            {review.comment}
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export { ReviewListItem };
