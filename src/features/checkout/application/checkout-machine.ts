import { assign, emit, setup, type PromiseActorLogic } from "xstate";

import {
  type CheckoutError,
  EmptyCartError,
  OutOfStockError,
  PriceChangedError,
  PromoInvalidError,
  SessionExpiredError,
} from "@/features/checkout/models/checkout-error";
import type {
  CheckoutSession,
  ShippingOption,
} from "@/features/checkout/models/checkout-session";
import type { Order } from "@/features/checkout/models/order";
import { assertValue } from "@/lib/assert-value";
import { isErrorOf } from "@/lib/is-error-of";
import type { ErrorActorEvent } from "@/lib/types/error-actor-event";
import type { OneOfUnion } from "@/lib/types/one-of-union";

// AIDEV-NOTE: which step's actor rejected — so `failed` can RETRY the exact step that
// failed (initiate/apply/confirm) instead of always restarting from the top. See 003.
type CheckoutStep = "initiate" | "apply" | "confirm";

export type CheckoutMachineContext =
  | {
      type: "INITIAL";
      cartId: string;
    }
  | {
      type: "SESSION_READY";
      cartId: string;
      session: CheckoutSession;
    }
  | {
      type: "PROMO_REJECTED";
      cartId: string;
      session: CheckoutSession;
      error: CheckoutError;
    }
  | {
      type: "CONFIRMED";
      cartId: string;
      session: CheckoutSession;
      order: Order;
    }
  | {
      type: "FAILED";
      cartId: string;
      session?: CheckoutSession;
      error: CheckoutError;
      failedStep: CheckoutStep;
    };

export type SessionReadyContext = OneOfUnion<
  CheckoutMachineContext,
  "SESSION_READY"
>;
export type PromoRejectedContext = OneOfUnion<
  CheckoutMachineContext,
  "PROMO_REJECTED"
>;
export type ConfirmedContext = OneOfUnion<CheckoutMachineContext, "CONFIRMED">;
export type FailedContext = OneOfUnion<CheckoutMachineContext, "FAILED">;

type CheckoutMachineEvents =
  | { type: "APPLY"; promoCode?: string; shippingOption?: ShippingOption }
  | { type: "CONFIRM" }
  | { type: "CONTINUE" }
  | { type: "RESTART" }
  | { type: "RETRY" }
  | ErrorActorEvent<"initiate", CheckoutError>
  | ErrorActorEvent<"apply", CheckoutError>
  | ErrorActorEvent<"confirm", CheckoutError>;

export interface CheckoutMachineEmittedEvents {
  type: "ORDER_CONFIRMED";
  order: Order;
}

export interface CheckoutMachineActors {
  initiate: PromiseActorLogic<CheckoutSession, string>;
  apply: PromiseActorLogic<
    CheckoutSession,
    {
      session: CheckoutSession;
      promoCode?: string;
      shippingOption?: ShippingOption;
    }
  >;
  confirm: PromiseActorLogic<Order, { session: CheckoutSession }>;
}

export interface CheckoutMachineInput {
  cartId: string;
}

const requireSession = (context: CheckoutMachineContext): CheckoutSession => {
  const session = "session" in context ? context.session : undefined;
  assertValue(session, new MissingSessionError());
  return session;
};

const toCheckoutError = (error: unknown): CheckoutError =>
  error instanceof Error ? error : new Error("Unexpected checkout error");

export type CheckoutMachineType = typeof checkoutMachine;

export const checkoutMachine = setup({
  types: {} as {
    context: CheckoutMachineContext;
    events: CheckoutMachineEvents;
    emitted: CheckoutMachineEmittedEvents;
    input: CheckoutMachineInput;
  },
  actors: { ...({} as CheckoutMachineActors) },
  actions: {
    assignSession: assign(({ context, event }) => ({
      type: "SESSION_READY" as const,
      cartId: context.cartId,
      // AIDEV-NOTE: named action used only by initiate/apply onDone — XState widens the
      // event to the full union here, so narrow to the actor-output shape via unknown.
      session: (event as unknown as { output: CheckoutSession }).output,
    })),
    // AIDEV-NOTE: one fail action per step — keeps the thrown CheckoutError verbatim (it
    // carries items/changes) and records which step failed so `failed` can RETRY just that
    // step. Named in setup so XState infers the event union (event.error is CheckoutError).
    failAtInitiate: assign(({ context, event }) => ({
      type: "FAILED" as const,
      cartId: context.cartId,
      session: "session" in context ? context.session : undefined,
      error: toCheckoutError("error" in event ? event.error : undefined),
      failedStep: "initiate" as const,
    })),
    failAtApply: assign(({ context, event }) => ({
      type: "FAILED" as const,
      cartId: context.cartId,
      session: "session" in context ? context.session : undefined,
      error: toCheckoutError("error" in event ? event.error : undefined),
      failedStep: "apply" as const,
    })),
    failAtConfirm: assign(({ context, event }) => ({
      type: "FAILED" as const,
      cartId: context.cartId,
      session: "session" in context ? context.session : undefined,
      error: toCheckoutError("error" in event ? event.error : undefined),
      failedStep: "confirm" as const,
    })),
  },
  guards: {
    isEmptyCart: isErrorOf(EmptyCartError),
    isOutOfStock: isErrorOf(OutOfStockError),
    isPromoInvalid: isErrorOf(PromoInvalidError),
    isPriceChanged: isErrorOf(PriceChangedError),
    isSessionExpired: isErrorOf(SessionExpiredError),
    failedAtInitiate: ({ context }) =>
      context.type === "FAILED" && context.failedStep === "initiate",
    failedAtApply: ({ context }) =>
      context.type === "FAILED" && context.failedStep === "apply",
    failedAtConfirm: ({ context }) =>
      context.type === "FAILED" && context.failedStep === "confirm",
  },
}).createMachine({
  id: "checkout",
  initial: "initiating",
  context: ({ input }) => ({
    type: "INITIAL",
    cartId: input.cartId,
  }),
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
          {
            guard: "isOutOfStock",
            target: "outOfStock",
            actions: "failAtInitiate",
          },
          { target: "failed", actions: "failAtInitiate" },
        ],
      },
    },
    review: {
      on: {
        APPLY: { target: "applying" },
        CONFIRM: { target: "confirming" },
      },
    },
    applying: {
      tags: ["loading"],
      invoke: {
        src: "apply",
        input: ({ context, event }) => ({
          session: requireSession(context),
          promoCode: event.type === "APPLY" ? event.promoCode : undefined,
          shippingOption:
            event.type === "APPLY" ? event.shippingOption : undefined,
        }),
        onDone: { target: "review", actions: "assignSession" },
        onError: [
          {
            // AIDEV-NOTE: PromoInvalid is a field-level rejection — loop back to review
            // with an inline error, session unchanged. Not a dedicated state.
            guard: "isPromoInvalid",
            target: "review",
            actions: assign(({ context, event }) => ({
              type: "PROMO_REJECTED" as const,
              cartId: context.cartId,
              session: requireSession(context),
              error: toCheckoutError(
                "error" in event ? event.error : undefined
              ),
            })),
          },
          { target: "failed", actions: "failAtApply" },
        ],
      },
    },
    confirming: {
      tags: ["loading"],
      invoke: {
        src: "confirm",
        input: ({ context }) => ({ session: requireSession(context) }),
        onDone: {
          target: "confirmed",
          actions: [
            assign(({ context, event }) => ({
              type: "CONFIRMED" as const,
              cartId: context.cartId,
              session: requireSession(context),
              order: event.output,
            })),
            // AIDEV-NOTE: provider subscribes to ORDER_CONFIRMED and runs onConfirmed
            // (cart-query invalidation). Machine stays decoupled from carts.
            emit(({ event }) => ({
              type: "ORDER_CONFIRMED" as const,
              order: event.output,
            })),
          ],
        },
        onError: [
          {
            guard: "isPriceChanged",
            target: "priceChanged",
            actions: "failAtConfirm",
          },
          {
            guard: "isOutOfStock",
            target: "outOfStock",
            actions: "failAtConfirm",
          },
          {
            guard: "isSessionExpired",
            target: "sessionExpired",
            actions: "failAtConfirm",
          },
          { target: "failed", actions: "failAtConfirm" },
        ],
      },
    },
    priceChanged: {
      on: {
        CONTINUE: { target: "initiating" },
      },
    },
    sessionExpired: {
      on: {
        RESTART: { target: "initiating" },
      },
    },
    outOfStock: {},
    emptyCart: {
      type: "final",
    },
    failed: {
      on: {
        RETRY: [
          { guard: "failedAtApply", target: "applying" },
          { guard: "failedAtConfirm", target: "confirming" },
          { guard: "failedAtInitiate", target: "initiating" },
        ],
      },
    },
    confirmed: {
      type: "final",
    },
  },
});

class MissingSessionError extends Error {
  constructor() {
    super("Checkout requires a session in context");
    this.name = "MissingSessionError";
  }
}
