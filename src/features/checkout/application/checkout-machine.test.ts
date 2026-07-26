/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import { describe, expect, it, vi } from "vitest";
import { createActor, fromPromise } from "xstate";

import {
  type CheckoutMachineActors,
  checkoutMachine,
  type ConfirmedContext,
  type FailedContext,
  type PromoRejectedContext,
} from "@/features/checkout/application/checkout-machine";
import {
  EmptyCartError,
  OutOfStockError,
  PriceChangedError,
  PromoInvalidError,
  SessionExpiredError,
} from "@/features/checkout/models/checkout-error";
import { CheckoutSessionFixture } from "@/test-lib/fixtures/checkout-session-fixture";
import { OrderFixture } from "@/test-lib/fixtures/order-fixture";
import { USER_CART_ID } from "@/test-lib/fixtures/user-fixture";

const session = CheckoutSessionFixture.toStructure();
const order = OrderFixture.toStructure();

// AIDEV-NOTE: builds an actor with overridable initiate/apply/confirm — defaults resolve
// to the happy-path session/order so each test only overrides the step it exercises.
const createCheckoutActor = (overrides: Partial<CheckoutMachineActors> = {}) =>
  createActor(
    checkoutMachine.provide({
      actors: {
        initiate: fromPromise(() => Promise.resolve(session)),
        apply: fromPromise(() => Promise.resolve(session)),
        confirm: fromPromise(() => Promise.resolve(order)),
        ...overrides,
      } as CheckoutMachineActors,
    }),
    { input: { cartId: USER_CART_ID } }
  );

describe("checkout-machine", () => {
  describe("initiate", () => {
    it("moves to review with the session on success", async () => {
      const actor = createCheckoutActor();
      actor.start();

      await expect.poll(() => actor.getSnapshot().value).toBe("review");
      expect(actor.getSnapshot().context).toMatchObject({
        type: "SESSION_READY",
        session,
      });
    });

    it("moves to emptyCart on EmptyCart error", async () => {
      const actor = createCheckoutActor({
        initiate: fromPromise(() => Promise.reject(new EmptyCartError())),
      });
      actor.start();

      await expect.poll(() => actor.getSnapshot().value).toBe("emptyCart");
    });

    it("moves to outOfStock with items on OutOfStock error", async () => {
      const items = [{ productId: "p1", requested: 3, available: 1 }];
      const actor = createCheckoutActor({
        initiate: fromPromise(() => Promise.reject(new OutOfStockError(items))),
      });
      actor.start();

      await expect.poll(() => actor.getSnapshot().value).toBe("outOfStock");
      const context = actor.getSnapshot().context as FailedContext;
      expect(context.error).toBeInstanceOf(OutOfStockError);
      expect((context.error as OutOfStockError).items).toEqual(items);
    });

    it("moves to failed on an unexpected error", async () => {
      const actor = createCheckoutActor({
        initiate: fromPromise(() => Promise.reject(new Error("boom"))),
      });
      actor.start();

      await expect.poll(() => actor.getSnapshot().value).toBe("failed");
    });
  });

  describe("apply", () => {
    it("moves back to review with the updated session", async () => {
      const updated: typeof session = { ...session, promoCode: "SAVE10" };
      const actor = createCheckoutActor({
        apply: fromPromise(() => Promise.resolve(updated)),
      });
      actor.start();
      await expect.poll(() => actor.getSnapshot().value).toBe("review");

      actor.send({ type: "APPLY", promoCode: "SAVE10" });

      await expect
        .poll(() => actor.getSnapshot().context.type)
        .toBe("SESSION_READY");
      expect(actor.getSnapshot().context).toMatchObject({ session: updated });
    });

    it("loops back to review with an inline promo error on PromoInvalid", async () => {
      const actor = createCheckoutActor({
        apply: fromPromise(() => Promise.reject(new PromoInvalidError())),
      });
      actor.start();
      await expect.poll(() => actor.getSnapshot().value).toBe("review");

      actor.send({ type: "APPLY", promoCode: "NOPE" });

      await expect
        .poll(() => actor.getSnapshot().context.type)
        .toBe("PROMO_REJECTED");
      const context = actor.getSnapshot().context as PromoRejectedContext;
      expect(actor.getSnapshot().value).toBe("review");
      expect(context.session).toEqual(session);
      expect(context.error).toBeInstanceOf(PromoInvalidError);
    });

    it("moves to failed on an unexpected apply error", async () => {
      const actor = createCheckoutActor({
        apply: fromPromise(() => Promise.reject(new Error("boom"))),
      });
      actor.start();
      await expect.poll(() => actor.getSnapshot().value).toBe("review");

      actor.send({ type: "APPLY", shippingOption: "express" });

      await expect.poll(() => actor.getSnapshot().value).toBe("failed");
    });
  });

  describe("confirm", () => {
    it("moves to confirmed and emits ORDER_CONFIRMED on success", async () => {
      const actor = createCheckoutActor();
      const onConfirmed = vi.fn();
      actor.on("ORDER_CONFIRMED", (event) => {
        onConfirmed(event.order);
      });
      actor.start();
      await expect.poll(() => actor.getSnapshot().value).toBe("review");

      actor.send({ type: "CONFIRM" });

      await expect.poll(() => actor.getSnapshot().value).toBe("confirmed");
      const context = actor.getSnapshot().context as ConfirmedContext;
      expect(context.order).toEqual(order);
      expect(onConfirmed).toHaveBeenCalledWith(order);
    });

    it("moves to priceChanged on PriceChanged, then CONTINUE re-initiates", async () => {
      const changes = [
        {
          productId: "p1",
          was: { amount: 10, currency: "USD" },
          now: { amount: 12, currency: "USD" },
        },
      ];
      const actor = createCheckoutActor({
        confirm: fromPromise(() =>
          Promise.reject(new PriceChangedError(changes))
        ),
      });
      actor.start();
      await expect.poll(() => actor.getSnapshot().value).toBe("review");

      actor.send({ type: "CONFIRM" });
      await expect.poll(() => actor.getSnapshot().value).toBe("priceChanged");

      actor.send({ type: "CONTINUE" });
      await expect.poll(() => actor.getSnapshot().value).toBe("review");
    });

    it("moves to sessionExpired on SessionExpired, then RESTART re-initiates", async () => {
      const actor = createCheckoutActor({
        confirm: fromPromise(() => Promise.reject(new SessionExpiredError())),
      });
      actor.start();
      await expect.poll(() => actor.getSnapshot().value).toBe("review");

      actor.send({ type: "CONFIRM" });
      await expect.poll(() => actor.getSnapshot().value).toBe("sessionExpired");

      actor.send({ type: "RESTART" });
      await expect.poll(() => actor.getSnapshot().value).toBe("review");
    });

    it("moves to outOfStock on OutOfStock during confirm", async () => {
      const actor = createCheckoutActor({
        confirm: fromPromise(() => Promise.reject(new OutOfStockError([]))),
      });
      actor.start();
      await expect.poll(() => actor.getSnapshot().value).toBe("review");

      actor.send({ type: "CONFIRM" });

      await expect.poll(() => actor.getSnapshot().value).toBe("outOfStock");
    });
  });

  describe("failed RETRY", () => {
    it("re-invokes the step that failed (confirm)", async () => {
      const confirm = vi
        .fn<() => Promise<typeof order>>()
        .mockRejectedValueOnce(new Error("boom"))
        .mockResolvedValueOnce(order);
      const actor = createCheckoutActor({
        confirm: fromPromise(() => confirm()),
      });
      actor.start();
      await expect.poll(() => actor.getSnapshot().value).toBe("review");

      actor.send({ type: "CONFIRM" });
      await expect.poll(() => actor.getSnapshot().value).toBe("failed");
      expect((actor.getSnapshot().context as FailedContext).failedStep).toBe(
        "confirm"
      );

      actor.send({ type: "RETRY" });

      await expect.poll(() => actor.getSnapshot().value).toBe("confirmed");
      expect(confirm).toHaveBeenCalledTimes(2);
    });
  });
});
