## Fixture

Deterministic test data factory for a domain type. Built via `createFixture<T>(template)`, which returns three methods:

- `toStructure()` — returns the template as-is.
- `createPermutation(extend?)` — returns a single instance, deep-merged with an object override or a `(template) => DeepPartial<T>` function override.
- `createCollection(extend)` — returns an array. `extend` is either an array of `DeepPartial<T>` (one entry per item) or a `(template) => DeepPartial<T>[]` function.

Used in unit tests, hook tests, and Storybook story args.

### Constraints

- One file per domain type. Filename mirrors the type: `product-fixture.ts` exports `ProductFixture`.
- Templates are **deterministic**: no `Math.random()`, no `Date.now()`, no `faker` in defaults. Use fixed strings, `generateUuid()` from `@/test-lib/generate-uuid` for UUIDs, and `DateVO` (e.g. `DateVO.past()`) for dates. Non-determinism in defaults is the #1 source of flaky tests.
- Uniqueness across a collection is the caller's responsibility — pass `{ id: generateUuid() }` per item when unique IDs matter.
- Export **factory methods, not pre-built constants**. A shared `const defaultProduct = { ... }` is a trap — one test mutating it poisons the next.
- Fixtures live in `test-lib/fixtures/` — never in `src/features/`.
- Prefer **named trait functions** over magic-string preset enums when a preset touches ≥ 3 fields and repeats across files. Traits preserve autocomplete and types; enums don't.

### Example — template definition

```ts
import type { Cart } from "@/features/carts/models/cart";
import { DateVO } from "@/lib/date/date";
import { USER_CART_ID } from "@/test-lib/fixtures/user-fixture";

import { createFixture } from "./create-fixture";

export const CartFixture = createFixture<Cart>({
  id: USER_CART_ID,
  date: DateVO.past(),
  userId: 1,
  products: [
    { productId: "4f968992-1aab-49c9-8913-09405915c1c0", quantity: 2 },
  ],
});
```

### Example — consumer usage

```ts
// Defaults only
const defaultCart = CartFixture.toStructure();

// Single instance with an object override
const emptyCart = CartFixture.createPermutation({ products: [] });

// Single instance with a function override (derives from the template)
const doubledCart = CartFixture.createPermutation((template) => ({
  products: template.products.map((p) => ({ ...p, quantity: p.quantity * 2 })),
}));

// Collection with per-item overrides (unique IDs)
const carts = CartFixture.createCollection([
  { id: generateUuid() },
  { id: generateUuid() },
  { id: generateUuid(), userId: 2 },
]);

// Collection with function override
const threeVariants = CartFixture.createCollection((template) => [
  { id: generateUuid(), products: template.products },
  { id: generateUuid(), products: [] },
  { id: generateUuid(), userId: 99 },
]);
```

### Example — named trait

```ts
// Preferred over CartFixture.createPermutation({ preset: "empty" })
export const emptyCart = (extend: DeepPartial<Cart> = {}) =>
  CartFixture.createPermutation({ ...extend, products: [] });
```

### References

- `rules/msw-handler.md` — fixtures populate default handler responses
- `rules/component-story-test.md` — fixtures populate story `args`
- `rules/hook-test.md` — fixtures replace inline literals in hook tests
- `rules/unit-test.md` — fixtures replace inline literals in unit tests
