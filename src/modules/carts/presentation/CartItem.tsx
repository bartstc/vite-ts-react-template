import { CheckIcon } from "@chakra-ui/icons";
import { Box, Text, VStack, HStack, Button, Stack } from "@chakra-ui/react";
import { useSecondaryTextColor } from "theme";

import { moneyVO, t } from "utils";

import { useNavigate } from "shared/Router";
import { useNotImplementedYetToast } from "shared/Toast";

import { useCategoryLabel } from "modules/products/presentation";
import { Category } from "modules/products/types";

interface IProps {
  id: number;
  title: string;
  category: Category;
  price: number;
  imageUrl: string;
  quantity: number;
}

const CartItem = ({
  title,
  category,
  price,
  imageUrl,
  id,
  quantity,
}: IProps) => {
  const navigate = useNavigate();
  const categoryLabel = useCategoryLabel(category);
  const categoryColor = useSecondaryTextColor();
  const notImplemented = useNotImplementedYetToast();

  return (
    <Stack
      direction={{ base: "column", md: "row" }}
      spacing={3}
      overflow="hidden"
      justify="space-between"
      rounded="lg"
      w="100%"
    >
      <Stack
        direction={{ base: "column", md: "row" }}
        spacing={{ base: 2, md: 4 }}
        align="flex-start"
      >
        <Box
          onClick={() => navigate(`/products/${id}`)}
          cursor="pointer"
          h={40}
          w={64}
          bgSize="cover"
          bgPos="center"
          style={{
            backgroundImage: `url(${imageUrl})`,
          }}
        />
        <VStack
          w="100%"
          h={{ base: "auto", md: 40 }}
          spacing={0}
          align="flex-start"
          position="relative"
        >
          <HStack
            align="center"
            position="absolute"
            bottom={0}
            left={0}
            display={{ base: "none", md: "flex" }}
          >
            <CheckIcon color="green.400" />
            <Text fontSize="md">{t("In stock")}</Text>
          </HStack>
          <HStack
            w="100%"
            justify="space-between"
            fontSize="md"
            fontWeight="semibold"
            spacing={6}
          >
            <Text
              isTruncated
              onClick={() => navigate(`/products/${id}`)}
              cursor="pointer"
              mb={{ base: 0, md: 2 }}
            >
              {title}
            </Text>
          </HStack>
          <Text fontSize="sm" color={categoryColor}>
            {categoryLabel}
          </Text>
          <Text fontSize="sm" color={categoryColor}>
            {t("{quantity} quantity", { quantity })}
          </Text>
        </VStack>
      </Stack>
      <Stack
        direction={{ base: "row", md: "column" }}
        align={{ base: "center", md: "flex-end" }}
        justify="space-between"
        h={{ base: "auto", md: 40 }}
      >
        <Text fontSize="md" fontWeight="semibold">
          {moneyVO.format(price)}
        </Text>
        <Button variant="link" colorScheme="blue" onClick={notImplemented}>
          {t("Remove")}
        </Button>
      </Stack>
    </Stack>
  );
};

export { CartItem };
