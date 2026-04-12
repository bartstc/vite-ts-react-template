# Replace Fake Store API with Local Server

## Meta

| Field          | Value                               |
| -------------- | ----------------------------------- |
| Status         | `review`                            |
| Author         | bartstc                             |
| Created        | 2026-04-10                          |
| Last updated   | 2026-04-10                          |
| Spec directory | `specs/003-local-server-migration/` |

---

## 1. Goal & Context

The app depends on `fakestoreapi.com`, an unreliable external service that returns 523 errors during local dev and E2E tests. A local Fastify server (`server/`) already exists with stable endpoints for products, carts, auth, and marketing (which holds per-product ratings).

This spec replaces the external API dependency by updating the HTTP base URL, updating API-layer DTOs and domain types to match the local server's shapes, adding a marketing product query to supply rating data for the product detail view, and updating MSW fixtures and handlers. No component structure, layout, or logic changes beyond mechanical field renames and adding the marketing query call in `ProductDetails`.

## 2. Requirements

- **R1**: WHEN the app starts in any environment, THE SYSTEM SHALL resolve `VITE_API` for the HTTP base URL instead of the now-removed `VITE_FAKE_STORE_API_HOST`.
- **R2**: WHEN `ProductDto` and the domain `Product` type are updated to the local server shape (`id: string`, `name`, `price: {amount, currency}`, `imageUrl`, `category`, `addedAt`), THE SYSTEM SHALL update every reference to the old field names (`title`, `image`, `price: number`, `rating`) so the app compiles without type errors.
- **R3**: WHEN the product detail view is rendered, THE SYSTEM SHALL fetch `GET /api/marketing/products/:id` as a separate query and supply the result's `rating` to `StarRating` — if the marketing product is not found (404), THE SYSTEM SHALL surface the same error as a missing catalog product.
- **R4**: WHEN `CartDto` and domain `Cart`/`CartProduct` types are updated to the local server shape (`id: string`, `productId: string`), THE SYSTEM SHALL update all references to the old numeric ID types.
- **R5**: WHEN a user is fetched after login, THE SYSTEM SHALL read `cartId` from the server response rather than the hardcoded value in `user-query.ts`.
- **R6**: WHEN the add-to-cart mutation is called, THE SYSTEM SHALL send `productId` and `cartId` as strings to match the local server API contract.
- **R7**: WHEN MSW intercepts requests in unit tests and Storybook, THE SYSTEM SHALL return fixture data shaped to match the updated DTOs, including a new marketing product handler.

## 3. Non-Goals / Out of Scope

- No JSX structure, layout, or conditional logic changes in `components/` or `pages/` beyond mechanical field renames and the marketing query call
- No changes to `server/` — treated as read-only
- `usePurchaseMutation` stays as a local mock
- No rating fetch on the product list — rating is only fetched on the product detail view
- No new `Category` enum value mapping — enum updates to match server values (`"clothing"`, `"jewelery"`, `"electronics"`)

## 4. Building Blocks Diff

### Added

- `MarketingProductDto` (dto-model) — `src/lib/api/marketing/{product-id}/marketing-product-dto.ts` — wire shape `{ id, rating: { rate, count }, addedAt, updatedAt }` (R3)
- `marketingProductQuery` (query-options-factory) — `src/lib/api/marketing/{product-id}/marketing-product-query.ts` — fetches `GET /api/marketing/products/:id` (R3)
- `src/features/products/providers/use-marketing-product-query.ts` — exposes `useMarketingProductQuery` hook for `ProductDetails` (R3)
- `src/test-lib/handlers/get-marketing-product-handler.ts` — MSW handler for `GET /api/marketing/products/:id` (R7)

### Modified

- `ProductDto` (dto-model) — `src/lib/api/products/{product-id}/product-dto.ts` — update to local server shape; update `Category` enum; remove `rating` (R2)
- `CartDto` (dto-model) — `src/lib/api/carts/{cart-id}/cart-dto.ts` — `id: string`, `productId: string` (R4)
- `CartProductDto` (dto-model) — `src/lib/api/carts/{cart-id}/cart-product-dto.ts` — cascade from `ProductDto` (R2)
- `UserDto` (dto-model) — `src/lib/api/auth/users/{user-id}/user-dto.ts` — `cartId: string` (R5)
- `productsQuery` (query-options-factory) — `src/lib/api/products/products-list/products-list-query.ts` — remove hardcoded `total: 20`, use server meta (R2)
- `useAddToCartMutation` (mutation-hook) — `src/lib/api/carts/{cart-id}/add-to-cart-mutation.ts` — `productId: string`, `cartId: string` (R6)
- `src/lib/api/auth/users/{user-id}/user-query.ts` — read `cartId` from response (R5)
- `src/lib/http/index.ts` — `VITE_FAKE_STORE_API_HOST` → `VITE_API` (R1)
- `.env` — rename env var, value `http://localhost:3001/api` (R1)
- `src/features/products/models/product.ts` — redefine `Product` without `rating` (R2)
- `src/features/carts/models/cart.ts` — cascade from `CartDto` (R4)
- `ProductDetails` (pure-component) — `src/features/products/components/ProductDetails.tsx` — call `useMarketingProductQuery` to supply `rating` to `StarRating` (R3)
- `ProductFixture` — `src/test-lib/fixtures/product-fixture.ts` — update to new `ProductDto` shape (R7)
- `CartFixture` — `src/test-lib/fixtures/cart-fixture.ts` — string IDs (R7)
- All handlers in `src/test-lib/handlers/` — update response shapes (R7)
- Stories using `ProductDetails` — add `get-marketing-product-handler` to MSW handler list (R7)

### Deleted

- `src/features/products/models/rating.ts` — `Rating` type absorbed into `MarketingProductDto` (R2)

## 5. Design Decisions

- **Separate queries for product and rating**: `ProductDetails` calls `useProductQuery` and `useMarketingProductQuery` independently. No merged DTO or combined type — matches the server's resource separation.
- **`Product` domain type has no `rating`**: Rating belongs to the marketing resource. `ProductDetails` reads it from the separate marketing query result.

## 6. Boundaries

### ✅ Always

- Create/modify files in `src/lib/api/marketing/`
- Create/modify files in `src/features/products/providers/`
- Update DTOs, domain models, fixtures, and MSW handlers
- Update `.env`

### ⚠️ Ask First

- Any change to `src/features/**/application/` beyond mechanical type cascade
- Any change to `src/pages/` beyond mechanical field renames

### 🚫 Never

- Modify anything in `server/`
- Remove or disable existing tests
- Change JSX structure or conditional logic beyond what R3 requires in `ProductDetails`

## 7. Task Breakdown

1. **[S]** Update env + HTTP client — rename `VITE_FAKE_STORE_API_HOST` → `VITE_API`, value `http://localhost:3001/api` — `.env`, `src/lib/http/index.ts` (R1)
2. **[P]** Update `ProductDto` + `Category` enum — `src/lib/api/products/{product-id}/product-dto.ts` (R2)
3. **[P]** Update `CartDto` — `src/lib/api/carts/{cart-id}/cart-dto.ts` (R4)
4. **[P]** Update `UserDto` — `src/lib/api/auth/users/{user-id}/user-dto.ts` (R5)
5. **[P]** Add `MarketingProductDto` + `marketingProductQuery` — `src/lib/api/marketing/{product-id}/` (R3)
6. **[S]** Fix type cascade from tasks 2–3: update `CartProductDto`, `ProductsListDto`, domain models (`product.ts`, `cart.ts`); rename fields (`title→name`, `image→imageUrl`, `price: number→price: {amount, currency}`) across all referencing files in `src/features/` and `src/pages/`; delete `rating.ts` — after tasks 2, 3 (R2, R4)
7. **[S]** Update queries + mutation: `productsQuery` (drop hardcoded total), `cartProductsQuery` (string IDs), `useAddToCartMutation` (string IDs), `user-query.ts` (read `cartId`) — `src/lib/api/` — after task 6 (R2, R4, R5, R6)
8. **[S]** Add `useMarketingProductQuery` provider + update `ProductDetails` — `src/features/products/providers/use-marketing-product-query.ts`, `src/features/products/components/ProductDetails.tsx` — after task 5 (R3)
9. **[S]** Update test fixtures — `ProductFixture`, `CartFixture` to new DTO shapes — `src/test-lib/fixtures/` — after task 6 (R7)
10. **[S]** Add + update MSW handlers; update stories — add `get-marketing-product-handler.ts`, update all handlers in `src/test-lib/handlers/`, add marketing handler to `ProductDetails` stories — after tasks 8, 9 (R7)

## 8. Error & Edge Cases

- GIVEN a `productId` has no matching marketing record, WHEN `useMarketingProductQuery` resolves with 404, THEN the error propagates through the existing error boundary — same UX as a missing catalog product (R3)
- GIVEN `VITE_API` is not set, WHEN the app boots, THEN all API calls fail at the HTTP client level — no silent partial failures (R1)
- GIVEN the local server is not running, WHEN any query fires, THEN the existing `react-error-boundary` handles it — no new error handling needed (R1)

## 11. References

- `server/docs/overview.md` — local server endpoints and auth details
- `docs/architecture.md` — feature slice layers and API layer conventions
