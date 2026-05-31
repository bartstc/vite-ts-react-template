import { useSelector } from "@xstate/react";
import { createContext, useContext } from "react";
import type { ActorRefFrom, SnapshotFrom } from "xstate";

import type { CheckoutMachineType } from "@/features/checkout/application/checkout-machine";

export const CheckoutActorContext = createContext<
  ActorRefFrom<CheckoutMachineType>
>({} as ActorRefFrom<CheckoutMachineType>);

export function useCheckoutSelector<T>(
  selector: (snapshot: SnapshotFrom<CheckoutMachineType>) => T
) {
  const actor = useContext(CheckoutActorContext);

  if (!actor) throw new Error("CheckoutActorContext is missing the provider");

  return useSelector(actor, selector);
}

export function useCheckoutSend() {
  const actor = useContext(CheckoutActorContext);

  if (!actor) throw new Error("CheckoutActorContext is missing the provider");

  return actor.send;
}

export function useCheckoutActorContext() {
  const actor = useContext(CheckoutActorContext);

  if (!actor) throw new Error("CheckoutActorContext is missing the provider");

  return actor;
}
