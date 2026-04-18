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

## L001 — Translation keys must be added alongside new user-facing values

**Rule:** When adding any value that renders as a user-facing label (enum value, status, domain constant), always add the corresponding translation key to `public/locales/en-GB/translation.json` in the same task. Remove stale keys when their associated values are removed.

**Why it failed:** A new domain value was added without a matching translation key, so the label hook silently fell back to the raw string instead of a human-readable label.

**How to apply:** Before finishing any task that introduces a new user-facing value, check the locale file at `public/locales/en-GB/translation.json` and the corresponding label hook or `messageKeys` map in the feature. The translation namespace mirrors the feature path — e.g. `features.products.categories` maps to `translation.json` → `features → products → categories → <key>`.

**Source:** Correction 2026-04-12 — `Category.Clothing` had no translation key; stale keys were left behind.

---

## L002 — Never use DTO types outside of `providers/` and `models/`

**Rule:** Types with a `Dto` suffix (API models) live in `src/lib/api/`. They must never be imported directly into `components/`, `application/`, or `pages/`. Instead, use Domain (frontend) models or if Domain model resembles DTO re-export the DTO under a domain name from `features/<feature>/models/` (e.g. `export type { MarketingProductDto as MarketingProduct }`) and import that model type everywhere else.

**Why it failed:** When lifting a fetch from a component to a page, `MarketingProductDto` was imported directly into `ProductDetails.tsx` instead of going through `models/`. `docs/architecture.md` documents this boundary: `providers/` is the data access gateway and DTO types must not leak beyond it.

**How to apply:** Before using any type from `src/lib/api/` in a component or page, check whether a domain alias exists in the feature's `models/`. If not, create one following the pattern in `product.ts`: `export type { XxxDto as Xxx } from "@/lib/api/..."`.

**Source:** Correction 2026-04-12 — `MarketingProductDto` leaked into `ProductDetails.tsx` component props.

---

## L004 — Missing `error-boundary` building block

**Rule:** Feature components embedded inside pages (e.g. `ProductRating` inside `ProductPage`) need scoped error handling so their failure doesn't blank the whole page — an "island" error boundary. The pattern should cover both React render errors and React Query errors (`useQuery({ throwOnError })` composed with `QueryErrorResetBoundary`) in one consistent wrapper. No typed block exists for this in `.agents/skills/building-blocks/SKILL.md`, so specs either skip scoped error UI or reinvent it per feature.

**Why it failed:** Spec 005 needed `ProductRating` to degrade gracefully if the marketing query failed, but no canonical pattern existed — the spec deferred error handling entirely rather than ship a one-off.

**How to apply:** When a spec introduces a feature-level component mounted inside a page, ask whether its failure should blank the page or render a scoped fallback. If scoped, flag the `island-error-boundary` gap and defer the error UI rather than inventing one. When the block is added, it should wrap `react-error-boundary` + `QueryErrorResetBoundary`, surface a `fallback` prop, and standardize the treatment of render vs. query errors.

**Source:** Spec 005 Q1 — rating component error UI deferred because no canonical island-error pattern existed.

---
