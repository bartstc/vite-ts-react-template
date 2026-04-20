---
title: Unit Test
category: Testing
layer: co-located `.test.ts` / `.test.tsx`
composedWith: fixture
---

## Unit Test

Vitest test for a pure-logic unit — utility, hook, store, value object, or model transformation. Verifies behavior, not implementation detail. One test file per source unit, co-located.

### Constraints

- Co-located with source. `foo.ts` → `foo.test.ts`. `use-bar.ts` → `use-bar.test.ts`.
- One `describe` block per unit. Name matches the exported symbol under test.
- One `it` per distinct behavior. Do not write redundant cases that other tests already cover or that the type system already prevents.
- Assert on observable behavior (return values, DOM, side effects via mocks). Do not assert internal state that isn't exposed.
- Use fixtures for any domain object — do not inline literals when a fixture exists.

### Example

```ts
import { describe, it, expect } from "vitest";

import { add } from "./add";

describe("add", () => {
  it("should return the sum of two numbers", () => {
    expect(add(2, 3)).toBe(5);
  });
});
```

### References

- `rules/component-story-test.md` — for component-level behavior (prefer this over unit tests for rendered components)
- `rules/fixture.md` — test data factory used inside unit tests
