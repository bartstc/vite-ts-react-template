import { useActorRef } from "@xstate/react";
import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import { fromPromise } from "xstate";

import { CheckoutActorContext } from "@/features/checkout/application/checkout-actor-context";
import {
  checkoutMachine,
  type CheckoutMachineActors,
} from "@/features/checkout/application/checkout-machine";
import type { Order } from "@/features/checkout/models/order";
import { applyCheckout } from "@/features/checkout/providers/apply-checkout";
import { confirmCheckout } from "@/features/checkout/providers/confirm-checkout";
import { initiateCheckout } from "@/features/checkout/providers/initiate-checkout";

// AIDEV-NOTE: the initiate/apply/confirm actors are this slice's own providers, imported
// directly. Only cartId and onConfirmed are injected from the host (the carts-related
// concerns) so features/checkout/ never imports features/carts/. See 003.
interface CheckoutActorProviderProps extends PropsWithChildren {
  cartId: string;
  onConfirmed: (order: Order) => void;
}

export const CheckoutActorProvider = ({
  children,
  cartId,
  onConfirmed,
}: CheckoutActorProviderProps) => {
  const checkoutActor = useActorRef(
    checkoutMachine.provide({
      actors: {
        initiate: fromPromise(({ input }) =>
          initiateCheckout({ cartId: input })
        ),
        apply: fromPromise(({ input }) => applyCheckout(input)),
        confirm: fromPromise(({ input }) => confirmCheckout(input)),
      } satisfies CheckoutMachineActors,
    }),
    { input: { cartId } }
  );

  useEffect(
    function subscribeToCheckoutEvents() {
      const subscription = checkoutActor.on("*", (event) => {
        const emittedEvent = event;

        if (emittedEvent.type === "ORDER_CONFIRMED") {
          onConfirmed(emittedEvent.order);
        }
      });

      return subscription.unsubscribe;
    },
    [checkoutActor, onConfirmed]
  );

  return (
    <CheckoutActorContext.Provider value={checkoutActor}>
      {children}
    </CheckoutActorContext.Provider>
  );
};
