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
  id: number;
  title: string;
  category: Category;
  price: number;
  imageUrl: string;
}

const ProductCard = ({ title, category, price, imageUrl, id }: IProps) => {
  const navigate = useNavigate();
  const categoryLabel = useCategoryLabel(category);
  const categoryColor = useSecondaryTextColor();

  return (
    <VStack spacing={3} overflow="hidden" rounded="lg" as="article">
      <Box
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
      <VStack w="100%" spacing={0} align="flex-start">
        <HStack
          w="100%"
          justify="space-between"
          fontSize={{ base: "md", md: "lg" }}
          fontWeight="semibold"
          spacing={6}
        >
          <Text
            isTruncated
            onClick={() =>
              navigate({
                path: routes.product.path,
                params: { productId: id.toString() },
              })
            }
            cursor="pointer"
          >
            {title}
          </Text>
          <Text>{moneyVO.format(price)}</Text>
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
