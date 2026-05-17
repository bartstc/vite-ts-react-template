---
schema_version: 1
id: 002-product-reviews
artifact: requirements
status: review
author: bartstc
created: 2026-05-17
last_updated: 2026-05-17
---

# Product Reviews — Requirements

## 1. Goal & Context

Marketing products currently support star-only ratings via a compat shim (`PATCH /api/marketing/products/:id/rate`). The server now exposes a full reviews API (rating + title + comment, one review per user per product, with GET/POST/PUT). This feature exposes written reviews in the UI: users can view product reviews, write a review, and upgrade an existing star-only rating with title/comment.

## 2. Requirements

- **R1**: WHEN an authenticated user clicks a star on a product page, THE SYSTEM SHALL submit the rating immediately via the rate endpoint and reflect the new average rating in the UI.
- **R2**: WHEN a guest (unauthenticated user) views a product page, THE SYSTEM SHALL render the star rating and review count as read-only and hide the "Write a review" / "Add review details" action.
- **R3**: WHEN an authenticated user has no existing review for a product, THE SYSTEM SHALL display a "Write a review" button that opens a review dialog with the rating preselected from the current star value and empty title/comment.
- **R4**: WHEN an authenticated user has an existing review for a product, THE SYSTEM SHALL display an "Add review details" / "Edit review" button that opens the dialog prefilled with the user's existing rating, title, and comment.
- **R5**: WHEN the review dialog is submitted and the user has no existing review, THE SYSTEM SHALL create a review via POST and refresh the product rating and review list.
- **R6**: WHEN the review dialog is submitted and the user has an existing review, THE SYSTEM SHALL update it via PUT and refresh the product rating and review list.
- **R7**: WHEN the review dialog is submitted, THE SYSTEM SHALL require a rating between 1 and 5, allow optional title (max 120 chars) and optional comment (max 2000 chars), and block submission with inline errors otherwise.
- **R8**: WHEN a product page loads, THE SYSTEM SHALL render a reviews list section below the product details showing the latest 10 reviews sorted by `createdAt` descending, each with author name, rating, title, comment, and date.
- **R9**: WHEN the user clicks the "See reviews (N)" count button, THE SYSTEM SHALL smooth-scroll the page to the reviews list section.
- **R10**: WHEN the product has zero reviews, THE SYSTEM SHALL render an empty-state message in the reviews list section and disable the "See reviews" button.

## 3. Non-Goals / Out of Scope

- Editing or deleting reviews after submission is NOT in scope beyond the user upgrading their own single review via PUT (no separate edit/delete UI on individual reviews).
- Pagination, "load more", filtering, or sorting controls on the reviews list.
- Moderation, reporting, or flagging of reviews.
- Server-side schema or contract changes — the server endpoints already exist as documented.
- Replacing or removing the existing `PATCH /rate` compat shim.
