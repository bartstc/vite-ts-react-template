---
schema_version: 1
id: 003-checkout-process
artifact: summary
status: draft
author: bartstc
created: 2026-05-31
last_updated: 2026-05-31
---

# Checkout Process — Summary

> Entry point for the frontend spec. The server side is **implemented and verified**;
> this document is the contract the frontend feature will be specced against.

## Goal

Replace the old stub "purchase" with a real multi-step checkout that turns a cart into
an **Order**. The point is a contract-heavy flow: many distinct, typed outcomes the
frontend must handle, plus an explicit state transition shared between server and a
frontend state machine.

## Contract surface

- **5 typed errors, two with structured payloads** (`OutOfStock.items[]`,
  `PriceChanged.changes[]`). The frontend discriminates on `code` and renders a
  different UI per branch.
- **Stateless session passed back into `apply`/`confirm`.** The client owns the
  in-flight session shape; the session type is a contract the frontend depends on
  field-by-field.
- **3 sequenced calls with a real branch** (`initiate → apply → confirm`, where
  `PriceChanged` / `OutOfStock` / `SessionExpired` divert the flow). Modelled with an
  XState machine whose transitions match the server's outcomes.

## Flow (3 steps)

1. **Initiate** — server validates the cart, re-prices line items from current product
   prices, validates stock, returns a `CheckoutSession` (line items, totals, expiry).
2. **Apply** (promo / shipping) — recalculates discount / shipping / total, returns the
   updated session or a typed rejection.
3. **Confirm** — re-checks expiry, stock, and prices; on success builds an `Order`,
   clears the cart, returns the order.

## State model

`pending → confirmed` (terminal `failed` for any typed error). There is **no payment
step** this iteration — confirm succeeds whenever the session is still valid, so there
is no `paid` state.

## Invariants

- `total = subtotal − discount + shipping` (computed server-side at every step; client
  totals are never trusted).
- A session is immutable once confirmed.
- **USD only** — single currency assumed everywhere.

## Pricing rules (current)

- **Shipping**: `standard` = $5.00, `express` = $15.00.
- **Promo codes** (fixed test table): `SAVE10` → 10% off subtotal; `FREESHIP` →
  shipping set to $0. Any other code → `PromoInvalid`.
- **Session TTL**: 15 minutes (`expiresAt`).

---

## API

All endpoints require `Authorization: Bearer <jwt>`. Base path `/api/checkout`.
Money is `{ amount: number, currency: "USD" }`.

### `POST /api/checkout/initiate`

Start a checkout for a cart.

- **Body**: `{ "cartId": "<uuid>" }`
- **200** → `CheckoutSession`:

```jsonc
{
  "id": "<uuid>",
  "cartId": "<uuid>",
  "status": "pending",
  "lineItems": [
    { "productId": "...", "name": "...", "unitPrice": {…}, "quantity": 2, "lineTotal": {…} }
  ],
  "promoCode": null,
  "shippingOption": "standard",
  "subtotal": {…}, "discount": {…}, "shipping": {…}, "total": {…},
  "expiresAt": "2026-05-31T07:54:53.679Z"
}
```

- **404** `{ "message": "Cart not found" }`
- **400** typed error: `EmptyCart`, `OutOfStock`.

### `POST /api/checkout/apply`

Apply / change promo code and shipping option. Stateless — pass the whole session back.

- **Body**: `{ "session": CheckoutSession, "promoCode"?: string, "shippingOption"?: "standard" | "express" }`
- **200** → updated `CheckoutSession` (recomputed totals, still `pending`).
- **400** typed error: `PromoInvalid`.

### `POST /api/checkout/confirm`

Finalize the checkout.

- **Body**: `{ "session": CheckoutSession }`
- **201** → `Order`:

```jsonc
{
  "id": "<uuid>", "cartId": "<uuid>", "userId": 1, "status": "confirmed",
  "lineItems": [...], "subtotal": {…}, "discount": {…}, "shipping": {…}, "total": {…},
  "promoCode": null, "shippingOption": "standard",
  "confirmedAt": "2026-05-31T07:41:10.359Z"
}
```

- Side effect: the cart is emptied.
- **404** `{ "message": "Cart not found" }`
- **400** typed error: `SessionExpired`, `OutOfStock`, `PriceChanged`.

### Typed error union (HTTP 400)

Discriminated by `code`:

| `code`           | Extra fields                                   | When                                                |
| ---------------- | ---------------------------------------------- | --------------------------------------------------- |
| `EmptyCart`      | —                                              | initiate on an empty cart                           |
| `OutOfStock`     | `items: { productId, requested, available }[]` | any line exceeds product stock                      |
| `PromoInvalid`   | —                                              | apply with an unknown promo code                    |
| `SessionExpired` | —                                              | confirm after `expiresAt`                           |
| `PriceChanged`   | `changes: { productId, was, now }[]`           | confirm when a product price changed since initiate |

Body shape: `{ "code": <Code>, "message": string, ...extra }`.

---

## Frontend usage (for the spec)

The session is **stateless on the server** — the client holds it and passes it back
into `apply` / `confirm`. So the frontend owns the in-flight checkout state.

**Call sequence:**

1. User opens checkout → `POST /initiate` with the active cart id → store the returned
   `CheckoutSession` in local state.
2. User picks promo / shipping → `POST /apply` with the stored session → replace stored
   session with the response (it carries the recomputed totals).
3. User confirms → `POST /confirm` with the stored session → on `201`, show the order
   and treat the cart as empty (invalidate cart queries).

**State machine the frontend mirrors** (`pending → confirmed`, with a `failed` branch):

| Server outcome   | Suggested UI state / action                                      |
| ---------------- | ---------------------------------------------------------------- |
| 200 initiate     | `pending` — render summary + promo/shipping controls             |
| 200 apply        | stay `pending` — re-render totals                                |
| `PromoInvalid`   | inline error on the promo field, stay `pending`                  |
| 201 confirm      | `confirmed` — show order confirmation, clear cart                |
| `OutOfStock`     | block confirm; show which items, prompt to edit cart             |
| `PriceChanged`   | show old→new prices, require user to re-accept (re-`initiate`)   |
| `SessionExpired` | `failed`/expired — prompt to restart checkout (`initiate` again) |
| 404 cart         | hard error — cart no longer exists                               |

This doc is the **input to the frontend spec**, not the frontend implementation. The
frontend (XState machine, queries/mutations, UI) is specced and built separately.
