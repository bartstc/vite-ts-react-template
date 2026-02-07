import {
  Box,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";

import { useAuthStore } from "@/features/auth/application/authStore";
import { TextInput } from "@/lib/components/Form/TextInput";
import { useTranslations } from "@/lib/i18n/useTransations";
import { useSecondaryTextColor } from "@/lib/theme/useSecondaryTextColor";

import { useSignInNotifications } from "./useSignInNotifications";

interface IProps {
  initialUsername?: string;
  initialPassword?: string;
}

export const SignInForm = ({ initialUsername, initialPassword }: IProps) => {
  const t = useTranslations("features.auth.sign-in.form");

  const secondaryColor = useSecondaryTextColor();

  const [username, setUsername] = useState(initialUsername);
  const [password, setPassword] = useState(initialPassword);

  const [notifySuccess, notifyFailure] = useSignInNotifications();
  const login = useAuthStore((store) => store.login);

  return (
    <VStack align="stretch" spacing={8} w="100%" maxW="lg">
      <VStack textAlign="center">
        <Heading fontSize={{ base: "2xl", md: "4xl" }}>{t("header")}</Heading>
        <Text fontSize={{ base: "md", md: "lg" }} color={secondaryColor}>
          {t("description")}
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
          <TextInput
            id="username"
            value={username}
            onChange={(e) => setUsername(e.currentTarget.value)}
          >
            {t("username")}
          </TextInput>
          <TextInput
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
          >
            {t("password")}
          </TextInput>
          <VStack w="100%" spacing={10}>
            <Stack
              w="100%"
              direction={{ base: "column", sm: "row" }}
              align="start"
              justify="space-between"
            >
              <Checkbox>{t("remember-me")}</Checkbox>
              <Link color="blue.400">{t("forgot-password")}</Link>
            </Stack>
            <Button type="submit" colorScheme="blue" w="100%">
              {t("sign-in")}
            </Button>
          </VStack>
        </VStack>
      </Box>
    </VStack>
  );
};
