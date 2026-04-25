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

## L003 — Spec boundaries must only contain reachable actions for that specific feature

**Rule:** Every item in the ✅/⚠️/🚫 boundary tiers must be realistically reachable during implementation of the specific feature being specced. Do not add generic catch-all items (e.g. "Add new npm dependencies") when the feature clearly has no reason to require them.

**Why it failed:** A generic "Add new npm dependencies to package.json" ⚠️ item was added to a spec that purely wires a new API endpoint into existing building blocks — no new package could plausibly be needed.

**How to apply:** Before finalising the Boundaries section, ask for each item: "Could this actually happen while implementing this specific feature?" If the answer is no, remove it. Boundaries that exist only as boilerplate add noise and dilute the signal of genuinely risky actions.

**Source:** Correction 2026-04-25 — remove-cart-product spec included an artificial "Add new npm dependencies" boundary item.

---

## L004 — Split translation files by feature to avoid loading the full locale into context

**Rule:** Never read the entire `translation.json` when only one feature's keys are needed. Translation files should be split per feature (e.g. `public/locales/en-GB/features/carts.json`) so only the relevant file is read. When adding or verifying keys for a feature, read only that feature's file.

**Why it failed:** A single monolithic `public/locales/en-GB/translation.json` forced the agent to load the entire locale file just to add or verify a handful of cart keys, polluting context with unrelated pages, auth, products, and marketing strings.

**How to apply:** Before adding translation keys for a feature, check whether a per-feature locale file exists under `public/locales/<locale>/features/<feature>.json`. If the project still uses a monolith, raise the split as a prerequisite task rather than reading the whole file. When the split is in place, only read the relevant feature file.

**Source:** Correction 2026-04-25 — full `translation.json` was read to add four cart keys during remove-cart-product implementation.
