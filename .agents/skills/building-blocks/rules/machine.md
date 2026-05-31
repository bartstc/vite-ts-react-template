---
title: Machine
category: State Management
layer: application/
composedWith: provider
---

## Machine

XState v5 machine for multi-step async flows a `store` can't express — ordered steps, error-driven branching, "X only allowed in state Y" (checkout, auth, wizards). The machine owns the flow. Its actors are the slice's own `providers/`; only host-specific concerns (the cart id, what to do on success) are injected, so `features/checkout/` never imports `features/carts/`.

### Constraints

- **Discriminated-union context keyed by `type`** — one member per phase, each carrying only the fields valid in that phase. Derive phase types with `OneOfUnion<Ctx, "PHASE">` (from `lib/`); `assign` a fresh `type` on every transition, never spread optional fields onto a flat context.
- **Actors declared as `PromiseActorLogic<Out, In>`, never called inside the machine.** Reference by name (`src: "initiate"`); the provider supplies real ones via `machine.provide({ actors })` + `fromPromise`. The actors wrap this slice's own `providers/` — that is allowed. What stays out is sibling-slice and host coupling: inject the cart id and the success callback, don't import `features/carts/`.
- **Type actor rejections with `ErrorActorEvent<Id, Err>`** (from `lib/types/`) in the events union — `ErrorActorEvent<"initiate", CheckoutError>`. This types `event.error` as your domain error instead of `unknown`, so guards narrow it with `instanceof` rather than probing the payload.
- **Name reused logic in `setup`** — an `assign`/`emit` or guard used by more than one transition goes in `setup({ actions / guards })` and is referenced by name (`actions: "assignSession"`, `guard: "isOutOfStock"`). Inline only genuinely one-off logic. Build repetitive error guards with `isErrorOf(ErrorClass)` (from `lib/`) so each is a one-liner.
- **Guard on context, not just errors** — error guards (`isErrorOf`) pick the branch _into_ a state; context guards (derived from `context`, e.g. `failedStep`) pick the branch _out_. Recording which step failed lets `failed` RETRY that exact step instead of restarting the flow.
- **Talk outward with `emit`, not callbacks** — emit a typed event; the provider subscribes (`actor.on("*")` in a named effect) and reacts. The machine never imports the consequence.
- **Tag loading states** (`tags: ["loading"]`) so components read one flag.
- **Three files**: `checkout-machine.ts`, `checkout-actor-context.tsx` (context + `useCheckoutSelector` / `useCheckoutSend` / `useCheckoutActorContext`), `CheckoutActorProvider.tsx` (provides actors, wires emitted events). Components consume via the hooks, never the actor directly.

### Example

```ts
import { assign, emit, setup, type PromiseActorLogic } from "xstate";

import {
  EmptyCartError,
  OutOfStockError /* … */,
} from "@/features/checkout/models/checkout-error";
import { isErrorOf } from "@/lib/is-error-of";
import type { ErrorActorEvent } from "@/lib/types/error-actor-event";
import type { OneOfUnion } from "@/lib/types/one-of-union";

// AIDEV-NOTE: which step's actor rejected — so `failed` can RETRY that exact step.
type CheckoutStep = "initiate" | "apply" | "confirm";

type CheckoutMachineContext =
  | { type: "INITIAL"; cartId: string }
  | { type: "SESSION_READY"; cartId: string; session: CheckoutSession }
  | {
      type: "FAILED";
      cartId: string;
      session?: CheckoutSession;
      error: CheckoutError;
      failedStep: CheckoutStep;
    };

export type FailedContext = OneOfUnion<CheckoutMachineContext, "FAILED">;

type CheckoutMachineEvents =
  | { type: "CONFIRM" }
  | { type: "RETRY" }
  // typed rejection per actor → event.error is CheckoutError, not unknown
  | ErrorActorEvent<"initiate", CheckoutError>
  | ErrorActorEvent<"confirm", CheckoutError>;

export interface CheckoutMachineActors {
  initiate: PromiseActorLogic<CheckoutSession, string>; // wraps this slice's providers/
  confirm: PromiseActorLogic<Order, { session: CheckoutSession }>;
}

// catch-all branch sees event.error as unknown — coerce once
const toCheckoutError = (error: unknown): CheckoutError =>
  error instanceof Error
    ? (error as CheckoutError)
    : (new Error("Unexpected checkout error") as CheckoutError);

export type CheckoutMachineType = typeof checkoutMachine;

export const checkoutMachine = setup({
  types: {} as {
    context: CheckoutMachineContext;
    events: CheckoutMachineEvents;
    emitted: { type: "ORDER_CONFIRMED"; order: Order };
    input: { cartId: string };
  },
  actors: { ...({} as CheckoutMachineActors) },
  actions: {
    // reused by every onDone that produces a session — XState widens event to the full
    // union here, so narrow to the actor-output shape via unknown.
    assignSession: assign(({ context, event }) => ({
      type: "SESSION_READY" as const,
      cartId: context.cartId,
      session: (event as unknown as { output: CheckoutSession }).output,
    })),
    // one fail action per step — keeps the thrown CheckoutError verbatim and records the step
    failAtConfirm: assign(({ context, event }) => ({
      type: "FAILED" as const,
      cartId: context.cartId,
      error: toCheckoutError("error" in event ? event.error : undefined),
      failedStep: "confirm" as const,
    })),
  },
  guards: {
    isEmptyCart: isErrorOf(EmptyCartError), // builder → one-liner per error class
    isOutOfStock: isErrorOf(OutOfStockError),
    failedAtConfirm: ({ context }) =>
      context.type === "FAILED" && context.failedStep === "confirm",
  },
}).createMachine({
  id: "checkout",
  initial: "initiating",
  context: ({ input }) => ({ type: "INITIAL", cartId: input.cartId }),
  states: {
    initiating: {
      tags: ["loading"],
      invoke: {
        src: "initiate",
        input: ({ context }) => context.cartId,
        onDone: { target: "review", actions: "assignSession" },
        onError: [
          {
            guard: "isEmptyCart",
            target: "emptyCart",
            actions: "failAtInitiate",
          },
          { target: "failed", actions: "failAtInitiate" }, // catch-all last
        ],
      },
    },
    review: { on: { CONFIRM: { target: "confirming" } } },
    confirming: {
      tags: ["loading"],
      invoke: {
        src: "confirm",
        input: ({ context }) => ({ session: requireSession(context) }),
        onDone: {
          target: "confirmed",
          actions: [
            assign(/* type: "CONFIRMED", order: event.output */),
            // provider subscribes to ORDER_CONFIRMED → invalidates cart query. Machine
            // stays decoupled from carts.
            emit(({ event }) => ({
              type: "ORDER_CONFIRMED" as const,
              order: event.output,
            })),
          ],
        },
        onError: [
          {
            guard: "isOutOfStock",
            target: "outOfStock",
            actions: "failAtConfirm",
          },
          { target: "failed", actions: "failAtConfirm" },
        ],
      },
    },
    failed: {
      on: {
        // context guard branches OUT — retry the exact step that failed
        RETRY: [
          { guard: "failedAtConfirm", target: "confirming" },
          { guard: "failedAtInitiate", target: "initiating" },
        ],
      },
    },
    outOfStock: {},
    emptyCart: { type: "final" },
    confirmed: { type: "final" },
  },
});
```

```tsx
// CheckoutActorProvider.tsx — provides actors (own providers/), injects host concerns,
// wires emitted events via a named effect.
const checkoutActor = useActorRef(
  checkoutMachine.provide({
    actors: {
      initiate: fromPromise(({ input }) => initiateCheckout({ cartId: input })),
      confirm: fromPromise(({ input }) => confirmCheckout(input)),
    } satisfies CheckoutMachineActors,
  }),
  { input: { cartId } } // cartId + onConfirmed are the only injected host concerns
);

useEffect(
  function subscribeToCheckoutEvents() {
    const subscription = checkoutActor.on("*", (event) => {
      if (event.type === "ORDER_CONFIRMED") onConfirmed(event.order);
    });
    return subscription.unsubscribe;
  },
  [checkoutActor, onConfirmed]
);
// <CheckoutActorContext.Provider value={checkoutActor}>
```

```tsx
// checkout-actor-context.tsx — typed selector + send hooks over the actor
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
// useCheckoutActorContext() returns the actor itself, for the rare consumer that needs it.
```
