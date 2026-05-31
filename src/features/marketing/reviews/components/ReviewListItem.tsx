import {
  Box,
  HStack,
  Heading,
  Icon,
  IconButton,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Star, Trash2 } from "lucide-react";

import { useAuthStore } from "@/features/auth/application/auth-store";
import { useFormatDate } from "@/lib/date/use-format-date";
import { useTranslations } from "@/lib/i18n/use-transations";
import { useColorModeValue } from "@/lib/theme/use-color-mode";
import { useSecondaryTextColor } from "@/lib/theme/use-secondary-text-color";

import type { Review } from "../models/review";

import { useConfirmDeleteReviewDialogStore } from "./use-confirm-delete-review-dialog-store";

interface IProps {
  review: Review;
}

const ReviewListItem = ({ review }: IProps) => {
  const idleStar = useColorModeValue("gray.300", "gray.600");
  const activeStar = useColorModeValue("gray.700", "gray.300");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const secondaryColor = useSecondaryTextColor();
  const formatDate = useFormatDate();
  const t = useTranslations("features.marketing.reviews.list");

  const userId = useAuthStore((store) => store.user?.id);
  const onOpenDelete = useConfirmDeleteReviewDialogStore(
    (state) => state.onOpen
  );
  const isOwn = userId !== undefined && userId === review.userId;

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
          <HStack gap={2}>
            <Text fontSize="sm" color={secondaryColor}>
              {formatDate(review.createdAt)}
            </Text>
            {isOwn && (
              <IconButton
                aria-label={t("delete")}
                variant="ghost"
                size="xs"
                colorPalette="red"
                onClick={() => onOpenDelete(review.id)}
              >
                <Trash2 />
              </IconButton>
            )}
          </HStack>
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
