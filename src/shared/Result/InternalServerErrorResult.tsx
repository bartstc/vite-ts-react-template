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

import { ErrorIcon } from "./Icons";

interface IProps {
  children?: ReactNode;
}

const InternalServerErrorResult = ({ children }: IProps) => {
  const secondaryColor = useSecondaryTextColor();
  const notImplemented = useNotImplementedYetToast();

  return (
    <Center minH="100vh" as={VStack} textAlign="center" spacing={6}>
      <ErrorIcon />
      <VStack maxW="2xl">
        <Heading as="h2" size={{ base: "lg", md: "xl" }}>
          {t("Something went seriously wrong")}
        </Heading>
        <Text size={{ base: "md", md: "lg" }} color={secondaryColor}>
          {t(
            "It sounds like something unexpected happened right now. Please, inform our support team about this issue ASAP!"
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

export { InternalServerErrorResult };
