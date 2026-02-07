import { withRequireAuth } from "@/features/auth/application/withRequireAuth";
import { CartsList } from "@/features/carts/components/CartsList";
import { ClearCartButton } from "@/features/carts/components/ClearCartButton/ClearCartButton";
import { useCartProductsQuery } from "@/features/carts/providers/useCartProductsQuery";
import { Page } from "@/lib/components/Layout/Page";
import { PageHeader } from "@/lib/components/Layout/PageHeader";
import { ErrorPageStrategy } from "@/lib/components/Result/ErrorPageStrategy";
import { useRelativeTime } from "@/lib/date/useRelativeTime";
import { useTranslations } from "@/lib/i18n/useTransations";
import { useParams } from "@/lib/router";

const CartPage = () => {
  const params = useParams<{ cartId: string }>();
  const { data } = useCartProductsQuery(params.cartId!);
  const t = useTranslations("pages.cart");
  const relativeTime = useRelativeTime();

  return (
    <Page>
      <PageHeader
        title={t("title")}
        description={t("description", {
          time: relativeTime(data.date),
        })}
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
