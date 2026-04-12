/* eslint-disable import/no-restricted-paths */
import { Box, Text, VStack, HStack } from "@chakra-ui/react";

import { AddToCartButton } from "@/features/carts/components/AddToCartButton/AddToCartButton";
import type { Category } from "@/features/products/models/category";
import { moneyVO } from "@/lib/format/money";
import { useNavigate } from "@/lib/router";
import { routes } from "@/lib/router/routes";
import { useSecondaryTextColor } from "@/lib/theme/use-secondary-text-color";

import { useCategoryLabel } from "./use-category-label";

interface IProps {
  id: string;
  name: string;
  category: Category;
  price: { amount: number; currency: string };
  imageUrl: string;
}

const ProductCard = ({ name, category, price, imageUrl, id }: IProps) => {
  const navigate = useNavigate();
  const categoryLabel = useCategoryLabel(category);
  const categoryColor = useSecondaryTextColor();

  return (
    <VStack
      gap={3}
      overflow="hidden"
      rounded="lg"
      as="article"
      aria-labelledby={`product-name-${id}`}
    >
      <Box
        role="img"
        aria-label={name}
        onClick={() => navigate(`/products/${id}`)}
        cursor="pointer"
        h={64}
        w="lg"
        bgSize="cover"
        bgPos="center"
        style={{
          backgroundImage: `url(${imageUrl})`,
        }}
      />
      <VStack w="100%" gap={0} align="flex-start">
        <HStack
          w="100%"
          justify="space-between"
          fontSize={{ base: "md", md: "lg" }}
          fontWeight="semibold"
          gap={6}
        >
          <Text
            id={`product-name-${id}`}
            truncate
            onClick={() =>
              navigate({
                path: routes.product.path,
                params: { productId: id },
              })
            }
            cursor="pointer"
          >
            {name}
          </Text>
          <Text>{moneyVO.format(price.amount, price.currency)}</Text>
        </HStack>
        <Text
          fontStyle="italic"
          fontSize={{ base: "sm", md: "md" }}
          color={categoryColor}
        >
          {categoryLabel}
        </Text>
      </VStack>
      <AddToCartButton productId={id} />
    </VStack>
  );
};

export { ProductCard };
