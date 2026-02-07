/* eslint-disable import/no-restricted-paths */
import { SimpleGrid, GridItem } from "@chakra-ui/react";

import { ProductAddedDialog } from "@/features/carts/components/AddToCartButton/ProductAddedDialog";
import type { Product } from "@/features/products/models/product";
import { EmptyStateResult } from "@/lib/components/Result/EmptyStateResult";

import { ProductCard } from "./ProductCard";

interface IProps {
  products: Product[];
}

const ProductsList = ({ products }: IProps) => {
  if (products.length === 0) {
    return <EmptyStateResult />;
  }

  return (
    <SimpleGrid columns={{ base: 1, md: 2 }} spacingY={16} spacingX={10}>
      <ProductAddedDialog />
      {products.map((product) => (
        <GridItem key={product.id} colSpan={1}>
          <ProductCard
            id={product.id}
            title={product.title}
            category={product.category}
            price={product.price}
            imageUrl={product.image}
          />
        </GridItem>
      ))}
    </SimpleGrid>
  );
};

export { ProductsList };
