---
schema_version: 1
id: 002-product-reviews
artifact: tasks
status: review
author: bartstc
created: 2026-05-17
last_updated: 2026-05-17
---

# Product Reviews — Tasks

## 1. Task Breakdown

1. [S] Extend `marketing-query-keys.ts` with `reviews(productId)` key — `src/lib/api/marketing/marketing-query-keys.ts` (R8)
2. [P] Add `reviewDto` — `src/lib/api/marketing/{product-id}/reviews/review-dto.ts` (R5, R6, R8)
3. [P] Add `productReviewsQuery` (queryOptions factory) — `src/lib/api/marketing/{product-id}/reviews/product-reviews-query.ts` (R8)
4. [P] Add `createReviewMutation` — `src/lib/api/marketing/{product-id}/reviews/create-review-mutation.ts` (R5)
5. [P] Add `updateReviewMutation` — `src/lib/api/marketing/{product-id}/reviews/update-review-mutation.ts` (R6)
6. [P] Add `Review` frontend model — `src/features/marketing/reviews/models/review.ts` (R8)
7. [S] Add `useProductReviewsQuery` provider — `src/features/marketing/reviews/providers/use-product-reviews-query.ts` (R8)
8. [P] Add `useCreateReviewMutation` provider (invalidates product + reviews keys) — `src/features/marketing/reviews/providers/use-create-review-mutation.ts` (R5)
9. [P] Add `useUpdateReviewMutation` provider (invalidates product + reviews keys) — `src/features/marketing/reviews/providers/use-update-review-mutation.ts` (R6)
10. [S] Add `useCurrentUserReview` facade hook — `src/features/marketing/reviews/application/use-current-user-review.ts` (R3, R4)
11. [S] Add `useSubmitReview` use-case hook (chooses POST vs PUT) — `src/features/marketing/reviews/application/use-submit-review.ts` (R5, R6)
12. [P] Add `useReviewFormNotifications` — `src/features/marketing/reviews/application/use-review-form-notifications.ts` (R5, R6)
13. [P] Add `ReviewListItem`, `ReviewListEmpty`, `ReviewListFallback` — `src/features/marketing/reviews/components/` (R8, R10)
14. [S] Add `ReviewList` composing item/empty/fallback, consumes `useProductReviewsQuery` — `src/features/marketing/reviews/components/ReviewList.tsx` (R8, R10)
15. [P] Add `ReviewForm` with inlined `ReviewFormValues` interface and field-level validation — `src/features/marketing/reviews/components/ReviewForm.tsx` (R7)
16. [S] Add `ReviewFormDialog` wrapping `ReviewForm`, prefills from `useCurrentUserReview`, submits via `useSubmitReview` — `src/features/marketing/reviews/components/ReviewFormDialog.tsx` (R3, R4, R5, R6, R7)
17. [S] Add `WriteReviewButton` (label switches "Write a review" / "Edit review", hidden for guests) — `src/features/marketing/reviews/components/WriteReviewButton.tsx` (R2, R3, R4)
18. [S] Update `ProductRating.tsx`: gate stars + button on auth, wire "See reviews (N)" to scroll to anchor id, compose `WriteReviewButton` — `src/features/marketing/rating/components/ProductRating.tsx` (R1, R2, R9, R10)
19. [S] Update `StarRating.tsx`: disable star click for guests — `src/features/marketing/rating/components/StarRating.tsx` (R2)
20. [S] Render `ReviewList` below `ProductDetails` with scroll anchor id — `src/pages/Product/index.tsx` (R8, R9)
21. [P] Add `features.marketing.reviews.*` keys to `public/locales/en/translation.json` and `public/locales/pl/translation.json` (R3, R4, R7, R8, R10)

## 2. Error & Edge Cases

- GIVEN the reviews query fails, WHEN the product page renders, THEN `ReviewListFallback` shall be displayed in the reviews section via the error boundary.
- GIVEN a guest is viewing a product, WHEN they hover the stars, THEN no rate action shall fire and the `WriteReviewButton` shall not be present in the DOM.
- GIVEN the user has an existing star-only review (empty title/comment), WHEN they open the dialog, THEN rating is prefilled and title/comment are empty editable fields.
- GIVEN the user submits the form with rating `0` or out of range, WHEN validation runs, THEN inline error appears and no request is sent.
- GIVEN the user submits a review and the API returns 409 on POST (race with another tab), WHEN the mutation settles, THEN the client shall refetch reviews and switch to update mode without surfacing a fatal error.
- GIVEN there are zero reviews, WHEN the page renders, THEN `ReviewListEmpty` is shown and the "See reviews (0)" button is disabled.
- GIVEN the user clicks "See reviews (N)" on a product with at least one review, WHEN the click fires, THEN the page scrolls smoothly to the reviews section anchor.

## 3. Open Questions

- None.

## 4. References

- Server handlers: [server/src/modules/marketing/marketing.handlers.ts](server/src/modules/marketing/marketing.handlers.ts)
- Existing rating slice: [src/features/marketing/rating/](src/features/marketing/rating/)
- Before implementing each building block, read `.claude/skills/building-blocks/rules/{type}.md` for its type.
