import { VStack } from "@chakra-ui/react";

import { DateVO, t } from "utils";

import { Page, PageHeader } from "shared/Layout";
import { ErrorPageStrategy } from "shared/Result";
import { useParams } from "shared/Router";

import { withRequireAuth } from "modules/auth/application";
import { useCartProductsQuery } from "modules/carts/infrastructure";
import { CartsList, ClearCartButton } from "modules/carts/presentation";

const CartPage = () => {
  const params = useParams<{ cartId: string }>();
  const { data } = useCartProductsQuery(params.cartId as string);

  return (
    <Page>
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
    </Page>
  );
};

export const Component = withRequireAuth(CartPage, { to: "/sign-in" });

export const ErrorBoundary = ErrorPageStrategy;
