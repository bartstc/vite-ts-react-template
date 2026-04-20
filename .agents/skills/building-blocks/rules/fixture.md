---
title: Fixture
category: Testing
layer: test-lib/fixtures/
composedWith: (none — leaf block)
---

## Fixture

Deterministic test data factory for a domain type. Built via the shared `createFixture<T>(template)` helper, which returns an object with three methods: `toStructure()`, `createPermutation(extend?)`, and `createCollection(extend)`. Used in both unit tests and Storybook story args.

### Available methods

- **`toStructure()`** — returns a deep clone of the template. No overrides. Use when the default values are exactly what the test needs.
- **`createPermutation(extend?)`** — returns a single instance with a deep merge applied on top of the template. `extend` can be either a `DeepPartial<T>` object or a function `(template: T) => DeepPartial<T>` (useful when the override depends on a value from the template itself).
- **`createCollection(extend)`** — returns an array. `extend` is either an array of `DeepPartial<T>` (one entry per item) or a function `(template: T) => DeepPartial<T>[]` (again, when the overrides depend on the template). Each item is a deep merge of the template and its entry.

### Constraints

- One file per domain type. Filename mirrors the type: `product-fixture.ts` exports `ProductFixture`.
- Templates are deterministic: no `Math.random()`, no `Date.now()`, no `faker`. Use fixed strings, fixed ISO date strings, and `generateUuid()` (from `@/test-lib/generate-uuid`) when a UUID is part of the template.
- Uniqueness across a collection is the caller's responsibility: pass `{ id: generateUuid() }` per item when unique IDs matter.
- Fixtures live in `test-lib/fixtures/` — never in `src/features/`.

### Example — template definition

```ts
import { Category } from "@/features/products/models/category";
import type { Product } from "@/features/products/models/product";
import { generateUuid } from "@/test-lib/generate-uuid";

import { createFixture } from "./create-fixture";

export const ProductFixture = createFixture<Product>({
  id: generateUuid(),
  name: "White Nike Shoes",
  category: Category.Clothing,
  price: { amount: 129.99, currency: "USD" },
  imageUrl: "https://example.com/white-nike-shoes.jpg",
  description: "Lorem ipsum dolor sit amet.",
  addedAt: "2025-01-15T10:00:00.000Z",
});
```

### Example — consumer usage

```ts
// Defaults only
const defaultProduct = ProductFixture.toStructure();

// Single instance with an object override
const blackShoes = ProductFixture.createPermutation({
  name: "Black Adidas Shoes",
});

// Single instance with a function override (uses the template to derive the override)
const discounted = ProductFixture.createPermutation((template) => ({
  price: {
    amount: template.price.amount * 0.5,
    currency: template.price.currency,
  },
}));

// Collection with per-item overrides (unique IDs)
const products = ProductFixture.createCollection([
  { id: generateUuid() },
  { id: generateUuid() },
  { id: generateUuid(), name: "Special Edition" },
]);

// Collection with function override
const threeVariants = ProductFixture.createCollection((template) => [
  { id: generateUuid(), name: `${template.name} - S` },
  { id: generateUuid(), name: `${template.name} - M` },
  { id: generateUuid(), name: `${template.name} - L` },
]);
```

### References

- `rules/msw-handler.md` — fixtures populate default handler responses
- `rules/component-story-test.md` — fixtures populate story `args`
- `rules/unit-test.md` — fixtures replace inline literals in unit tests
