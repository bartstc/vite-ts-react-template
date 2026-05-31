import { Center, Spinner } from "@chakra-ui/react";

import {
  useCheckoutSelector,
  useCheckoutSend,
} from "@/features/checkout/application/checkout-actor-context";
import { CheckoutErrorNotice } from "@/features/checkout/components/CheckoutErrorNotice";
import { ConfirmationStep } from "@/features/checkout/components/ConfirmationStep";
import { EmptyCartNotice } from "@/features/checkout/components/EmptyCartNotice";
import { OutOfStockNotice } from "@/features/checkout/components/OutOfStockNotice";
import { PriceChangedNotice } from "@/features/checkout/components/PriceChangedNotice";
import { ReviewStep } from "@/features/checkout/components/ReviewStep";
import { SessionExpiredNotice } from "@/features/checkout/components/SessionExpiredNotice";
import {
  OutOfStockError,
  PriceChangedError,
} from "@/features/checkout/models/checkout-error";

interface Props {
  onClose: () => void;
}

export const CheckoutFlow = ({ onClose }: Props) => {
  const send = useCheckoutSend();
  const isLoading = useCheckoutSelector((state) => state.hasTag("loading"));
  const value = useCheckoutSelector((state) => state.value);
  const context = useCheckoutSelector((state) => state.context);

  if (isLoading) {
    return (
      <Center py={10}>
        <Spinner />
      </Center>
    );
  }

  if (value === "emptyCart") {
    return <EmptyCartNotice />;
  }

  if (value === "outOfStock") {
    const items =
      context.type === "FAILED" && context.error instanceof OutOfStockError
        ? context.error.items
        : [];
    return <OutOfStockNotice items={items} onBackToCart={onClose} />;
  }

  if (value === "priceChanged") {
    const changes =
      context.type === "FAILED" && context.error instanceof PriceChangedError
        ? context.error.changes
        : [];
    return (
      <PriceChangedNotice
        changes={changes}
        onContinue={() => send({ type: "CONTINUE" })}
      />
    );
  }

  if (value === "sessionExpired") {
    return <SessionExpiredNotice onRestart={() => send({ type: "RESTART" })} />;
  }

  if (value === "failed") {
    return <CheckoutErrorNotice onRetry={() => send({ type: "RETRY" })} />;
  }

  if (value === "confirmed" && context.type === "CONFIRMED") {
    return <ConfirmationStep order={context.order} onClose={onClose} />;
  }

  if (context.type === "SESSION_READY" || context.type === "PROMO_REJECTED") {
    return (
      <ReviewStep
        session={context.session}
        promoError={
          context.type === "PROMO_REJECTED" ? context.error.message : null
        }
        isBusy={isLoading}
        onApply={(input) => send({ type: "APPLY", ...input })}
        onConfirm={() => send({ type: "CONFIRM" })}
      />
    );
  }

  return null;
};
