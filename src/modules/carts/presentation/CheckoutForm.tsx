import { useState } from "react";

import { Button, VStack } from "@chakra-ui/react";

import { t } from "utils";

import { TextInput, Select } from "shared/Form";

import { usePurchase } from "modules/carts/infrastructure";

import { usePurchaseNotifications } from "./useCheckoutNotifications";

interface IProps {
  onSuccess?: () => void;
}

const CheckoutForm = ({ onSuccess }: IProps) => {
  const [fullName, setFullName] = useState<string>();
  const [address, setAddress] = useState<string>();
  const [method, setMethod] = useState<string>("blik");

  const [purchase, isLoading] = usePurchase();
  const [notifySuccess, notifyFailure] = usePurchaseNotifications();

  return (
    <VStack
      as="form"
      spacing={4}
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
        {t("Full Name")}
      </TextInput>
      <TextInput
        id="address"
        value={address}
        onChange={(e) => setAddress(e.currentTarget.value)}
      >
        {t("Your address")}
      </TextInput>
      <Select
        id="method"
        options={[
          {
            label: t("BLIK"),
            value: "blik",
          },
          {
            label: "PayPal",
            value: "paypal",
          },
        ]}
        value={method}
        onChange={(e) => setMethod(e.target.value)}
      >
        {t("Payment method")}
      </Select>
      <VStack w="100%" pt={6}>
        <Button
          isLoading={isLoading}
          type="submit"
          colorScheme="orange"
          w="100%"
        >
          {t("Purchase")}
        </Button>
      </VStack>
    </VStack>
  );
};

export { CheckoutForm };
