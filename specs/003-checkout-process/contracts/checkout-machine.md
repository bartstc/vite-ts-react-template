---
schema_version: 1
id: 003-checkout-process
artifact: contract
block: checkoutMachine
block_type: machine
author: bartstc
created: 2026-05-31
last_updated: 2026-05-31
---

# checkoutMachine — Contract

## 1. Design Problem

The machine sequences three server calls (`initiate → apply → confirm`); each can divert into
one of five typed-error branches, four recoverable along different paths (signals 1, 3). No
canonical pattern exists in the catalog (signal 5) — only `authMachine` as a reference. A wrong
transition map silently strands the user or trusts a stale session, so the shape needs design.

## 2. Shape

Mirror `auth-machine.ts`: `type`-discriminated union context, `OneOfUnion<Ctx, "...">` derived
contexts, `CheckoutMachineActors` / `CheckoutMachineEmittedEvents` / `CheckoutMachineType` exports.
Actor owned by `CheckoutProvider` (see `auth-context`/`AuthProvider`). **Input:** `{ cartId: string }`.

**Union context** (`CheckoutMachineContext`, each variant carries only what its states need):

- `{ type: "INITIAL"; cartId }`
- `{ type: "SESSION_READY"; cartId; session: CheckoutSession }` — review/applying/confirming/priceChanged/sessionExpired
- `{ type: "PROMO_REJECTED"; cartId; session; error: CheckoutError }` — review with inline promo error
- `{ type: "CONFIRMED"; cartId; session; order: Order }`
- `{ type: "FAILED"; cartId; session?; error: CheckoutError }` — outOfStock/emptyCart/failed
  (derive e.g. `SessionReadyContext = OneOfUnion<CheckoutMachineContext, "SESSION_READY">`)

**Injected actors** (abstract `PromiseActorLogic`, provided in `CheckoutProvider`):
`initiate(cartId) -> CheckoutSession`; `apply({ session, promoCode?, shippingOption? }) -> CheckoutSession`; `confirm({ session }) -> Order`.

**Emitted events:** `ORDER_CONFIRMED { order }` — `CheckoutProvider` subscribes and runs `onConfirmed`.

**Events:** `APPLY { promoCode?, shippingOption? }`, `CONFIRM`, `CONTINUE`, `RESTART`, `RETRY`

**States & transitions:**

- `initiating` (entry/on RESTART) — invoke `initiate`
  - onDone → `review` (assign session)
  - onError(EmptyCart) → `emptyCart`; onError(OutOfStock) → `outOfStock`; onError(other) → `failed`
- `review` — idle; renders session + promo/shipping controls
  - APPLY → `applying`; CONFIRM → `confirming`
- `applying` — invoke `apply`
  - onDone → `review` (assign session)
  - onError(PromoInvalid) → `review` (assign error; inline, session unchanged)
  - onError(other) → `failed`
- `confirming` — invoke `confirm`
  - onDone → `confirmed` (assign `CONFIRMED` context; **emit `ORDER_CONFIRMED`** → provider runs `onConfirmed` for cart invalidation)
  - onError(PriceChanged) → `priceChanged`; onError(OutOfStock) → `outOfStock`;
    onError(SessionExpired) → `sessionExpired`; onError(other) → `failed`
- `priceChanged` — CONTINUE → `initiating` (re-price); `sessionExpired` — RESTART → `initiating`
- `outOfStock` — surfaces items; "back to cart" handled by parent (no in-machine transition)
- `emptyCart` — terminal
- `failed` — RETRY → re-invoke the step that failed (back to `initiating`/`applying`/`confirming`)
- `confirmed` — final

**Guards:** error branches discriminate on `error.code`. CONFIRM allowed only from `review`.

## 3. Rationale

- **Union context discriminated by `type`** (per project convention, like `auth-machine.ts`):
  each state variant carries only its valid fields, so components read a narrowed context via
  `OneOfUnion` instead of null-checking a flat bag.
- **Whole `CheckoutError` stored, branched on `code`**, mirroring the server union — branch
  components read `error.changes` / `error.items` directly; no context field per error type.
- **PromoInvalid loops back to `review`** rather than a dedicated state: it's a field-level
  rejection, recoverable in place; a separate state would force an extra transition for no gain.
- **`outOfStock` has no in-machine recovery**: quantity edits live in the cart UI, outside this
  machine; parent handles "back to cart" by closing the flow.

## 4. Open Questions

- None.
