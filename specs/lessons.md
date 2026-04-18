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

## L004 — Spec boundaries must only list items within the feature's scope

**Rule:** The ⚠️ Ask First boundary tier must only include items that are plausible within the current feature's scope. Generic project-wide concerns (e.g. "adding npm dependencies") that have no connection to the feature being specced must be omitted.

**Why it failed:** "Adding new npm dependencies" was added to ⚠️ Ask First in a spec that adds no dependencies — it was a boilerplate copy-paste rather than a scope-specific boundary.

**How to apply:** Before finalising the Boundaries section, ask: "Is this item actually reachable during implementation of this feature?" If no, remove it.

**Source:** Correction 2026-04-17 — spec 004-product-rating Boundaries section.

---

## L005 — Never explore the codebase for patterns during implementation — read spec and building-blocks rules instead

**Rule:** Before implementing any building block, read the spec's Building Blocks Diff and the corresponding rule file in `.agents/skills/building-blocks/rules/`. Do not open existing feature files to reverse-engineer patterns. If a rule file is missing or ambiguous, raise that gap — do not substitute with file exploration.

**Why it failed:** An agent issued broad `read`/`list` calls across multiple feature folders (`providers/`, `application/`, `models/`, `lib/api/`) to infer patterns from live code. The spec already listed every building block to create, and the building-blocks skill already documents the canonical pattern for each one. The exploration was pure redundancy — and risks drifting toward the existing code's quirks rather than the authoritative pattern.

**How to apply:** At the start of every implementation task: (1) open the spec, identify every block in the Building Blocks Diff, (2) for each block, load the matching rule file from `.agents/skills/building-blocks/rules/<block>.md`, (3) implement against the rule, not against existing files. Only read an existing file when the spec explicitly says "follow the pattern in `path/to/file.ts`" or when you need to find the exact symbol to import (e.g. a query key or provider name).

**Source:** Correction 2026-04-17 — spec 004-product-rating implementation; agent explored 9+ existing files instead of reading building-blocks rules.
