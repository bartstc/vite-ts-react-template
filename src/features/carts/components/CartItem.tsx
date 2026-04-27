/* eslint-disable boundaries/dependencies */
import {
  Box,
  Text,
  VStack,
  HStack,
  Button,
  Stack,
  Icon,
} from "@chakra-ui/react";
import { Check } from "lucide-react";

import { useCategoryLabel } from "@/features/products/components/use-category-label";
import { type Category } from "@/features/products/models/category";
import { moneyVO } from "@/lib/format/money";
import { useTranslations } from "@/lib/i18n/use-transations";
import { useNavigate } from "@/lib/router";
import { routes } from "@/lib/router/routes";
import { useSecondaryTextColor } from "@/lib/theme/use-secondary-text-color";

import { QuantityControls } from "./CartItem/QuantityControls";
import { useConfirmRemoveProductDialogStore } from "./CartItem/use-confirm-remove-product-dialog-store";

interface IProps {
  id: string;
  name: string;
  category: Category;
  price: { amount: number; currency: string };
  imageUrl: string;
  quantity: number;
}

const CartItem = ({
  name,
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
  const openRemoveDialog = useConfirmRemoveProductDialogStore((s) => s.onOpen);

  return (
    <Stack
      direction={{ base: "column", md: "row" }}
      gap={3}
      overflow="hidden"
      justify="space-between"
      rounded="lg"
      w="100%"
    >
      <Stack
        direction={{ base: "column", md: "row" }}
        gap={{ base: 2, md: 4 }}
        align="flex-start"
      >
        <Box
          onClick={() =>
            navigate({
              path: routes.product.path,
              params: { productId: id },
            })
          }
          cursor="pointer"
          flexShrink={0}
          w="100px"
          h="100px"
          rounded="md"
          overflow="hidden"
          bgSize="cover"
          bgPos="center"
          style={{
            backgroundImage: `url(${imageUrl})`,
          }}
        />
        <VStack gap={1} align="flex-start" justify="flex-start">
          <Text
            fontSize="lg"
            fontWeight="medium"
            onClick={() => navigate(`/products/${id}`)}
            cursor="pointer"
            _hover={{ color: "blue.500" }}
          >
            {name}
          </Text>
          <Text fontSize="sm" color={categoryColor}>
            {categoryLabel}
          </Text>
          <QuantityControls productId={id} quantity={quantity} />
          <HStack gap={2}>
            <Icon color="green.500">
              <Check />
            </Icon>
            <Text color="green.500" fontSize="sm">
              {t("in-stock")}
            </Text>
          </HStack>
        </VStack>
      </Stack>
      <Stack
        direction={{ base: "row", md: "column" }}
        align={{ base: "center", md: "flex-end" }}
        gap={{ base: 4, md: 2 }}
      >
        <Text fontSize="lg" fontWeight="medium">
          {moneyVO.format(price.amount, price.currency)}
        </Text>
        <Button
          size="sm"
          variant="ghost"
          onClick={() =>
            openRemoveDialog({ productId: id, quantity, mode: "remove-all" })
          }
        >
          {t("remove")}
        </Button>
      </Stack>
    </Stack>
  );
};

export { CartItem };
