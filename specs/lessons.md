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
