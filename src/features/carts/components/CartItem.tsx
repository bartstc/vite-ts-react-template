/* eslint-disable import/no-restricted-paths */
import { CheckIcon } from "@chakra-ui/icons";
import { Box, Text, VStack, HStack, Button, Stack } from "@chakra-ui/react";

import { useCategoryLabel } from "@/features/products/components/useCategoryLabel";
import { Category } from "@/features/products/models/Category";
import { useNotImplementedYetToast } from "@/lib/components/Toast/useNotImplementedYetToast";
import { moneyVO } from "@/lib/format/Money";
import { useTranslations } from "@/lib/i18n/useTransations";
import { useNavigate } from "@/lib/router";
import { routes } from "@/lib/router/routes";
import { useSecondaryTextColor } from "@/lib/theme/useSecondaryTextColor";

interface IProps {
  id: number;
  title: string;
  category: Category;
  price: number;
  imageUrl: string;
  quantity: number;
}

const CartItem = ({
  title,
  category,
  price,
  imageUrl,
  id,
  quantity,
}: IProps) => {
  const navigate = useNavigate();
  const t = useTranslations("features.carts.item");
  const categoryLabel = useCategoryLabel(category);
  const categoryColor = useSecondaryTextColor();
  const notImplemented = useNotImplementedYetToast();

  return (
    <Stack
      direction={{ base: "column", md: "row" }}
      spacing={3}
      overflow="hidden"
      justify="space-between"
      rounded="lg"
      w="100%"
    >
      <Stack
        direction={{ base: "column", md: "row" }}
        spacing={{ base: 2, md: 4 }}
        align="flex-start"
      >
        <Box
          onClick={() =>
            navigate({
              path: routes.product.path,
              params: { productId: id.toString() },
            })
          }
          cursor="pointer"
          w="100%"
          maxW="150px"
          h="100%"
          maxH="100px"
          bgImage={imageUrl}
          bgSize="contain"
          bgRepeat="no-repeat"
          bgPosition="center"
        />
        <VStack spacing={1} align="flex-start" justify="flex-start">
          <Text
            fontSize="lg"
            fontWeight="medium"
            onClick={() => navigate(`/products/${id}`)}
            cursor="pointer"
            _hover={{ color: "blue.500" }}
          >
            {title}
          </Text>
          <Text fontSize="sm" color={categoryColor}>
            {categoryLabel}
          </Text>
          <Text fontSize="sm">
            {t("quantity")} {quantity}
          </Text>
          <HStack spacing={2}>
            <CheckIcon color="green.500" />
            <Text color="green.500" fontSize="sm">
              {t("in-stock")}
            </Text>
          </HStack>
        </VStack>
      </Stack>
      <Stack
        direction={{ base: "row", md: "column" }}
        align={{ base: "center", md: "flex-end" }}
        spacing={{ base: 4, md: 2 }}
      >
        <Text fontSize="lg" fontWeight="medium">
          {moneyVO.format(price)}
        </Text>
        <Button size="sm" variant="ghost" onClick={notImplemented}>
          {t("remove")}
        </Button>
      </Stack>
    </Stack>
  );
};

export { CartItem };
