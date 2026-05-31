## Goal

Replace the old stub "purchase" with a real multi-step checkout that turns a cart into
an **Order**. A contract-heavy flow: many distinct, typed outcomes the frontend must
handle, plus an explicit state transition shared between server and a frontend state
machine.

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

1. **Initiate** — validates the cart, re-prices, validates stock, returns a
   `CheckoutSession`.
2. **Apply** — applies promo / shipping, returns an updated session or a typed
   rejection.
3. **Confirm** — re-checks expiry, stock, prices; on success returns an `Order` and
   clears the cart.

## State model

`pending → confirmed`, with a `failed` branch for any typed error. No payment step and
no `paid` state this iteration.

## Invariants

- `total = subtotal − discount + shipping` — computed server-side; client totals never
  trusted.
- A session is immutable once confirmed.
- **USD only** — single currency assumed everywhere.

## Source of truth (server)

The full API contract already lives in code — do not restate it here, read it:

- Endpoints + auth: `server/src/modules/checkout/checkout.routes.ts`
- Request/response + error types: `server/src/modules/checkout/checkout.types.ts`
- Behaviour, pricing rules, promo codes: `server/src/modules/checkout/checkout.handlers.ts`
- Live OpenAPI: `GET /docs` (routes under `/api/checkout`)

## Scope

In: the frontend checkout feature (state machine, queries/mutations, UI) speccing
against the server contract above. Out: any server change, order persistence /
history, payment, multi-currency, stock decrement on confirm.
