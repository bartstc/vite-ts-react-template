# Remove Product from Cart

## Meta

| Field          | Value                            |
| -------------- | -------------------------------- |
| Status         | `approved`                       |
| Author         | bartstc                          |
| Created        | 2026-04-25                       |
| Last updated   | 2026-04-25                       |
| Spec directory | `specs/001-remove-cart-product/` |

---

## 1. Goal & Context

`CartItem` currently shows a static quantity label and a non-functional "Remove" button. A new backend endpoint (`DELETE /api/carts/:id/products/:productId`) now supports single-unit removal. Users need fine-grained quantity management directly in the cart: decrement or increment by one, or remove all units of a product, with a confirmation gate before destructive actions.

## 2. Requirements

- **R1**: WHEN the user clicks "-" and product quantity > 1, THE SYSTEM SHALL call the remove endpoint once, apply an optimistic quantity decrement with rollback on failure, show a success toast, and invalidate the cart query on settle.
- **R2**: WHEN the user clicks "-" and product quantity === 1, THE SYSTEM SHALL show a confirmation dialog; upon confirmation, call the remove endpoint once, show a success toast, and invalidate the cart query.
- **R3**: WHEN the user clicks "+", THE SYSTEM SHALL call the existing add-to-cart endpoint for the product and update the cart.
- **R4**: WHEN the user clicks "Remove", THE SYSTEM SHALL show a confirmation dialog; upon confirmation, call the remove endpoint `quantity` times, show a success toast, and invalidate the cart query.
- **R5**: WHEN the confirmation dialog is cancelled or dismissed, THE SYSTEM SHALL close the dialog and make no API calls.
- **R6**: WHEN a remove API call fails (network error or 404), THE SYSTEM SHALL roll back any optimistic update and show an error toast.
- **R7**: WHEN a cart item is rendered, THE SYSTEM SHALL display a "-" icon button, a quantity count, and a "+" icon button as a grouped control alongside the existing "Remove" button.

## 3. Non-Goals / Out of Scope

- Storybook stories for new/modified components (separate task)
- Stock or inventory limit enforcement on "+"
- A dedicated batch-removal endpoint — "Remove all" calls the single-unit endpoint N times
- Any changes to the existing add-to-cart flow beyond wiring "+" in `CartItem`

## 4. Building Blocks Diff

### Added

- `removeCartProductMutationOptions` (mutation-options-factory) — DELETE `/api/carts/:id/products/:productId`; `src/lib/api/carts/{cart-id}/remove-cart-product-mutation.ts`
- `useRemoveCartProductMutation` (mutation-hook) — single-unit removal with optimistic quantity decrement + rollback; `src/features/carts/providers/use-remove-cart-product-mutation.ts`
- `useRemoveAllCartProductsMutation` (mutation-hook) — calls remove endpoint N times for a given productId, then invalidates cart query; `src/features/carts/providers/use-remove-all-cart-products-mutation.ts`
- `useRemoveCartProductNotifications` (notification-hook) — maps success/error outcomes to toasts for both single and all-unit removal; `src/features/carts/application/use-remove-cart-product-notifications.ts`
- `useRemoveCartProduct` (use-case-hook) — orchestrates "-" (direct call or open dialog) and "Remove all" (open dialog) flows; `src/features/carts/application/use-remove-cart-product.ts`
- `useConfirmRemoveProductDialogStore` (store) — Zustand store holding `isOpen`, `productId`, `quantity`, and `mode: "decrement" | "remove-all"`; `src/features/carts/components/CartItem/use-confirm-remove-product-dialog-store.ts`
- `ConfirmRemoveProductDialog` (component) — single shared confirmation dialog for last-unit decrement and remove-all; `src/features/carts/components/CartItem/ConfirmRemoveProductDialog.tsx`
- `QuantityControls` (component) — "-" / count / "+" subcomponent with facade-hook encapsulating remove-one and add-to-cart mutation logic; `src/features/carts/components/CartItem/QuantityControls.tsx`

### Modified

- `CartItem` (pure-component) — integrate `QuantityControls`, wire "Remove" to `useRemoveCartProduct`, drop `useNotImplementedYetToast`; `src/features/carts/components/CartItem.tsx`
- `CartsList` (pure-component) — render `ConfirmRemoveProductDialog` once at container level; `src/features/carts/components/CartsList.tsx`
- `public/locales/en/translation.json` — add keys under `features.carts.remove-product.*`

## 5. Design Decisions

- **Two separate mutation-hooks at providers layer**: `useRemoveCartProductMutation` owns the single-unit call with optimistic update (instant UX for quantity > 1); `useRemoveAllCartProductsMutation` owns the N-call batch with plain invalidation. Clean separation per developer spec.
- **Single shared confirmation dialog**: One `ConfirmRemoveProductDialog` backed by a global Zustand store (carrying `productId`, `quantity`, `mode`) covers both last-unit decrement and remove-all. Rendered once in `CartsList` to avoid N dialog mounts in the list.
- **Optimistic update scope limited to decrement flow**: Only `useRemoveCartProductMutation` applies `onMutate`/`onError` rollback (following `useRateProductMutation` pattern). Confirmed flows don't need optimistic updates — dialog already acknowledges intent.

## 6. Boundaries

### ✅ Always

- Create/modify files under `src/features/carts/` and `src/lib/api/carts/{cart-id}/`
- Add translation keys to `public/locales/en/translation.json`
- Update `src/features/carts/components/CartItem.stories.tsx` only if new required props are added to `CartItem`

### ⚠️ Ask First

- Modify the shape of `src/lib/api/carts/{cart-id}/cart-dto.ts` or `cart-product-dto.ts`

### 🚫 Never

- Modify `src/features/auth/` or `src/features/authv2/`
- Remove or disable existing tests
- Change the public API of `useAddToCart` (`src/features/carts/application/use-add-to-cart.ts`)

## 7. Task Breakdown

1. **[S]** Add `removeCartProductMutationOptions` — `src/lib/api/carts/{cart-id}/remove-cart-product-mutation.ts` (R1, R2, R4, R6)
2. **[S]** Add `useRemoveCartProductMutation` with optimistic decrement + rollback — `src/features/carts/providers/use-remove-cart-product-mutation.ts` (R1, R6) _(depends on 1)_
3. **[P]** Add `useRemoveAllCartProductsMutation` — `src/features/carts/providers/use-remove-all-cart-products-mutation.ts` (R4, R6) _(depends on 1, parallel with 2)_
4. **[P]** Add `useRemoveCartProductNotifications` — `src/features/carts/application/use-remove-cart-product-notifications.ts` (R1, R2, R4, R6)
5. **[S]** Add `useRemoveCartProduct` use-case-hook — `src/features/carts/application/use-remove-cart-product.ts` (R1, R2, R4, R5) _(depends on 2, 3, 4)_
6. **[P]** Add `useConfirmRemoveProductDialogStore` — `src/features/carts/components/CartItem/use-confirm-remove-product-dialog-store.ts` (R2, R4, R5)
7. **[S]** Add `ConfirmRemoveProductDialog` — `src/features/carts/components/CartItem/ConfirmRemoveProductDialog.tsx` (R2, R4, R5) _(depends on 5, 6)_
8. **[S]** Add `QuantityControls` with facade-hook — `src/features/carts/components/CartItem/QuantityControls.tsx` (R1, R2, R3, R7) _(depends on 5)_
9. **[S]** Modify `CartItem` — integrate `QuantityControls`, wire "Remove" — `src/features/carts/components/CartItem.tsx` (R4, R7) _(depends on 7, 8)_
10. **[S]** Modify `CartsList` — render `ConfirmRemoveProductDialog` once — `src/features/carts/components/CartsList.tsx` (R2, R4) _(depends on 7)_
11. **[P]** Add translation keys — `public/locales/en/translation.json` (R1, R2, R4, R6)

## 8. Error & Edge Cases

- GIVEN a remove or add mutation is in-flight for a product, WHEN the user clicks "-" or "+", THEN both buttons are disabled until the request settles (`isPending` prevents double-submit).
- GIVEN optimistic decrement applied (quantity N → N-1), WHEN the API returns 404 or a network error, THEN the cached quantity is restored to N and an error toast is shown (R6).
- GIVEN quantity === 1 and removal is confirmed, WHEN the server responds 200, THEN the product row is absent from the updated cart.
- GIVEN the user confirms "Remove all" with quantity N, WHEN one of the N sequential calls fails mid-sequence, THEN remaining calls are aborted, the cart query is invalidated to fetch authoritative state, and an error toast is shown (R6).
- GIVEN the confirmation dialog is open, WHEN the user clicks the backdrop or presses Escape, THEN the dialog closes and no API call is made (R5).

## 11. References

- [use-rate-product-mutation.ts](src/features/marketing/rating/providers/use-rate-product-mutation.ts) — optimistic update pattern to follow
- [ConfirmClearCartDialog.tsx](src/features/carts/components/ClearCartButton/ConfirmClearCartDialog.tsx) — confirmation dialog pattern to follow
