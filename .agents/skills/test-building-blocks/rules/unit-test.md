## Unit Test

_Subject: pure logic or an XState machine · File: co-located `<source>.test.ts`_

Vitest test for deterministic, non-hook units: mappers, transformers, value objects, selectors, date math, query-key
factories, and XState machines. Call it, assert the result, mock nothing but non-determinism. For hooks, use
`rules/hook-test.md`; for `lib/api/` factories, `rules/api-test.md`.

### Constraints

- One `describe` per unit, named after the exported symbol under test.
- Assert return values, or for a machine the reached state and its context. No internal state that isn't exposed.
- **Pure logic mocks nothing.** If a pure function needs a mock, it isn't pure — pass the dependency as a parameter.
- **Machines get their side effects through `machine.provide({ actors, actions })`** — the machine's own DI seam.
  Build a `create<Name>Actor(overrides)` helper whose defaults resolve the happy path, so each test overrides only the
  step it exercises.
- Machine actors reject with the same domain error classes `lib/api/` throws, so the real guard runs.
- For async machine assertions, use `waitFor` from the **`xstate` package**, not `@testing-library/react`.

### Example — pure mapper

```ts
import { ProductFixture } from "@/test-lib/fixtures/product-fixture";

import { toProductViewModel } from "./to-product-view-model";

describe("toProductViewModel", () => {
  it("formats price with currency symbol", () => {
    const product = ProductFixture.createPermutation({
      price: { amount: 129.99, currency: "USD" },
    });

    expect(toProductViewModel(product).formattedPrice).toBe("$129.99");
  });
});
```

### Example — XState machine with provided actors

```ts
import { createActor, fromPromise, waitFor } from "xstate";

import {
  type CheckoutMachineActors,
  checkoutMachine,
} from "@/features/checkout/application/checkout-machine";
import { OutOfStockError } from "@/features/checkout/models/checkout-error";
import { CheckoutSessionFixture } from "@/test-lib/fixtures/checkout-session-fixture";
import { OrderFixture } from "@/test-lib/fixtures/order-fixture";
import { USER_CART_ID } from "@/test-lib/fixtures/user-fixture";

const createCheckoutActor = (overrides: Partial<CheckoutMachineActors> = {}) =>
  createActor(
    checkoutMachine.provide({
      actors: {
        initiate: fromPromise(() =>
          Promise.resolve(CheckoutSessionFixture.toStructure())
        ),
        apply: fromPromise(() =>
          Promise.resolve(CheckoutSessionFixture.toStructure())
        ),
        confirm: fromPromise(() => Promise.resolve(OrderFixture.toStructure())),
        ...overrides,
      },
    }),
    { input: { cartId: USER_CART_ID } }
  );

describe("checkoutMachine", () => {
  it("fails with the out-of-stock items when initiation is rejected", async () => {
    const ITEMS = [{ productId: "product-1", requested: 2, available: 0 }];
    const actor = createCheckoutActor({
      initiate: fromPromise(() => Promise.reject(new OutOfStockError(ITEMS))),
    }).start();

    const snapshot = await waitFor(actor, (s) => s.matches("failed"));

    expect(snapshot.context).toMatchObject({
      type: "FAILED",
      error: expect.any(OutOfStockError),
    });
  });
});
```

### Anti-patterns

❌ `vi.mock` of a pure helper the subject calls — the test now checks the wiring, not the result.

❌ Spying on a machine action to prove it ran when the reached state or context already proves it.

❌ `waitFor` from `@testing-library/react` on an actor, or a fixed `setTimeout` before asserting.

❌ Testing a re-export, a constant, or a type declaration.

❌ One `it` per input of the same rule — use `it.each`.

### References

- `rules/hook-test.md` — for hooks (`renderHook`)
- `rules/api-test.md` — for `lib/api/` factories
- `rules/fixture.md` — test data
