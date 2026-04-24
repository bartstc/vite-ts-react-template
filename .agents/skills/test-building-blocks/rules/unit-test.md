## Unit Test

Vitest test for non-hook, pure-logic units — mappers, transformers, value objects, selectors, date math, and other deterministic functions. Verifies behavior, not implementation detail. One test file per source unit, co-located. For custom hooks, use `rules/hook-test.md`.

### Constraints

- Co-located with source. `to-view-model.ts` → `to-view-model.test.ts`.
- One `describe` block per unit. Name matches the exported symbol under test.
- One `it` per distinct observable behavior. Do not write redundant cases that other tests already cover or that the type system already prevents.
- Assert on return values or side effects via project-owned spies. Do not assert on internal state that isn't exposed.
- Use fixtures for any domain object — do not inline literals when a fixture exists.
- **Prefer MSW over `vi.mock` for anything HTTP-backed**. If the unit under test touches the network, mock the endpoint via MSW, not the `lib/api/` wrapper.
- `vi.mock` / `vi.stubGlobal` is reserved for: non-determinism sources (`Date.now`, `crypto.randomUUID`, `Math.random`), write-only side-effect sinks (analytics, logging), pure utilities in a unit test of their direct caller, and XState actor/action injection via `machine.provide()`.
- For XState machines, use `waitFor` from the **`xstate` package** (not `@testing-library/react`) for async state assertions.

### Example — pure mapper

```ts
import { describe, it, expect } from "vitest";

import { ProductFixture } from "@/test-lib/fixtures/product-fixture";

import { toProductViewModel } from "./to-product-view-model";

describe("toProductViewModel", () => {
  it("formats price with currency symbol", () => {
    const product = ProductFixture.createPermutation({
      price: { amount: 129.99, currency: "USD" },
    });

    expect(toProductViewModel(product).formattedPrice).toBe("$129.99");
  });

  it("flags out-of-stock products", () => {
    const product = ProductFixture.createPermutation({ stock: 0 });

    expect(toProductViewModel(product).isOutOfStock).toBe(true);
  });
});
```

### Example — XState machine with provided actions

```ts
import { createActor, waitFor } from "xstate";
import { it, expect, vi } from "vitest";

import { checkoutMachine } from "./checkout-machine";

it("reaches success after submit and calls the log action", async () => {
  const logSpy = vi.fn();
  const actor = createActor(
    checkoutMachine.provide({ actions: { log: logSpy } })
  ).start();

  actor.send({ type: "SUBMIT" });
  const snap = await waitFor(actor, (s) => s.matches("success"), {
    timeout: 1000,
  });

  expect(snap.value).toBe("success");
  expect(logSpy).toHaveBeenCalled();
});
```

### References

- `rules/hook-test.md` — for custom hooks (use `renderHook`, not direct invocation)
- `rules/component-story-test.md` — for component-level behavior
- `rules/fixture.md` — test data factory used inside unit tests
