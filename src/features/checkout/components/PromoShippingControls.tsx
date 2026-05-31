import { Button, HStack, Input, NativeSelect, Text } from "@chakra-ui/react";
import { useState } from "react";

import {
  SHIPPING_OPTIONS,
  type ShippingOption,
} from "@/features/checkout/models/checkout-session";
import { useTranslations } from "@/lib/i18n/use-transations";

interface Props {
  promoCode: string | null;
  shippingOption: ShippingOption;
  promoError: string | null;
  isBusy: boolean;
  onApply: (input: {
    promoCode?: string;
    shippingOption?: ShippingOption;
  }) => void;
}

// AIDEV-NOTE: Promo + shipping controls — emits APPLY through onApply. Inline promoError
// is rendered here (PromoInvalid loops back to review without leaving the step). See 003.
export const PromoShippingControls = ({
  promoCode,
  shippingOption,
  promoError,
  isBusy,
  onApply,
}: Props) => {
  const t = useTranslations("features.checkout.controls");
  const [promoInput, setPromoInput] = useState(promoCode ?? "");

  return (
    <HStack align="flex-end" gap={3} flexWrap="wrap">
      <NativeSelect.Root size="sm" width="160px" disabled={isBusy}>
        <NativeSelect.Field
          aria-label={t("shipping-label")}
          value={shippingOption}
          onChange={(e) =>
            onApply({ shippingOption: e.currentTarget.value as ShippingOption })
          }
        >
          {SHIPPING_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {t(`shipping.${option}`)}
            </option>
          ))}
        </NativeSelect.Field>
        <NativeSelect.Indicator />
      </NativeSelect.Root>

      <HStack align="flex-start" flexDir="column" gap={1}>
        <Input
          size="sm"
          width="180px"
          placeholder={t("promo-placeholder")}
          aria-label={t("promo-label")}
          value={promoInput}
          disabled={isBusy}
          onChange={(e) => setPromoInput(e.currentTarget.value)}
        />
        {promoError && (
          <Text fontSize="xs" color="red.500">
            {promoError}
          </Text>
        )}
      </HStack>

      <Button
        size="sm"
        variant="outline"
        loading={isBusy}
        onClick={() => onApply({ promoCode: promoInput.trim() || undefined })}
      >
        {t("apply")}
      </Button>
    </HStack>
  );
};
