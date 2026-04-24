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
