import { dateVO, t } from "utils";

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
      <PageHeader
        title={t("List of selected products")}
        description={t(
          "These are all products that you yet chose (updated {time}).",
          {
            time: dateVO.formatRelativeTime(data.date),
          }
        )}
      >
        <ClearCartButton />
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
    </Page>
  );
};

export const Component = withRequireAuth(CartPage, { to: "/sign-in" });

export const ErrorBoundary = ErrorPageStrategy;
