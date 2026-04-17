# Product Rating

## Meta

| Field          | Value                       |
| -------------- | --------------------------- |
| Status         | `approved`                  |
| Author         | bartstc                     |
| Created        | 2026-04-17                  |
| Last updated   | 2026-04-17                  |
| Spec directory | `specs/004-product-rating/` |

---

## 1. Goal & Context

The `StarRating` component currently renders read-only stars derived from the marketing product's aggregate rating. Users have no way to contribute their own rating. This feature makes the stars interactive: clicking a star submits a 1–5 integer rating to `PATCH /api/marketing/products/:id/rate`, updates the displayed rating optimistically, and disables further rating in that session. Unauthenticated users see a warning toast instead.

## 2. Requirements

- **R1**: WHEN a logged-in user clicks a star (1–5), THE SYSTEM SHALL immediately update the displayed rating optimistically and call `PATCH /api/marketing/products/:id/rate` with the selected integer.
- **R2**: WHEN the API call fails, THE SYSTEM SHALL revert the displayed rating to its pre-click value and show an error toast.
- **R3**: WHEN an unauthenticated user clicks a star, THE SYSTEM SHALL show a warning toast "You have to log in to rate the product" and make no API call.
- **R4**: WHEN a user has submitted a rating in the current session, THE SYSTEM SHALL disable the star controls so no further rating is possible.
- **R5**: WHEN the rating mutation is pending, THE SYSTEM SHALL visually disable the star controls to prevent double submission.

## 3. Non-Goals / Out of Scope

- Persisting "already rated" state across sessions (no localStorage / server-side deduplication).
- Half-star or decimal rating input.
- Showing the user's own previously submitted rating vs. the aggregate.
- Any changes to the "see reviews" button behaviour.
- Rate-limiting or throttling beyond disabling after one submission.

## 4. Building Blocks Diff

### Added

- `useRateProductMutation` (mutation-hook) — `src/lib/api/marketing/{product-id}/use-rate-product-mutation.ts` — calls `PATCH /api/marketing/products/:id/rate`, applies optimistic update to cached `MarketingProductDto`, rolls back on error
- `useRateProductMutation` (mutation-hook, providers re-export) — `src/features/products/providers/use-rate-product-mutation.ts`
- `useRateProductNotifications` (notification-hook) — `src/features/products/application/use-rate-product-notifications.ts` — warning toast for unauthenticated, error toast on failure
- `useRateProduct` (use-case-hook) — `src/features/products/application/use-rate-product.ts` — checks auth, calls mutation, dispatches notifications; returns `{ rate, isPending, hasRated }`

### Modified

- `StarRating` (component) — `src/features/products/components/StarRating.tsx` — add `productId` prop, wire `useRateProduct`, make stars clickable, disable after rating or while pending
- `ProductDetails` (component) — `src/features/products/components/ProductDetails.tsx` — pass `product.id` as `productId` to `StarRating`
- `public/locales/en/translation.json` — add toast keys under `features.products.rating`

## 5. Design Decisions

- **Optimistic update in the mutation, not local state**: The cache already holds `MarketingProductDto`; mutating it directly keeps one source of truth. A separate `useState` would duplicate state and diverge on rollback.
- **Auth check in `useRateProduct`**: Consistent with `useAddToCart` — auth guard lives in the use-case hook, not in the component or mutation. Component stays presentational.
- **`hasRated` as local state in `useRateProduct`**: Session-only disable with no persistence, per requirements. Clean `useState<boolean>` inside the hook keeps the mutation layer unaware.

## 6. Boundaries

### ✅ Always

- Create/modify files under `src/features/products/`
- Create files under `src/lib/api/marketing/`
- Add translation keys to `public/locales/en/translation.json`

### ⚠️ Ask First

- Any change to `MarketingProductDto` in `src/lib/api/marketing/{product-id}/marketing-product-dto.ts`

### 🚫 Never

- Modify `server/` source files
- Remove or skip existing tests
- Change the `rateMarketingProductHandler` API contract

## 7. Task Breakdown

1. [S] Add `useRateProductMutation` with optimistic update and rollback — `src/lib/api/marketing/{product-id}/use-rate-product-mutation.ts` (R1, R2)
2. [S] Re-export `useRateProductMutation` from providers — `src/features/products/providers/use-rate-product-mutation.ts` (R1, R2)
3. [P] Add `useRateProductNotifications` — `src/features/products/application/use-rate-product-notifications.ts` (R2, R3)
4. [P] Add translation keys for rating toasts — `public/locales/en/translation.json` (R2, R3)
5. [S] Add `useRateProduct` use-case hook — `src/features/products/application/use-rate-product.ts` (R1, R2, R3, R4, R5)
6. [S] Modify `StarRating` — add `productId` prop, wire `useRateProduct`, clickable + disabled states — `src/features/products/components/StarRating.tsx` (R1, R4, R5)
7. [S] Pass `productId` from `ProductDetails` to `StarRating` — `src/features/products/components/ProductDetails.tsx` (R1)

## 8. Error & Edge Cases

- GIVEN the API returns a non-2xx response, WHEN the mutation settles, THEN revert the optimistic rating to the pre-click cached value and show an error toast.
- GIVEN the user is unauthenticated, WHEN a star is clicked, THEN show the warning toast and do not call the mutation; stars remain enabled so the user can log in and retry.
- GIVEN the mutation is in-flight, WHEN the user attempts to click another star, THEN controls are disabled and no second request is made.
- GIVEN the user has successfully rated, WHEN the component re-renders due to a query refetch, THEN `hasRated` persists in hook state and stars remain disabled.
- GIVEN the cached `MarketingProductDto` is absent, WHEN a star is clicked, THEN the optimistic update is skipped gracefully and the mutation still fires; rollback is a no-op.

## 10. Open Questions

_(none)_

## 11. References

- `server/src/modules/marketing/marketing.handlers.ts` — `rateMarketingProductHandler` implementation
- `server/src/modules/marketing/marketing.routes.ts` — `PATCH /api/marketing/products/:id/rate` route
- `src/features/carts/application/use-add-to-cart.ts` — auth-check pattern to follow
