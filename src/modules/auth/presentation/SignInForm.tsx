import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useSecondaryTextColor } from "theme";

import { t } from "utils";

export const SignInForm = () => {
  const secondaryColor = useSecondaryTextColor();

  return (
    <VStack align="stretch" spacing={8} w="100%" maxW="lg">
      <VStack textAlign="center">
        <Heading fontSize={{ base: "2xl", md: "4xl" }}>
          {t("Sign in to your account")}
        </Heading>
        <Text fontSize={{ base: "md", md: "lg" }} color={secondaryColor}>
          {t("to enjoy all of our cool {link} ✌️", {
            link: <Link color={"blue.400"}>{t("features")}</Link>,
          })}
        </Text>
      </VStack>
      <Box
        rounded="lg"
        bg={useColorModeValue("white", "gray.700")}
        boxShadow="lg"
        p={{ base: 6, md: 8 }}
      >
        <VStack spacing={4}>
          <FormControl id="email">
            <FormLabel>{t("Email address")}</FormLabel>
            <Input type="email" />
          </FormControl>
          <FormControl id="password">
            <FormLabel>{t("Password")}</FormLabel>
            <Input type="password" />
          </FormControl>
          <VStack w="100%" spacing={10}>
            <Stack
              w="100%"
              direction={{ base: "column", sm: "row" }}
              align="start"
              justify="space-between"
            >
              <Checkbox>{t("Remember me")}</Checkbox>
              <Link color="blue.400">{t("Forgot password?")}</Link>
            </Stack>
            <Button
              bg="blue.400"
              color="white"
              w="100%"
              _hover={{
                bg: "blue.500",
              }}
            >
              {t("Sign in")}
            </Button>
          </VStack>
        </VStack>
      </Box>
    </VStack>
  );
};
