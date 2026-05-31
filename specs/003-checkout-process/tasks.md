---
schema_version: 1
id: 003-checkout-process
artifact: tasks
status: review
author: bartstc
created: 2026-05-31
last_updated: 2026-05-31
---

# Checkout Process — Tasks

## 1. Task Breakdown

1. [P] Add checkout DTOs — `src/lib/api/checkout/checkout-session-dto.ts`, `order-dto.ts`, `checkout-error-dto.ts` (R1, R4, R11)
2. [P] Add MSW handlers + fixtures for the 3 endpoints incl. each error code — `test-lib/handlers/`, `test-lib/fixtures/` (R3, R5–R9)
3. [S] Add mutation-options factories with `CheckoutError` → domain-error translation — `src/lib/api/checkout/initiate-checkout-mutation.ts`, `apply-checkout-mutation.ts`, `confirm-checkout-mutation.ts` (R1, R2, R4, R9)
4. [P] Add domain models — `src/features/checkout/models/checkout-error.ts`, `checkout-session.ts`, `order.ts` (R1, R3, R5–R8)
5. [S] Add mutation-hook providers wrapping the factories — `src/features/checkout/providers/initiate-checkout.ts`, `apply-checkout.ts`, `confirm-checkout.ts` (R1, R2, R4)
6. [S] Add `checkoutMachine` with union context + per-error branch states — `src/features/checkout/application/checkout-machine.ts` (R1–R10) — see `contracts/checkout-machine.md`
7. [S] Add `checkout-context.tsx` + `CheckoutProvider` injecting actors/`cartId`/`onConfirmed` — `src/features/checkout/application/` (R1, R4)
8. [P] Add machine unit test (transitions per outcome) — `src/features/checkout/application/checkout-machine.test.ts` (R1–R10)
9. [P] Add happy-path components — `ReviewStep`, `PromoShippingControls`, `ConfirmationStep` + stories — `src/features/checkout/components/` (R1, R2, R4, R11)
10. [P] Add per-error components — `OutOfStockNotice`, `PriceChangedNotice`, `SessionExpiredNotice`, `EmptyCartNotice`, `CheckoutErrorNotice` + stories — `src/features/checkout/components/` (R3, R5–R9)
11. [S] Add `CheckoutFlow` rendering active step via `useCheckoutSelector` + story — `src/features/checkout/components/CheckoutFlow.tsx` (R1–R10)
12. [S] Rewire `CheckoutDialog` to mount `CheckoutProvider` + `CheckoutFlow`, inject `cartId`, actors, and cart-query invalidation as `onConfirmed` — `src/features/carts/components/CheckoutButton/CheckoutDialog.tsx` (R1, R4)
13. [S] Add `features.checkout.*` translations; remove stale `features.carts.checkout.form.*` — `public/locales/*/translation.json` (R1–R9)
14. [S] Delete stub: `CheckoutForm(.stories)`, `usePurchase`, `use-purchase-notifications`, `use-purchase-mutation`, `purchase-mutation`, `payment-method` (R1)

## 2. Error & Edge Cases

- GIVEN an empty cart, WHEN initiate returns `EmptyCart`, THEN show empty-cart notice with no retry into the flow. (R8)
- GIVEN an out-of-stock item, WHEN initiate or confirm returns `OutOfStock`, THEN list items (requested/available) and offer back-to-cart. (R5)
- GIVEN an invalid promo, WHEN apply returns `PromoInvalid`, THEN show inline promo error in review; session and totals unchanged; user re-enters a code. (R3)
- GIVEN prices changed since initiate, WHEN confirm returns `PriceChanged`, THEN show was/now and on CONTINUE re-run initiate back to review. (R6)
- GIVEN an expired session, WHEN confirm returns `SessionExpired`, THEN show expiry notice and on RESTART re-run initiate. (R7)
- GIVEN a network failure or 404 (cart not found), WHEN any step fails non-typed, THEN show generic failure with RETRY of the failed step. (R9)
- GIVEN a step in flight, WHEN the user retriggers it, THEN ignore duplicate submissions and show loading. (R10)

## 3. Open Questions

- None.

## 4. References

- Server contract (source of truth): `server/src/modules/checkout/checkout.{routes,types,handlers}.ts`; live OpenAPI `GET /docs` under `/api/checkout`.
- Machine + provider reference pattern: `src/features/authv2/application/{auth-machine,auth-context,AuthProvider}.tsx`.
- Before implementing each building block, read `.agents/skills/building-blocks/rules/{type}.md` for its type.
- Before implementing `checkoutMachine`, read `contracts/checkout-machine.md` in addition to its rule file (no `machine` rule file yet — use the authv2 reference above).
