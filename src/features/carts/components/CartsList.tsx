import { VStack, HStack, Button, Text, Separator } from "@chakra-ui/react";
import { ArrowRight } from "lucide-react";
import { type ComponentProps, Fragment, type ReactNode } from "react";

import { CartItem } from "@/features/carts/components/CartItem";
import { ConfirmRemoveProductDialog } from "@/features/carts/components/CartItem/ConfirmRemoveProductDialog";
import { moneyVO } from "@/lib/format/money";
import { useTranslations } from "@/lib/i18n/use-transations";
import { useNavigate } from "@/lib/router";
import { routes } from "@/lib/router/routes";
import { useSecondaryTextColor } from "@/lib/theme/use-secondary-text-color";

interface IProps {
  cartProducts: ComponentProps<typeof CartItem>[];
  // AIDEV-NOTE: checkout trigger is injected as a slot so carts stays decoupled from the
  // checkout slice (boundaries forbid carts -> checkout). The Cart page supplies it. See 003.
  checkoutAction?: ReactNode;
}

const CartsList = ({ cartProducts, checkoutAction }: IProps) => {
  const navigate = useNavigate();
  const t = useTranslations("features.carts.list");

  const secondaryColor = useSecondaryTextColor();

  // todo: moneyVo.sum()
  const subtotal = cartProducts
    .map((cart) => cart.price.amount)
    .reduce((a, b) => a + b, 0);

  return (
    <VStack w="100%" gap={8}>
      {cartProducts.map((cart) => (
        <Fragment key={cart.id}>
          <CartItem {...cart} />
          <Separator />
        </Fragment>
      ))}
      <VStack w="100%" align="start" gap={1}>
        <HStack
          w="100%"
          align="flex-start"
          justify="space-between"
          fontSize={{ base: "md", md: "lg" }}
          fontWeight="semibold"
        >
          <Text>{t("subtotal")}</Text>
          <Text>{moneyVO.format(subtotal)}</Text>
        </HStack>
        <Text fontSize="sm" color={secondaryColor}>
          {t("shipping-info")}
        </Text>
      </VStack>
      <VStack w="100%">
        {checkoutAction}
        <Button
          variant="plain"
          size="sm"
          colorPalette="blue"
          onClick={() => navigate(routes.products)}
        >
          {t("continue-shopping")}
          <ArrowRight />
        </Button>
      </VStack>
      <ConfirmRemoveProductDialog />
    </VStack>
  );
};

export { CartsList };
