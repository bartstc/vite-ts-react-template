import { useState } from "react";

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
  FormErrorMessage,
} from "@chakra-ui/react";
import { useSecondaryTextColor } from "theme";

import { t } from "utils";

import { useAuthStore } from "../application";
import { useSignInNotifications } from "./useSignInNotifications";

interface IProps {
  initialUsername?: string;
  initialPassword?: string;
}

export const SignInForm = ({ initialUsername, initialPassword }: IProps) => {
  const secondaryColor = useSecondaryTextColor();

  const [username, setUsername] = useState(initialUsername);
  const [password, setPassword] = useState(initialPassword);

  const [notifySuccess, notifyFailure] = useSignInNotifications();
  const login = useAuthStore((store) => store.login);

  const isUsernameError = username === "";
  const isPasswordError = password === "";

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
        <VStack
          as="form"
          spacing={4}
          onSubmit={(e) => {
            e.preventDefault();

            if (!username || !password) {
              return;
            }

            login({ username, password })
              .then(() => notifySuccess())
              .catch(() => notifyFailure());
          }}
        >
          <FormControl id="username" isRequired isInvalid={isUsernameError}>
            <FormLabel>{t("Username")}</FormLabel>
            <Input
              value={username}
              onChange={(e) => setUsername(e.currentTarget.value)}
            />
            {isUsernameError && (
              <FormErrorMessage>{t("Login is required.")}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl id="password" isRequired isInvalid={isPasswordError}>
            <FormLabel>{t("Password")}</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
            />
            {isPasswordError && (
              <FormErrorMessage>{t("Password is required.")}</FormErrorMessage>
            )}
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
            <Button type="submit" colorScheme="blue" w="100%">
              {t("Sign in")}
            </Button>
          </VStack>
        </VStack>
      </Box>
    </VStack>
  );
};
