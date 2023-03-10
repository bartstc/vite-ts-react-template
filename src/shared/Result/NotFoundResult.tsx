import { ReactNode } from "react";

import {
  Center,
  Heading,
  Text,
  VStack,
  ButtonGroup,
  Button,
} from "@chakra-ui/react";
import { useSecondaryTextColor } from "theme";

import { t } from "utils";

import { useNotImplementedYetToast } from "shared/Toast";

import { WarningIcon } from "./Icons";

interface IProps {
  children?: ReactNode;
}

const NotFoundResult = ({ children }: IProps) => {
  const secondaryColor = useSecondaryTextColor();
  const notImplemented = useNotImplementedYetToast();

  return (
    <Center minH="75vh" as={VStack} textAlign="center" spacing={6}>
      <WarningIcon />
      <VStack maxW="2xl">
        <Heading as="h2" size={{ base: "lg", md: "xl" }}>
          {t("Page doesn't exist")}
        </Heading>
        <Text size={{ base: "md", md: "lg" }} color={secondaryColor}>
          {t(
            "Probably you got here by accident. If you think there is something wrong on our side, please contact us!"
          )}
        </Text>
      </VStack>
      <ButtonGroup>
        <Button onClick={notImplemented}>{t("Contact us!")}</Button>
        {children}
      </ButtonGroup>
    </Center>
  );
};

export { NotFoundResult };
