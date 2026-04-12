import { Button, VStack } from "@chakra-ui/react";

import { usePurchase } from "@/features/carts/application/use-purchase";
import type { PaymentMethod } from "@/features/carts/models/payment-method";
import { SelectInput } from "@/lib/components/Form/fields/SelectInput";
import { TextInput } from "@/lib/components/Form/fields/TextInput";
import { FormProvider } from "@/lib/components/Form/FormProvider";
import { useForm } from "@/lib/components/Form/use-form";
import { useTranslations } from "@/lib/i18n/use-transations";

interface CheckoutFormValues {
  fullName: string;
  address: string;
  method: PaymentMethod;
}

interface IProps {
  onSuccess?: () => void;
}

const CheckoutForm = ({ onSuccess }: IProps) => {
  const t = useTranslations("features.carts.checkout.form");
  const { purchase, isPending } = usePurchase();

  const form = useForm<CheckoutFormValues>({
    defaultValues: { method: "blik" },
  });

  const onSubmit = form.handleSubmit(async () => {
    const success = await purchase();
    if (success) onSuccess?.();
  });

  return (
    <FormProvider {...form}>
      <VStack as="form" gap={4} onSubmit={onSubmit} align="stretch">
        <TextInput name="fullName" label={t("full-name")} isRequired />
        <TextInput name="address" label={t("address")} isRequired />
        <SelectInput
          name="method"
          label={t("payment-method")}
          isRequired
          options={[
            { value: "blik", label: t("payment-methods.blik") },
            { value: "card", label: t("payment-methods.card") },
            { value: "paypal", label: t("payment-methods.paypal") },
          ]}
        />
        <Button type="submit" colorPalette="blue" w="100%" loading={isPending}>
          {t("submit")}
        </Button>
      </VStack>
    </FormProvider>
  );
};

export { CheckoutForm };
