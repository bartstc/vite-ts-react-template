import { useParams } from "react-router-dom";

import { VStack } from "@chakra-ui/react";

import { DateVO, t } from "utils";

import { Layout, PageHeader } from "shared/Layout";

import { useCartProductsQuery } from "modules/carts/infrastructure";
import { CartsList, ClearCartButton } from "modules/carts/presentation";

const CartPage = () => {
  const params = useParams<{ cartId: string }>();
  const { data, isLoading } = useCartProductsQuery(params.cartId as string);

  // todo: loading case...
  if (isLoading || !data) {
    return <h1>Loading ...</h1>;
  }

  return (
    <Layout>
      <VStack display="stretch" spacing={10}>
        <PageHeader
          title={t("List of selected products")}
          description={t(
            "These are all products that you yet chose (updated {time}).",
            {
              time: DateVO.formatRelativeTime(data.date),
            }
          )}
        >
          <ClearCartButton cartId={params.cartId as string} />
        </PageHeader>
        <CartsList
          cartProducts={data.products.map((product) => ({
            id: product.id,
            title: product.title,
            price: product.price,
            imageUrl: product.image,
            category: product.category,
            quantity: product.quantity,
          }))}
        />
      </VStack>
    </Layout>
  );
};

export { CartPage };
