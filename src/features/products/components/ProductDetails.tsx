/* eslint-disable import/no-restricted-paths */
import {
  Box,
  Button,
  HStack,
  Text,
  VStack,
  SimpleGrid,
  GridItem,
  Divider,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";

import { AddToCartButton } from "@/features/carts/components/AddToCartButton/AddToCartButton";
import { ProductAddedDialog } from "@/features/carts/components/AddToCartButton/ProductAddedDialog";
import { StarRating } from "@/features/products/components/StarRating";
import { useCategoryLabel } from "@/features/products/components/use-category-label";
import type { Product } from "@/features/products/models/product";
import { PageHeader } from "@/lib/components/Layout/PageHeader";
import { moneyVO } from "@/lib/format/money";
import { useTranslations } from "@/lib/i18n/use-transations";
import { useSecondaryTextColor } from "@/lib/theme/use-secondary-text-color";

interface IProps {
  product: Product;
  onBack: () => void;
}

const ProductDetails = ({ product, onBack }: IProps) => {
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
            style={{
              backgroundImage: `url(${product.image})`,
            }}
          />
        </Box>
      </GridItem>
      <GridItem colSpan={1}>
        <VStack spacing={{ base: 1, lg: 3 }} w="100%" align="start">
          <PageHeader
            title={product.title}
            description={t("collection", { category: categoryLabel })}
          />
          <HStack w="100%" height="24px" spacing={4}>
            <Text fontWeight="semibold" fontSize={{ base: "lg", md: "xl" }}>
              {moneyVO.format(product.price)}
            </Text>
            <Divider orientation="vertical" />
            <StarRating rating={product.rating.rate} />
            <Button variant="link" colorScheme="orange">
              {t("see-reviews", { number: product.rating.count })}
            </Button>
          </HStack>
          <Text
            color={secondaryColor}
            fontSize={{ base: "md", md: "lg" }}
            py={{ base: 4, md: 6 }}
          >
            {product.description}
          </Text>
          <VStack w="100%">
            <AddToCartButton productId={product.id} colorScheme="orange" />
            <Button w="100%" variant="outline" onClick={onBack}>
              {t("back-to-list")}
            </Button>
          </VStack>
          <Accordion w="100%" pt={4} defaultIndex={[0]}>
            <AccordionItem>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  {t("features")}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>{t("features-content")}</AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  {t("care")}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>{t("care-content")}</AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  {t("shipping")}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>{t("shipping-content")}</AccordionPanel>
            </AccordionItem>
            <AccordionItem>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left">
                  {t("returns")}
                </Box>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4}>{t("returns-content")}</AccordionPanel>
            </AccordionItem>
          </Accordion>
        </VStack>
      </GridItem>
    </SimpleGrid>
  );
};

export { ProductDetails };
