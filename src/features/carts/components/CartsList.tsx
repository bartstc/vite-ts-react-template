import { ArrowForwardIcon } from "@chakra-ui/icons";
import { VStack, HStack, Button, Text, Divider } from "@chakra-ui/react";
import { type ComponentProps, Fragment } from "react";

import { CartItem } from "@/features/carts/components/CartItem";
import { CheckoutButton } from "@/features/carts/components/CheckoutButton/CheckoutButton";
import { moneyVO } from "@/lib/format/Money";
import { useTranslations } from "@/lib/i18n/useTransations";
import { useNavigate } from "@/lib/router";
import { routes } from "@/lib/router/routes";
import { useSecondaryTextColor } from "@/lib/theme/useSecondaryTextColor";

interface IProps {
  cartProducts: ComponentProps<typeof CartItem>[];
}

const CartsList = ({ cartProducts }: IProps) => {
  const navigate = useNavigate();
  const t = useTranslations("features.carts.list");

  const secondaryColor = useSecondaryTextColor();

  // todo: moneyVo.sum()
  const subtotal = cartProducts
    .map((cart) => cart.price)
    .reduce((a, b) => a + b, 0);

  return (
    <VStack w="100%" spacing={8}>
      {cartProducts.map((cart) => (
        <Fragment key={cart.id}>
          <CartItem {...cart} />
          <Divider />
        </Fragment>
      ))}
      <VStack w="100%" align="start" spacing={1}>
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
        <CheckoutButton />
        <Button
          variant="link"
          size="sm"
          colorScheme="blue"
          rightIcon={<ArrowForwardIcon />}
          onClick={() => navigate(routes.products)}
        >
          {t("continue-shopping")}
        </Button>
      </VStack>
    </VStack>
  );
};

export { CartsList };
