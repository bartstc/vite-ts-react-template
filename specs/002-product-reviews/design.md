---
schema_version: 1
id: 002-product-reviews
artifact: design
status: review
author: bartstc
created: 2026-05-17
last_updated: 2026-05-17
---

# Product Reviews — Design

## 1. Building Blocks Diff

### Added

API layer (`src/lib/api/marketing/{product-id}/reviews/`):

- `reviewDto` (dto-model), `productReviewsQuery` (query-options-factory), `createReviewMutation` (mutation-options-factory), `updateReviewMutation` (mutation-options-factory)

Sub-feature slice `src/features/marketing/reviews/`:

- `Review` (frontend-model) — `models/`
- `useProductReviewsQuery`, `useCreateReviewMutation`, `useUpdateReviewMutation` (providers)
- `useCurrentUserReview` (facade-hook) — derives current user's review from the reviews query
- `useSubmitReview` (use-case-hook) — picks POST vs PUT based on existence
- `useReviewFormNotifications` (notification-hook)
- `ReviewList`, `ReviewListItem`, `ReviewListEmpty` (pure-component), `ReviewListFallback` (error-boundary fallback)
- `WriteReviewButton` (compound-component) — opens dialog
- `ReviewFormDialog` (compound-component) — wraps `ReviewForm`
- `ReviewForm` (form) — inlined `ReviewFormValues` interface; field-level `register` validation (rating 1–5 required, title optional ≤120, comment optional ≤2000)

**i18n:**

- `public/locales/en/translation.json` — add `features.marketing.reviews.*` keys
- `public/locales/pl/translation.json` — same keys

### Modified

- `ProductRating.tsx` — wire "See reviews (N)" to scroll to anchor; compose `WriteReviewButton` (auth-gated)
- `StarRating.tsx` — disable interaction for guests
- `src/pages/Product/index.tsx` — render `ReviewList` below `ProductDetails` with scroll anchor id
- `src/lib/api/marketing/marketing-query-keys.ts` — add `reviews(productId)` key

### Deleted

- None.

## 2. Design Decisions

- **Rating UX**: keep star-click as instant `PATCH /rate` (current behavior), add a separate `WriteReviewButton` that opens a dialog. Rejected the "stars open dialog" path because it adds a click and a modal for the most common low-intent action (giving a star).
- **Upgrade path**: client picks POST vs PUT in `useSubmitReview` based on whether `useCurrentUserReview` returns a review. Rejected duplicating logic in two button handlers — single use-case hook keeps the routing decision in one place.
- **Reviews list location**: rendered by the page (not by `ProductDetails`) so the feature slice isn't responsible for layout of a sibling section, and the scroll anchor lives at the page level where both `ProductRating` (trigger) and `ReviewList` (target) compose.
- **Star-only reviews shown in list**: included as-is with empty title/comment — list item conditionally renders title/comment blocks. Rejected client-side filtering because it desyncs the displayed list count from the rating count.

## 3. Boundaries

### ✅ Always (proceed without asking)

- Create files under `src/features/marketing/reviews/`
- Create files under `src/lib/api/marketing/{product-id}/reviews/`
- Add translation keys to `public/locales/{en,pl}/translation.json` under `features.marketing.reviews.*`
- Modify `src/features/marketing/rating/components/ProductRating.tsx` and `StarRating.tsx` for compose + auth gating
- Skip writing Vitest unit tests and Storybook stories for this feature (per developer instruction)

### ⚠️ Ask First (needs human approval)

- Add any new dependency to `package.json`
- Change the page composition file path/structure for product details
- Add new fields to existing DTO types in `src/lib/api/marketing/`
- Introduce a new route

### 🚫 Never (hard stops)

- Modify server code under `server/`
- Modify the `PATCH /rate` mutation or `rateMarketingProductHandler`
- Introduce edit/delete UI for reviews beyond the single-user self-upgrade path
- Cross-import between `features/marketing/rating/` and `features/marketing/reviews/` sub-slices (parent layers only)
- Use `as` type assertions or `any`
