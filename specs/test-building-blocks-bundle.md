# Test Building Blocks Skill (bundled)

> Test building block catalog — typed patterns for Storybook play-function tests, Vitest hook tests, Vitest unit tests, MSW handlers, and test data fixtures. Read the relevant rule file before writing or modifying any test, handler, or fixture. Covers: deciding which kind of test to write, authoring a new test from scratch, adding MSW mocks or fixtures, and reviewing existing tests for conformance.

---

# SKILL

# Test Building Blocks

Typed catalog of test-related building blocks used in this project. Each block has a fixed name, layer, composition rules, and canonical example.

## How to Use

Read the rule file for each block you are about to implement. The summaries below are for routing — the rule files contain the full pattern.

Typical flow:

1. Read this file to route to the right block.
2. Read `rules/{block-name}.md` for the full pattern and canonical example.
3. Read the implementation code (component, hook, module) you are testing.
4. Write the test following the rule file's constraints.

## Testing Philosophy

The project's testing philosophy allocates verification across three layers:

- **Storybook play-function tests** are the primary verification layer for feature behavior. Focus on happy paths and the main user-observable states. Anything user-facing — components composing hooks, stores, providers — is verified here.
- **Vitest hook tests** (`renderHook`) cover custom hooks that need dedicated verification — edge cases, error paths, loading states, and hooks with logic not tied to a single component. Use independently of `component-story-test`; the two do not need to cover the same ground.
- **Vitest unit tests** are reserved for non-hook mechanics: mappers, transformers, value objects, selectors, and other pure logic.
- **No tests** for fixtures, MSW handlers, or trivial glue — these are support infrastructure, not the thing being verified.

Coverage is behavior-covered, not file-mapped. Every user-observable state has a story or a hook-test scenario; not every file has a test.

## Mocking Boundary

Mock at the **network boundary**, not the module boundary. MSW is the default for anything HTTP-backed. Do **not** mock `lib/api/` exports, React Query, or Zustand stores — let the real code run and intercept at the wire.

Module-level mocking (`vi.mock`, `vi.stubGlobal`) is reserved for:

- Non-determinism sources: `Date.now`, `crypto.randomUUID`, `Math.random`, timers.
- Write-only side-effect sinks: analytics, logging, toasts — centralized as project-owned spies in `test-lib/`.
- Pure utilities when unit-testing their direct caller.
- XState actors/actions via `machine.provide({ actors, actions })`.

Rationale: mocking `lib/api/` wrappers hides the bugs most likely to ship (wrong query key, wrong `select`, stale-time issues, cache collisions). MSW keeps the real wiring under test and only fakes the external world.

## Block Catalog

### Tests

| Block                  | Layer                     | Summary                                                                                                          | File                            |
| ---------------------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| `component-story-test` | co-located `.stories.tsx` | Storybook play-function test verifying user-facing behavior. Primary verification layer for rendered components. | `rules/component-story-test.md` |
| `hook-test`            | co-located `.test.tsx`    | Vitest test using `renderHook` for custom hooks — edge cases, error/loading paths, cross-component hooks.        | `rules/hook-test.md`            |
| `unit-test`            | co-located `.test.ts(x)`  | Vitest test for non-hook mechanics — mappers, transformers, value objects, selectors, pure functions.            | `rules/unit-test.md`            |

### Support Infrastructure

| Block         | Layer                | Summary                                                                                                                    | File                   |
| ------------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| `msw-handler` | `test-lib/handlers/` | One request handler per endpoint with optional resolver for per-scenario overrides. Shared across tests and stories.       | `rules/msw-handler.md` |
| `fixture`     | `test-lib/fixtures/` | Deterministic test data factory via `createFixture<T>()`. Supplies `toStructure`, `createPermutation`, `createCollection`. | `rules/fixture.md`     |

## Deciding Which Block to Use

Decide in this order:

1. **Is the code under test user-facing (rendered, interactive)?** → `component-story-test`. Covers the happy path and main user-observable states. Mutation hooks, Zustand stores, XState machines, context providers composed by the component are exercised transitively.
2. **Is the code under test a custom hook that needs dedicated verification?** → `hook-test`. Use for hooks whose edge cases, error branches, or loading states are awkward to reproduce through component UI, or for hooks used by multiple components where duplicating scenarios per component is wasteful.
3. **Is the code under test pure, non-hook mechanics?** → `unit-test`. Mappers, transformers, value objects, selectors, date math, query-keys factories.

For support code:

- **Need to mock an HTTP endpoint?** → `msw-handler`. One factory per endpoint; resolver at call site for per-scenario overrides.
- **Need deterministic test data?** → `fixture`. Domain type in, factory out. No randomness, no `Date.now()`.

**Do not write tests for:** fixtures, MSW handler factories, trivial glue (re-exports, constants, pass-through hooks).

## Rules

- Block files live in `rules/` — one file per block.
- Each file contains: description, constraints, and a canonical code example.
- Block names are stable identifiers. If referenced from a spec or documentation, use the exact name from the catalog.

---

# Rule: component-story-test

## Component Story Test

Storybook story with a `play` function that verifies component behavior through real user interactions — clicks, typing, selection, validation, conditional rendering. Focus on happy paths and main user-observable states; edge cases and error branches of composed hooks belong in a dedicated hook test when they are awkward to reproduce through UI.

One story per meaningful state or flow. The `Default` story is the pure-rendering baseline.

### Constraints

- Co-located with the component. `FooForm.tsx` → `FooForm.stories.tsx`.
- `Default: Story = {}` is the pure-rendering baseline — no play function on `Default`. Named stories carry play functions.
- Play context provides pre-scoped `canvas` and pre-bound `userEvent`: `play: async ({ canvas, userEvent, step, args }) => {...}`. Do not call `within(canvasElement)` or `userEvent.setup()`.
- Every `expect`, `userEvent.*`, and `findBy*` is `await`-ed.
- Phases are wrapped in `step("label", async () => { ... })`. Labels read as prose ("Validate required fields", "Fill text fields", "Submit form").
- Query priority:
  1. `getByRole(role, { name })` / `findByRole` — accessible-name queries
  2. `getByLabelText` — form fields
  3. `getByText` — visible content
  4. `getByTestId` — escape hatch; prefer adding `aria-label` or role to the component
- **Portaled content uses `screen`, not `canvas`.** Chakra `Menu`, `Popover`, `Dialog`, `Tooltip`, `Toaster`, `Combobox` listbox, `Select`, and toasts all render into `document.body`. The trigger is in `canvas`; the panel that opens is in `screen`.
- Async UI is handled with `await screen.findBy*` / `await canvas.findBy*` or `waitFor`. **NEVER** use `sleep(ms)` or `setTimeout` — every sleep is a missing `findBy*` or `waitFor`.
- Spy args use `fn()` from `storybook/test`: `args: { onSubmit: fn() }`, then `expect(args.onSubmit).toHaveBeenCalledWith(...)`. Use `action("label")` from `storybook/actions` only for manually logging non-arg events.
- Data in `args` uses fixtures (`ProductFixture.toStructure()`, `ProductFixture.createCollection([...])`). No inline literals when a fixture exists.
- One scenario per story. A play function with 10+ steps is almost always two stories. New story when starting props/state differ; new step within the same story when continuing a single user flow.
- **Do not mock composed hooks** (`vi.mock('./use-products-query')`). The story exercises the real hook; mock the endpoint the hook calls via `parameters.msw.handlers`. See `rules/msw-handler.md`.
- Use `getByRole("combobox")` not `getByLabelText` for Chakra Select triggers in play functions

### MSW in stories — meta vs story handlers

Register shared baseline handlers at the meta level; override per-story via `parameters.msw.handlers`.

**Story-level `parameters.msw.handlers` replaces the meta-level array — it does not merge.** A story that adds one override must re-declare the full baseline it still needs. Forgetting this is the #1 Storybook + MSW footgun.

```tsx
// Pattern A — re-declare baseline inline (simplest, good up to ~3 handlers)
const meta = {
  parameters: {
    msw: { handlers: [getProductsHandler(), putAddToCartHandler()] },
  },
} satisfies Meta<typeof ProductsList>;

export const ServerError: Story = {
  parameters: {
    msw: {
      handlers: [
        getProductsHandler(() => errorResponse(500, "Server error")),
        putAddToCartHandler(), // must re-declare to keep baseline
      ],
    },
  },
};
```

For per-scenario behavior variation, pass a resolver to the handler factory — see `rules/msw-handler.md`.

### Example — pure rendering baseline

Meta uses `satisfies Meta<typeof Component>` (not a plain type annotation) so `StoryObj<typeof meta>` infers `args` correctly.

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { withRouter } from "storybook-addon-remix-react-router";

import { ProductFixture } from "@/test-lib/fixtures/product-fixture";
import { generateUuid } from "@/test-lib/generate-uuid";

import { ProductsList } from "./ProductsList";

const meta = {
  title: "modules/Products/ProductsList",
  component: ProductsList,
  decorators: [withRouter],
  parameters: { layout: "centered" },
} satisfies Meta<typeof ProductsList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    products: ProductFixture.createCollection([
      { id: generateUuid() },
      { id: generateUuid() },
      { id: generateUuid() },
    ]),
  },
};

export const WithoutProducts: Story = {
  args: { products: [] },
};
```

### Example — interaction flow with portaled combobox

```tsx
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, screen } from "storybook/test";

import { CheckoutForm } from "./CheckoutForm";

const meta = {
  title: "modules/Carts/CheckoutForm",
  component: CheckoutForm,
  parameters: { layout: "centered" },
  args: { onComplete: fn() },
} satisfies Meta<typeof CheckoutForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Purchasing: Story = {
  play: async ({ canvas, userEvent, step, args }) => {
    await step("Enter credentials", async () => {
      await userEvent.type(canvas.getByLabelText(/Full Name/i), "John Doe");
      await userEvent.type(
        canvas.getByLabelText(/Address/i),
        "NYC Groove Street"
      );
      await userEvent.click(canvas.getByRole("combobox"));
      await userEvent.click(
        await screen.findByRole("option", { name: "PayPal" })
      );
    });

    await expect(canvas.getByRole("combobox")).toHaveTextContent("PayPal");

    await step("Submit form", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Complete Order" })
      );
    });

    await expect(
      await canvas.findByText(/successfully purchased/i)
    ).toBeInTheDocument();
    await expect(args.onComplete).toHaveBeenCalledOnce();
  },
};
```

### Example — MSW-backed story with story-level override

```tsx
import { getProductsHandler } from "@/test-lib/handlers/get-products-handler";
import { errorResponse } from "@/test-lib/handlers/error-responses";

export const ServerError: Story = {
  parameters: {
    msw: {
      handlers: [getProductsHandler(() => errorResponse(500, "Server error"))],
    },
  },
  play: async ({ canvas }) => {
    await expect(await canvas.findByRole("alert")).toHaveTextContent(/failed/i);
  },
};
```

### References

- `rules/msw-handler.md` — handler factories, resolver overrides
- `rules/fixture.md` — deterministic data for `args`
- `rules/hook-test.md` — for hook edge cases that are awkward to reproduce through UI
- `rules/unit-test.md` — for pure-logic units (mappers, transformers, value objects)

---

# Rule: fixture

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
import type { Cart } from "@/features/carts/types/cart";
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

---

# Rule: hook-test

## Hook Test

Vitest test using `renderHook` for a custom hook that needs dedicated verification — edge cases, error paths, loading states, or hooks used across multiple components where scenarios would otherwise be duplicated.

### Constraints

- Co-located with source. `use-add-to-cart.ts` → `use-add-to-cart.test.tsx`.
- One `it` per observable scenario (success, auth-required, server-error). Scenarios are user-observable states, not code paths.
- Exercise the real hook end-to-end. **Do not mock** `lib/api/` exports, React Query, Zustand stores, or the mutation hooks being composed. MSW at the endpoint is the correct mock.
- Assert on the hook's public outputs: return value, store state the hook commits to, side-effect sinks it triggers. Do not assert on React Query internal cache, internal state, or intermediate values.
- Wrap state-mutating calls in `act`: `await act(async () => { await result.current.doThing(); })`. Missing `act` produces warning noise that masks real issues.
- **Always reset any Zustand store the hook touches in `afterEach`** — stores are module singletons and leak between tests.
- Use project-owned test wrappers from `test-lib/` (`TestQueryProvider`, `TestAuthProvider`, etc.) — they compose the minimum context the hook needs. For scenarios that need a different provider configuration, define a per-scenario wrapper in the test file.
- Use fixtures and `generateUuid()` for domain data. No inline literals when a fixture exists.
- **Do not use fake timers** by default — `@testing-library/react`'s `waitFor` polls on real timers, and `vi.useFakeTimers()` turns it into an infinite loop against React Query mutations. If debounce/throttle forces fake timers, scope them to a single `it` with `vi.useFakeTimers({ shouldAdvanceTime: true, advanceTimeDelta: 20 })`.

### MSW in hook tests

Install the baseline handler in `beforeEach` via `mswServer.use(handlerFactory())`. Override per scenario by calling `mswServer.use(handlerFactory(resolver))` inside the test — MSW prepends, so the later `use` wins for that scenario. See `rules/msw-handler.md` for the handler factory pattern.

### Canonical example

```tsx
import { act, renderHook } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { afterEach, beforeEach, expect, it } from "vitest";

import { initializeAuthStore } from "@/features/auth/application/auth-store";
import { USER_CART_ID } from "@/test-lib/fixtures/user-fixture";
import { generateUuid } from "@/test-lib/generate-uuid";
import { errorResponse } from "@/test-lib/handlers/error-responses";
import { putAddToCartHandler } from "@/test-lib/handlers/put-add-to-cart-handler";
import { mswServer } from "@/test-lib/msw-server";
import { TestAuthProvider } from "@/test-lib/TestAuthProvider";
import { TestQueryProvider } from "@/test-lib/TestQueryProvider";
import { spyOnToast } from "@/test-lib/toast-spy";

import { useAddToCart } from "./use-add-to-cart";
import { useProductAddedDialogStore } from "./use-product-added-dialog-store";

beforeEach(() => {
  mswServer.use(putAddToCartHandler());
});

afterEach(() => {
  useProductAddedDialogStore.setState({ isOpen: false, selectedItem: null });
});

const wrapper = ({ children }: PropsWithChildren) => (
  <TestQueryProvider>
    <TestAuthProvider>{children}</TestAuthProvider>
  </TestQueryProvider>
);

const unauthenticatedWrapper = ({ children }: PropsWithChildren) => {
  const store = initializeAuthStore({
    isAuthenticated: false,
    isError: false,
    state: "finished",
  });
  return (
    <TestQueryProvider>
      <TestAuthProvider store={store}>{children}</TestAuthProvider>
    </TestQueryProvider>
  );
};

it("opens the product added dialog and shows a success toast after adding to cart", async () => {
  const toastSpy = spyOnToast();
  const { result } = renderHook(() => useAddToCart(), { wrapper });

  await act(async () => {
    await result.current.addToCart(generateUuid());
  });

  expect(useProductAddedDialogStore.getState().isOpen).toBe(true);
  expect(useProductAddedDialogStore.getState().selectedItem).toBe(USER_CART_ID);
  expect(toastSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      type: "success",
      description: "A product has been successfully added to your cart.",
    })
  );
});

it("shows a warning toast and keeps the dialog closed when unauthenticated", async () => {
  const toastSpy = spyOnToast();
  const { result } = renderHook(() => useAddToCart(), {
    wrapper: unauthenticatedWrapper,
  });

  await act(async () => {
    await result.current.addToCart(generateUuid());
  });

  expect(useProductAddedDialogStore.getState().isOpen).toBe(false);
  expect(toastSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      type: "warning",
      description: "Please log in in order to add products.",
    })
  );
});

it("shows an error toast and keeps the dialog closed when the server returns Unknown product", async () => {
  mswServer.use(
    putAddToCartHandler(() => errorResponse(400, "Unknown product"))
  );
  const toastSpy = spyOnToast();
  const { result } = renderHook(() => useAddToCart(), { wrapper });

  await act(async () => {
    await result.current.addToCart(generateUuid());
  });

  expect(useProductAddedDialogStore.getState().isOpen).toBe(false);
  expect(toastSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      type: "error",
      description:
        "Product doesn't exist. It may be unavailable or removed from the store.",
    })
  );
});
```

### What this example gets right

- **Real code end-to-end**: the real hook, the real React Query mutation, the real auth store, the real dialog store run. Only the network (MSW) and the toast sink are faked.
- **Scenarios are user-observable**: success, auth-required, server-error. No assertion reads `queryClient.getQueryData(...)` or other internal state.
- **Wrappers compose**: `TestQueryProvider` wraps `TestAuthProvider`. The `unauthenticatedWrapper` overrides only the auth piece.
- **Store reset is explicit** in `afterEach`. Not relying on test ordering.
- **MSW override is inline** in the error-case test — `mswServer.use(...)` prepends, overriding the `beforeEach` baseline for that test only.

### References

- `rules/msw-handler.md` — handler factories and resolver overrides
- `rules/fixture.md` — deterministic data
- `rules/unit-test.md` — for pure-mechanics tests that do not need `renderHook`

---

# Rule: msw-handler

## MSW Handler

One request handler per API endpoint. Returns a sensible default response when invoked without arguments; accepts an optional resolver for per-test overrides (error responses, custom payloads, assertions on the request). Shared across unit tests, hook tests, and Storybook stories.

### Constraints

- One file per endpoint. Filename mirrors HTTP verb + resource + action: `put-add-to-cart-handler.ts`, `get-products-handler.ts`.
- Export a **single named factory function** — not multiple outcome-specific exports. Per-scenario variation is passed as a resolver at the call site.
- URL uses the shared `host` constant from `@/lib/http`. For endpoints with query params, use the shared `buildUrl` helper — never hand-concatenate.
- Default response body is the minimum valid shape. For collection endpoints, populate via fixtures with `generateUuid()` IDs — no inline literal arrays.
- Query params go in the resolver via `new URL(request.url).searchParams`, not in the path predicate — MSW silently strips query strings from the predicate.
- Inline `mswServer.use(http.get(URL, resolver))` is acceptable for one-off test-local overrides. The factory pattern is for endpoints touched by ≥ 2 test files or by Storybook.

### `onUnhandledRequest` asymmetry

- **Vitest**: `'error'` — unexpected network calls should fail tests.
- **Storybook**: `'bypass'` — stories legitimately load fonts, images, analytics.

This asymmetry lives in the MSW server setup (`test-lib/msw-server.ts` and `.storybook/preview.ts`), not in individual handler files.

### Factory — PUT endpoint

```ts
import { http, HttpResponse } from "msw";

import { host } from "@/lib/http";

import type { PutResolver } from "./resolvers";

export const putAddToCartHandler = (resolver?: PutResolver) =>
  http.put(`${host}/carts/:cartId`, (req) => {
    if (resolver) return resolver(req);

    return HttpResponse.json({});
  });
```

### Factory — GET with query params and fixtures

```ts
import { http, HttpResponse } from "msw";

import { buildUrl } from "@/lib/build-url";
import { host } from "@/lib/http";
import { ProductFixture } from "@/test-lib/fixtures/product-fixture";
import { generateUuid } from "@/test-lib/generate-uuid";

import type { GetResolver } from "./resolvers";

export const getProductsHandler = (resolver?: GetResolver) =>
  http.get(
    `${host}/${buildUrl("products", { limit: 10, sort: "asc" })}`,
    (req) => {
      if (resolver) return resolver(req);

      return HttpResponse.json({
        products: ProductFixture.createCollection([
          { id: generateUuid() },
          { id: generateUuid() },
        ]),
        meta: { limit: 10, sort: "asc", total: 2 },
      });
    }
  );
```

### Using handlers in consumers

**In a Vitest test** (unit or hook) — install a baseline in `beforeEach`; override per-test inline:

```ts
import { beforeEach } from "vitest";

import { errorResponse } from "@/test-lib/handlers/error-responses";
import { putAddToCartHandler } from "@/test-lib/handlers/put-add-to-cart-handler";
import { mswServer } from "@/test-lib/msw-server";

beforeEach(() => {
  mswServer.use(putAddToCartHandler());
});

it("handles server error", async () => {
  mswServer.use(
    putAddToCartHandler(() => errorResponse(400, "Unknown product"))
  );
  // ...
});
```

**In a Storybook story** — register handlers under `parameters.msw.handlers`. Story-level handlers **replace** meta-level handlers rather than merging:

```ts
const meta = {
  parameters: {
    msw: { handlers: [getProductsHandler(), putAddToCartHandler()] },
  },
} satisfies Meta<typeof Component>;

export const ServerError: Story = {
  parameters: {
    msw: {
      handlers: [
        getProductsHandler(() => errorResponse(500, "Boom")),
        putAddToCartHandler(), // re-declared to keep baseline
      ],
    },
  },
};
```

### Error simulation

```ts
HttpResponse.json({ message: "Boom" }, { status: 500 }); // 4xx/5xx with body
new HttpResponse(null, { status: 404 }); // empty-body error
HttpResponse.error(); // network error
await delay("infinite"); // hung request (loading state)
await delay(500); // realistic latency
```

### References

- `rules/fixture.md` — deterministic response payloads
- `rules/component-story-test.md` — handler usage in stories and the meta-vs-story replacement rule
- `rules/hook-test.md` — handler usage in `renderHook`-based tests

---

# Rule: unit-test

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
