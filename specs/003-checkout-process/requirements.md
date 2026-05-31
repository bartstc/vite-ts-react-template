---
schema_version: 1
id: 003-checkout-process
artifact: requirements
status: review
author: bartstc
created: 2026-05-31
last_updated: 2026-05-31
---

# Checkout Process — Requirements

## 1. Goal & Context

The current `purchase` flow is a stub: a fake form (name/address/payment) calling a no-op
mutation. The server now exposes a real, contract-heavy checkout module that turns a cart
into an **Order** through three sequenced calls (`initiate → apply → confirm`) with five
typed error outcomes. This feature replaces the stub with a real multi-step checkout
driven by an XState machine whose transitions mirror the server's outcomes. Server contract
is the source of truth — see References. No payment, no order persistence this iteration.

## 2. Requirements

- **R1**: WHEN the user opens checkout for a non-empty cart, THE SYSTEM SHALL call `initiate` with the cart id and display a review step showing line items and server-computed totals (subtotal, discount, shipping, total).
- **R2**: WHEN the user changes the promo code or shipping option, THE SYSTEM SHALL call `apply` with the current session and display the updated server-computed totals.
- **R3**: WHEN `apply` returns a `PromoInvalid` error, THE SYSTEM SHALL display an inline promo error within the review step and let the user re-enter a code without leaving the flow.
- **R4**: WHEN the user confirms, THE SYSTEM SHALL call `confirm` with the current session and, on success, display an order confirmation (order id, line items, totals) and invalidate the cart query so the cart UI reflects the cleared cart.
- **R5**: WHEN any checkout call returns an `OutOfStock` error, THE SYSTEM SHALL display the unavailable items with requested and available quantities, and offer a "back to cart" action.
- **R6**: WHEN `confirm` returns a `PriceChanged` error, THE SYSTEM SHALL display the changed prices (was vs now) and offer to continue, which re-runs `initiate` and returns to the review step.
- **R7**: WHEN `confirm` returns a `SessionExpired` error, THE SYSTEM SHALL display an expiry message and offer a "start over" action that re-runs `initiate`.
- **R8**: WHEN `initiate` returns an `EmptyCart` error, THE SYSTEM SHALL display an empty-cart message with no retry into the flow.
- **R9**: WHEN any checkout call fails with a non-typed/unexpected error, THE SYSTEM SHALL display a generic failure state with a retry of the failed step.
- **R10**: WHILE any checkout call is in flight, THE SYSTEM SHALL display a loading state and prevent duplicate submissions of that step.
- **R11**: THE SYSTEM SHALL treat all totals as server-computed and SHALL NOT recompute or trust client-side totals.

## 3. Non-Goals / Out of Scope

- Any server-side change (contract is fixed and read-only).
- Order persistence, order history, or an orders list.
- Payment step or a `paid` state.
- Multi-currency — USD is assumed everywhere.
- Editing cart contents inside the checkout flow (quantity changes happen in the cart UI via "back to cart").
- Coupling `features/checkout/` to `features/carts/` — cart data and cache invalidation are injected from the outside.
