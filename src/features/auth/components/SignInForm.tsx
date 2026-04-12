import {
  Box,
  Checkbox,
  Stack,
  Link,
  Button,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";

import { useAuthStore } from "@/features/auth/application/auth-store";
import { TextInput } from "@/lib/components/Form/fields/TextInput";
import { FormProvider } from "@/lib/components/Form/FormProvider";
import { useForm } from "@/lib/components/Form/use-form";
import { useTranslations } from "@/lib/i18n/use-transations";
import { useColorModeValue } from "@/lib/theme/use-color-mode";
import { useSecondaryTextColor } from "@/lib/theme/use-secondary-text-color";

import { useSignInNotifications } from "./use-sign-in-notifications";

interface SignInValues {
  username: string;
  password: string;
}

interface IProps {
  initialUsername?: string;
  initialPassword?: string;
}

export const SignInForm = ({ initialUsername, initialPassword }: IProps) => {
  const t = useTranslations("features.auth.sign-in.form");

  const secondaryColor = useSecondaryTextColor();

  const [notifySuccess, notifyFailure] = useSignInNotifications();
  const login = useAuthStore((store) => store.login);

  const form = useForm<SignInValues>({
    defaultValues: { username: initialUsername, password: initialPassword },
  });

  const onSubmit = form.handleSubmit(({ username, password }) => {
    login({ username, password })
      .then(() => notifySuccess())
      .catch(() => notifyFailure());
  });

  return (
    <VStack align="stretch" gap={8} w="100%" maxW="lg">
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
        <FormProvider {...form}>
          <VStack as="form" gap={4} onSubmit={onSubmit}>
            <TextInput name="username" label={t("username")} isRequired />
            <TextInput
              name="password"
              label={t("password")}
              type="password"
              isRequired
            />
            <VStack w="100%" gap={10}>
              <Stack
                w="100%"
                direction={{ base: "column", sm: "row" }}
                align="start"
                justify="space-between"
              >
                <Checkbox.Root>
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                  <Checkbox.Label>{t("remember-me")}</Checkbox.Label>
                </Checkbox.Root>
                <Link color="blue.400">{t("forgot-password")}</Link>
              </Stack>
              <Button type="submit" colorPalette="blue" w="100%">
                {t("sign-in")}
              </Button>
            </VStack>
          </VStack>
        </FormProvider>
      </Box>
    </VStack>
  );
};
