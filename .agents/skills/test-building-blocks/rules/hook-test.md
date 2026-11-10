## Hook Test

_Subject: a hook with a contract of its own · File: co-located `use-<name>.test.tsx`_

**Default to testing a hook through the component that uses it** (`component-story-test`). `renderHook` earns its place
when the hook has a contract of its own — several consumers, or a scenario impractical to stage through UI (an error
branch, an unauthenticated path). A hook holding one component's logic is covered by that component's stories.

### Constraints

- **Context comes from a test provider, never from a mock of the context hook.** Pass it as `{ wrapper }`. A different
  context per scenario is a different wrapper, which makes the context the test's explicit input and the negative case
  a one-line variation. Use `TestQueryProvider` and `TestAuthProvider` from `src/test-lib/`; never hand-roll
  `new QueryClient()`.
- **Mock only the app edge** — MSW for HTTP, `spyOnToast` for the toast sink. Not the `providers/` hooks, use-case hooks
  or stores this hook composes. An unavoidable mock carries a comment naming the missing seam.
- **Assert the hook's public outputs**: return value, the toast the user would see, store state the hook commits to.
  For a `providers/` query hook that means the **domain** shape, not the DTO — the mapping is what is under test.
- **Await anything asynchronous.** A query hook's first render is pending, so a synchronous assertion tests the
  loading state by accident. Use `await waitFor(() => expect(...))` for query results; wrap state-changing calls in
  `await act(async () => { ... })`.
- **Reset module-level state the hook touches** — Zustand stores, caches — in `afterEach`. Stores are module
  singletons and leak between tests.
- **Scenarios are user-observable states** (success, unauthenticated, server rejects), not code paths. The full error
  mapping matrix belongs to `api-test`; here cover the errors the hook treats differently.
- **No fake timers** by default — `waitFor` polls on real timers and fake ones loop forever against TanStack Query. If a
  debounce forces them, scope to one `it` with `vi.useFakeTimers({ shouldAdvanceTime: true })`.

### MSW in hook tests

Install the baseline handler in `beforeEach` via `mswServer.use(handlerFactory())`. Override per scenario with
`mswServer.use(handlerFactory(resolver))` inside the test — MSW prepends, so the later `use` wins. Handlers reset after
each test (`test-setup-unit.ts`).

### Example — use-case hook

```tsx
import { act, renderHook } from "@testing-library/react";
import type { PropsWithChildren } from "react";

import { initializeAuthStore } from "@/features/auth/application/auth-store";
import { generateUuid } from "@/test-lib/generate-uuid";
import { errorResponse } from "@/test-lib/handlers/error-responses";
import { putAddToCartHandler } from "@/test-lib/handlers/put-add-to-cart-handler";
import { mswServer } from "@/test-lib/msw-server";
import { TestAuthProvider } from "@/test-lib/TestAuthProvider";
import { TestQueryProvider } from "@/test-lib/TestQueryProvider";
import { spyOnToast } from "@/test-lib/toast-spy";

import { useAddToCart } from "./use-add-to-cart";

const wrapper = ({ children }: PropsWithChildren) => (
  <TestQueryProvider>
    <TestAuthProvider>{children}</TestAuthProvider>
  </TestQueryProvider>
);

const unauthenticatedWrapper = ({ children }: PropsWithChildren) => (
  <TestQueryProvider>
    <TestAuthProvider
      store={initializeAuthStore({
        isAuthenticated: false,
        isError: false,
        state: "finished",
      })}
    >
      {children}
    </TestAuthProvider>
  </TestQueryProvider>
);

describe("useAddToCart", () => {
  beforeEach(() => {
    mswServer.use(putAddToCartHandler());
  });

  afterEach(() => vi.restoreAllMocks());

  it("adds the product and shows a success toast", async () => {
    const toastSpy = spyOnToast();
    const { result } = renderHook(() => useAddToCart(), { wrapper });

    let added: boolean | undefined;
    await act(async () => {
      added = await result.current.addToCart(generateUuid());
    });

    expect(added).toBe(true);
    expect(toastSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "success",
        description: "A product has been successfully added to your cart.",
      })
    );
  });

  it("asks the user to log in when unauthenticated", async () => {
    const toastSpy = spyOnToast();
    const { result } = renderHook(() => useAddToCart(), {
      wrapper: unauthenticatedWrapper,
    });

    await act(async () => {
      await result.current.addToCart(generateUuid());
    });

    expect(toastSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "warning",
        description: "Please log in in order to add products.",
      })
    );
  });

  it("explains that the product does not exist when the server rejects it", async () => {
    mswServer.use(
      putAddToCartHandler(() => errorResponse(400, "Unknown product"))
    );
    const toastSpy = spyOnToast();
    const { result } = renderHook(() => useAddToCart(), { wrapper });

    await act(async () => {
      await result.current.addToCart(generateUuid());
    });

    expect(toastSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "error",
        description:
          "Product doesn't exist. It may be unavailable or removed from the store.",
      })
    );
  });
});
```

What it gets right: the real use-case hook, mutation hook, `lib/api/` factory, TanStack Query and auth store all run;
only the network (MSW) and the toast sink are faked. The unauthenticated case differs by one wrapper.

### Example — `providers/` query hook

Assert the domain shape the hook returns, awaited (handler and constants illustrative):

```tsx
it("exposes the cart products as domain models", async () => {
  mswServer.use(getCartProductsHandler());
  const { result } = renderHook(() => useCartProductsQuery(USER_CART_ID), {
    wrapper: TestQueryProvider,
  });

  await waitFor(() =>
    expect(result.current.data).toEqual(EXPECTED_CART_PRODUCTS)
  );
});
```

### Anti-patterns

❌ Mocking a context or store hook because there is no provider above it — the rule under test becomes the mock:

```ts
vi.mock("@/features/auth/application/auth-store", () => ({
  useAuthStore: () => ({ isAuthenticated: true }), // ❌ use TestAuthProvider with a store
}));
```

❌ Mocking the query layer or the subject:

```ts
vi.mock("@tanstack/react-query"); // ❌ removes the thing under test
vi.mock("@/features/carts/providers/use-add-to-cart-mutation"); // ❌ use MSW
```

❌ Asserting synchronously on a query hook's first render — passes only because `data` is still `undefined`.

❌ Calling a state-changing return value outside `act`, then chasing the warning with a `waitFor`.

❌ Hand-rolling providers: `new QueryClient()`, a bare `<QueryClientProvider>`. Use `src/test-lib/`.

❌ Asserting internals: `queryClient.getQueryData(...)`, query keys, render counts, "the mutation was called".

### References

- `rules/msw-handler.md` — handler factories and resolver overrides
- `rules/api-test.md` — the full error mapping matrix of the factory beneath
- `rules/component-story-test.md` — the default place to cover a hook
- `rules/fixture.md` — deterministic data
