# Lessons Learned

Patterns captured after corrections. Review at session start.

## Template

```markdown
## L<NNN> — <short title>

**Rule:** <the rule to follow going forward>

**Why it failed:** <what caused the mistake>

**How to apply:** <concrete guidance for when/where this kicks in>

**Source:** <context — spec, PR, correction date>
```

---

## L001 — Translation keys ship with user-facing values

**Rule:** New user-facing value (enum, status, domain constant) → add its key to `public/locales/en-GB/translation.json` in the same task. Remove stale keys when values go away.

**Why it failed:** A new domain value shipped without a translation key; the label hook silently fell back to the raw string.

**How to apply:** Namespace mirrors the feature path — `features.products.categories.<key>` maps to `translation.json` → `features → products → categories → <key>`. Verify against the locale file and the feature's label hook or `messageKeys` map before finishing.

**Source:** Correction 2026-04-12 — `Category.Clothing` had no translation key; stale keys were left behind.

---

## L002 — Never import DTO types outside `providers/` and `models/`

**Rule:** `Dto`-suffixed types (from `src/lib/api/`) must not be imported by `components/`, `application/`, or `pages/`. Use a domain model from `features/<feature>/models/`, or re-export with `export type { XxxDto as Xxx } from "@/lib/api/..."` when the domain shape matches the DTO.

**Why it failed:** Lifting a fetch from a component to a page, `MarketingProductDto` was imported directly into `ProductDetails.tsx`. Per `docs/architecture.md`, `providers/` is the data-access gateway — DTOs must not leak past it.

**How to apply:** Before using any `src/lib/api/` type in a component or page, check `features/<feature>/models/` for a domain alias. If none exists, add one following `product.ts`.

**Source:** Correction 2026-04-12 — `MarketingProductDto` leaked into `ProductDetails.tsx` component props.

---

## L003 — Invoke skills via the Skill tool before exploring code

**Rule:** Skill name in the prompt → call `Skill({ skill: "<name>" })` FIRST. No Read, Grep, or Explore subagent before the skill has loaded.

**Why it failed:** When `test-building-blocks` was referenced, Explore agents scanned the codebase instead — producing reverse-engineered patterns the rule files already capture, and bleeding code examples into `specs/001-remove-cart-product/tests.md` instead of building-block names.

**How to apply:** First action on any prompt mentioning a skill. After the skill loads, read only the `rules/<block>.md` files for the blocks you'll implement. Existing source files are read afterward and only for integration points (imports, symbols, fixture names, handler paths) — never to learn patterns.

**Source:** Correction 2026-04-25 — `test-building-blocks` not invoked when planning tests for the remove-cart-product feature.

---

## L004 — Detect API errors via `httpService.isError(e)` + message string

**Rule:** In `mutationFn` catch blocks, translate API errors using `httpService.isError(e) && e.message === "<server message>"`. Do not import `AjaxError` or compare `e.status` / `e.response?.status` — match the existing convention used across `src/lib/api/`.

**Why it failed:** Wrote `e instanceof AjaxError && e.status === 409` for a 409 handler instead of the codebase's `httpService.isError(e) && e.message === "..."` pattern. The server's body `message` is propagated to `error.message` by the ky `beforeError` hook (`src/lib/http/ky-client.ts`), so message-string matching is the supported path.

**How to apply:** When adding a new mutation that maps an HTTP error to a domain exception, find the exact `reply.code(...).send({ message: "..." })` string in the server handler and match it verbatim with `e.message`. Mirror the style of `src/lib/api/carts/{cart-id}/add-to-cart-mutation.ts`.

**Source:** Correction 2026-05-17 — `create-review-mutation.ts` initially used `AjaxError`/`e.status` for the 409 case.

---

## L005 — Never import across sub-feature slices

**Rule:** Sub-feature slices under the same feature (e.g. `marketing/rating/` and `marketing/reviews/`) must not import from each other. Shared constants, anchor IDs, or cross-slice wiring belong at the page level or in a shared parent layer.

**Why it failed:** `ProductRating.tsx` (inside `rating/`) imported `REVIEWS_ANCHOR_ID` and `WriteReviewButton` from `reviews/` — caught by the `boundaries/dependencies` ESLint rule. The spec design doc explicitly states: "Cross-import between `features/marketing/rating/` and `features/marketing/reviews/` sub-slices — Never (hard stops)."

**How to apply:** When a component in one sub-slice needs to trigger or reference something from a sibling sub-slice, move the wiring up to the page or a parent feature layer. Use render props / slots (e.g. `writeReviewSlot`) to inject cross-slice UI, and pass callbacks (e.g. `onSeeReviews`) down from the page.

**Source:** Correction 2026-05-17 — `ProductRating.tsx` imported `WriteReviewButton` and `REVIEWS_ANCHOR_ID` from `reviews/` sub-slice.

To MEMORY.md was added this:

- [API error detection](feedback_api_error_detection.md) — in `src/lib/api/` mutationFn catches, use `httpService.isError(e) && e.message === "..."`, never `AjaxError`/`e.status` - while I think it should be more clear in the building block
