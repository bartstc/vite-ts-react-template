---
schema_version: 1
id: 003-checkout-process
artifact: design
status: review
author: bartstc
created: 2026-05-31
last_updated: 2026-05-31
---

# Checkout Process — Design

## 1. Building Blocks Diff

### Added

**API layer (`src/lib/api/checkout/`)**

- `checkout-session-dto.ts` (dto-model) — `CheckoutSession`, `CheckoutLineItem`, `ShippingOption`, `Money` wire types.
- `order-dto.ts` (dto-model) — `Order` wire type.
- `checkout-error-dto.ts` (dto-model) — `CheckoutError` union (`code`, `message`, `changes?`, `items?`).
- `initiate-checkout-mutation.ts` (mutation-options-factory) — POST `/api/checkout/initiate`, translates `CheckoutError` codes to domain errors.
- `apply-checkout-mutation.ts` (mutation-options-factory) — POST `/api/checkout/apply`.
- `confirm-checkout-mutation.ts` (mutation-options-factory) — POST `/api/checkout/confirm`.

**Feature `features/checkout/`**

- `checkout-error.ts` (frontend-model) — discriminated domain error type/guards mapped from `CheckoutError` codes.
- `checkout-session.ts`, `order.ts` (frontend-model) — re-export DTOs as domain models (shapes identical).
- `checkout-machine.ts` (machine) — `initiate → apply → confirm` orchestration with per-error branch states; union-based context (`type`-discriminated per state, `OneOfUnion` derived contexts) and typed `Actors`/`EmittedEvents`/`Type` exports, mirroring `authMachine`. See `contracts/checkout-machine.md`.
- `checkout-context.tsx` (provider) — `CheckoutContext` + `useCheckoutSelector`/`useCheckoutSend`/`useCheckoutContext`, mirroring `auth-context.tsx`.
- `CheckoutProvider` (provider) — `src/features/checkout/application/CheckoutProvider.tsx`: creates the actor via `useActorRef(checkoutMachine.provide(...))`, injecting initiate/apply/confirm actors + `cartId` input + `onConfirmed`; exposes the actor through `CheckoutContext` so any component subscribes via `useSelector`. Mirrors `AuthProvider.tsx`.
- `initiateCheckout`, `applyCheckout`, `confirmCheckout` (mutation-hook) — `src/features/checkout/providers/`: provider functions wrapping the API mutations, passed as `fromPromise` actors into `provide()`.
- `CheckoutFlow` (compound-component) — reads machine state via `useCheckoutSelector`; renders the active step.
- `ReviewStep`, `PromoShippingControls`, `ConfirmationStep` (pure-component) — happy-path UI.
- `OutOfStockNotice`, `PriceChangedNotice`, `SessionExpiredNotice`, `EmptyCartNotice`, `CheckoutErrorNotice` (pure-component) — per-error branch UI.

### Modified

- `CheckoutDialog` (compound-component) — `src/features/carts/components/CheckoutButton/CheckoutDialog.tsx`: render `CheckoutFlow` instead of `CheckoutForm`; inject `cartId`, checkout actors, and cart-query invalidation as `onConfirmed`.
- `public/locales/*/translation.json` — add `features.checkout.*` keys; remove stale `features.carts.checkout.form.*`.

### Deleted

- `CheckoutForm` (form) + `CheckoutForm.stories.tsx` — replaced by `CheckoutFlow`.
- `usePurchase` (use-case-hook), `usePurchaseNotifications` (notification-hook), `usePurchaseMutation` (mutation-hook), `purchaseMutationOptions` (`src/lib/api/carts/{cart-id}/purchase-mutation.ts`), `payment-method.ts` (model) — stub flow.

## 2. Design Decisions

- **Decoupling via `machine.provide()` + provider-owned actor**: `checkout-machine.ts` declares actors as abstract `PromiseActorLogic` types and a union-based, `type`-discriminated context — same patterns as `authMachine`/`auth-context`/`AuthProvider`. `CheckoutProvider` owns the actor (`useActorRef`), injects the concrete initiate/apply/confirm actors, `cartId` input, and `onConfirmed` (cart-query invalidation), and exposes it via `CheckoutContext` for `useSelector` subscriptions. The carts-aware `CheckoutDialog` mounts the provider with those injections. `features/checkout/` never imports `features/carts/`. Rejected: checkout/providers importing carts providers — couples the slices. (Both machines will later seed a `machine` building block.)
- **Per-code branch states over one `failed` state**: each typed error gets its own machine state and UI component so recovery transitions (PriceChanged→re-initiate, SessionExpired→restart, OutOfStock→back-to-cart, PromoInvalid→inline) are explicit. A single `failed` state would erase the contract-heavy branching the feature exists for. PromoInvalid stays inside the review step (not its own terminal state) since it's recoverable without a transition.
- **Totals never recomputed client-side**: UI renders server `Money` values verbatim; no client arithmetic (R11). Currency assumed USD; not rendered as a choice.

## 3. Boundaries

### ✅ Always (proceed without asking)

- Create files under `src/features/checkout/` and `src/lib/api/checkout/`.
- Add MSW handlers/fixtures in `test-lib/` for the three checkout endpoints.
- Add `features.checkout.*` translation keys; remove stale `features.carts.checkout.form.*`.
- Co-locate stories/tests with new components.

### ⚠️ Ask First (needs human approval)

- Any change to `src/features/carts/` beyond editing `CheckoutDialog.tsx` and removing the listed stub files.
- Adding a `/checkout` route or page (current decision is inline dialog only).
- New dependencies in `package.json`.

### 🚫 Never (hard stops)

- Modify the server checkout module or its contract (`server/src/modules/checkout/`).
- Import `features/carts/` from inside `features/checkout/`.
- Recompute or override server-provided totals.
- Add a payment step, `paid` state, or order persistence.
