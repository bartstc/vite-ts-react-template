import { Button, VStack } from "@chakra-ui/react";
import { useState } from "react";

import type { PaymentMethod } from "@/features/carts/models/payment-method";
import { usePurchase } from "@/features/carts/providers/use-purchase";
import { Select } from "@/lib/components/Form/Select";
import { TextInput } from "@/lib/components/Form/TextInput";
import { useTranslations } from "@/lib/i18n/use-transations";

import { usePurchaseNotifications } from "./use-checkout-notifications";

interface IProps {
  onSuccess?: () => void;
}

const CheckoutForm = ({ onSuccess }: IProps) => {
  const t = useTranslations("features.carts.checkout.form");
  const [fullName, setFullName] = useState<string>();
  const [address, setAddress] = useState<string>();
  const [method, setMethod] = useState<PaymentMethod>("blik");

  const [purchase, isLoading] = usePurchase();
  const [notifySuccess, notifyFailure] = usePurchaseNotifications();

  return (
    <VStack
      as="form"
      gap={4}
      onSubmit={async (e) => {
        e.preventDefault();

        try {
          await purchase();
          notifySuccess();
          onSuccess?.();
        } catch {
          notifyFailure();
        }
      }}
    >
      <TextInput
        id="fullname"
        value={fullName}
        onChange={(e) => setFullName(e.currentTarget.value)}
      >
        {t("full-name")}
      </TextInput>
      <TextInput
        id="address"
        value={address}
        onChange={(e) => setAddress(e.currentTarget.value)}
      >
        {t("address")}
      </TextInput>
      <Select
        id="method"
        value={method}
        onChange={(e) => setMethod(e.currentTarget.value as PaymentMethod)}
        options={[
          { value: "blik", label: t("payment-methods.blik") },
          { value: "card", label: t("payment-methods.card") },
          { value: "paypal", label: t("payment-methods.paypal") },
        ]}
      >
        {t("payment-method")}
      </Select>
      <Button type="submit" colorPalette="blue" w="100%" loading={isLoading}>
        {t("submit")}
      </Button>
    </VStack>
  );
};

export { CheckoutForm };
