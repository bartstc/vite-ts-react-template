/* eslint-disable boundaries/dependencies */
import {
  Accordion,
  Box,
  Button,
  HStack,
  Separator,
  SimpleGrid,
  GridItem,
  Text,
  VStack,
} from "@chakra-ui/react";
import type { ReactNode } from "react";

import { AddToCartButton } from "@/features/carts/components/AddToCartButton/AddToCartButton";
import { ProductAddedDialog } from "@/features/carts/components/AddToCartButton/ProductAddedDialog";
import { useCategoryLabel } from "@/features/products/components/use-category-label";
import type { Product } from "@/features/products/models/product";
import { PageHeader } from "@/lib/components/Layout/PageHeader";
import { moneyVO } from "@/lib/format/money";
import { useTranslations } from "@/lib/i18n/use-transations";
import { useSecondaryTextColor } from "@/lib/theme/use-secondary-text-color";

interface IProps {
  product: Product;
  children?: ReactNode;
  onBack: () => void;
}

const accordionItems = [
  { value: "features", labelKey: "features", contentKey: "features-content" },
  { value: "care", labelKey: "care", contentKey: "care-content" },
  { value: "shipping", labelKey: "shipping", contentKey: "shipping-content" },
  { value: "returns", labelKey: "returns", contentKey: "returns-content" },
] as const;

const ProductDetails = ({ product, children, onBack }: IProps) => {
  const categoryLabel = useCategoryLabel(product.category);
  const secondaryColor = useSecondaryTextColor();
  const t = useTranslations("features.products.details");

  return (
    <SimpleGrid
      as="section"
      w="100%"
      maxW="1000px"
      columns={{ base: 1, lg: 2 }}
      gap={{ base: 6, md: 8 }}
      data-testid="product-details"
    >
      <ProductAddedDialog />
      <GridItem colSpan={1}>
        <Box overflow="hidden" rounded="xl">
          <Box
            h={{ base: 64, md: "lg" }}
            w="100%"
            bgSize="cover"
            bgPos="center"
            style={{ backgroundImage: `url(${product.imageUrl})` }}
          />
        </Box>
      </GridItem>
      <GridItem colSpan={1}>
        <VStack gap={{ base: 1, lg: 3 }} w="100%" align="start">
          <PageHeader
            title={product.name}
            description={t("collection", { category: categoryLabel })}
          />
          <HStack w="100%" height="24px" gap={4}>
            <Text fontWeight="semibold" fontSize={{ base: "lg", md: "xl" }}>
              {moneyVO.format(product.price.amount, product.price.currency)}
            </Text>
            <Separator orientation="vertical" />
            {children}
          </HStack>
          <Text
            color={secondaryColor}
            fontSize={{ base: "md", md: "lg" }}
            py={{ base: 4, md: 6 }}
          >
            {product.description}
          </Text>
          <VStack w="100%">
            <AddToCartButton productId={product.id} colorPalette="orange" />
            <Button w="100%" variant="outline" onClick={onBack}>
              {t("back-to-list")}
            </Button>
          </VStack>
          <Accordion.Root
            w="100%"
            pt={4}
            collapsible
            defaultValue={["features"]}
          >
            {accordionItems.map((item) => (
              <Accordion.Item key={item.value} value={item.value}>
                <Accordion.ItemTrigger>
                  <Box as="span" flex="1" textAlign="left">
                    {t(item.labelKey)}
                  </Box>
                  <Accordion.ItemIndicator />
                </Accordion.ItemTrigger>
                <Accordion.ItemContent>
                  <Accordion.ItemBody pb={4}>
                    {t(item.contentKey)}
                  </Accordion.ItemBody>
                </Accordion.ItemContent>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </VStack>
      </GridItem>
    </SimpleGrid>
  );
};

export { ProductDetails };
