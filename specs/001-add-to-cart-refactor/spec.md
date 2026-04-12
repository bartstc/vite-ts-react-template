# Add-to-Cart Layer Refactor

## Meta

| Field          | Value                             |
| -------------- | --------------------------------- |
| Status         | `approved`                        |
| Author         | bartstc                           |
| Created        | 2026-04-08                        |
| Last updated   | 2026-04-08                        |
| Spec directory | `specs/001-add-to-cart-refactor/` |

---

## 1. Goal & Context

The add-to-cart flow violates the building blocks taxonomy: `providers/use-add-to-cart.ts` does auth orchestration that belongs in `application/`, error routing lives in the component instead of a `use-case-hook`, and `use-add-to-cart-notifications.ts` is co-located with the button instead of residing in `application/`. This refactor realigns each file to its correct layer without changing any observable behavior.

## 2. Requirements

- **R1**: WHEN add-to-cart is initiated, THE SYSTEM SHALL perform auth check, mutation, notification dispatch, and dialog open from a single `use-case-hook` in `src/features/carts/application/`.
- **R2**: WHEN a domain error occurs (`UnknownProductError`, `ProductNotAvailableError`, or unknown), THE SYSTEM SHALL route it to the correct notification inside the `use-case-hook` — not inside the component.
- **R3**: WHEN the user is not authenticated and add-to-cart is triggered, THE SYSTEM SHALL dispatch the not-authenticated notification from the `use-case-hook`.
- **R4**: THE SYSTEM SHALL expose `useAddToCartMutation` and its error classes through `src/features/carts/providers/use-add-to-cart.ts` as a re-export from `lib/api/`; the mutation file SHALL be named `add-to-cart-mutation.ts`.
- **R5**: `useAddToCartNotifications` SHALL reside in `src/features/carts/application/use-add-to-cart-notifications.ts` and be consumed by the `use-case-hook`.
- **R6**: `AddToCartButton` SHALL contain no try/catch, no error type checks, and no direct notification calls — it SHALL only call the `use-case-hook` execute function.

## 3. Non-Goals / Out of Scope

- No changes to `useAddToCartMutation` internals in `lib/api/`
- No changes to `useClearCart`, `usePurchase`, or any other cart operation
- No changes to observable UI behavior, error messages, or toast content
- No changes to `useProductAddedDialogStore`
- No changes to the HTTP layer or API contracts

## 4. Building Blocks Diff

### Added

- `useAddToCart` (use-case-hook) — `src/features/carts/application/use-add-to-cart.ts`

### Modified

- `useAddToCartNotifications` (notification-hook) — relocated to `src/features/carts/application/use-add-to-cart-notifications.ts`
- `src/features/carts/providers/use-add-to-cart.ts` — stripped to a thin re-export barrel
- `AddToCartButton` (pure-component) — remove error routing; import use-case-hook from `application/`

### Renamed

- `src/lib/api/carts/{cart-id}/add-to-cart-command.ts` → `src/lib/api/carts/{cart-id}/add-to-cart-mutation.ts`

## 5. Design Decisions

- **Auth state source**: `useAddToCart` reads `cartId` and auth state from `useAuthStore` internally (Option A). Keeps the component call site param-free and is consistent with the existing contract. Testability restructure is out of scope.

## 6. Boundaries

### ✅ Always (proceed without asking)

- Create `src/features/carts/application/use-add-to-cart.ts`
- Move `src/features/carts/components/AddToCartButton/use-add-to-cart-notifications.ts` → `src/features/carts/application/use-add-to-cart-notifications.ts`
- Modify `src/features/carts/providers/use-add-to-cart.ts` to a re-export barrel
- Modify `src/features/carts/components/AddToCartButton/AddToCartButton.tsx`
- Rename `add-to-cart-command.ts` → `add-to-cart-mutation.ts` and update import in `providers/use-add-to-cart.ts`

### ⚠️ Ask First (needs human approval)

- Any change to `useAddToCartMutation` internals in `src/lib/api/carts/{cart-id}/add-to-cart-mutation.ts`
- Any change to `useProductAddedDialogStore` interface

### 🚫 Never (hard stops)

- Modify `src/lib/http/`, `src/lib/types/`, or `src/features/auth/`
- Remove or disable existing Storybook stories or tests
- Change error class names or messages

## 7. Task Breakdown

1. **[S]** Rename `add-to-cart-command.ts` → `add-to-cart-mutation.ts`; update import in `providers/use-add-to-cart.ts` — `src/lib/api/carts/{cart-id}/add-to-cart-mutation.ts` (R4)
2. **[S]** Convert `providers/use-add-to-cart.ts` to a thin re-export of `useAddToCartMutation` + error classes — `src/features/carts/providers/use-add-to-cart.ts` (R4) — _depends on task 1_
3. **[P]** Move `useAddToCartNotifications` to `application/`; delete old file — `src/features/carts/application/use-add-to-cart-notifications.ts` (R5)
4. **[S]** Create `useAddToCart` use-case-hook composing providers re-export + notification hook + auth store + dialog store — `src/features/carts/application/use-add-to-cart.ts` (R1, R2, R3) — _depends on tasks 2, 3_
5. **[S]** Simplify `AddToCartButton`: remove try/catch, error routing, notification imports; import `useAddToCart` from `application/` — `src/features/carts/components/AddToCartButton/AddToCartButton.tsx` (R6) — _depends on task 4_

## 8. Error & Edge Cases

- GIVEN the file rename in task 1, WHEN `providers/use-add-to-cart.ts` still references the old path, THEN the build fails — import update is part of task 1.
- GIVEN `useAddToCartNotifications` moves in task 3, WHEN `AddToCartButton.tsx` still imports from `./use-add-to-cart-notifications`, THEN the build fails — import removed in task 5.
- GIVEN `useAddToCart` is in `application/`, WHEN `AddToCartButton.tsx` previously imported from `providers/use-add-to-cart`, THEN that import must switch to `application/use-add-to-cart` in task 5.
