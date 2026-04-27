import { act, renderHook } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { beforeEach, expect, it } from "vitest";

import { initializeAuthStore } from "@/features/auth/application/auth-store";
import { generateUuid } from "@/test-lib/generate-uuid";
import { errorResponse } from "@/test-lib/handlers/error-responses";
import { putAddToCartHandler } from "@/test-lib/handlers/put-add-to-cart-handler";
import { mswServer } from "@/test-lib/msw-server";
import { TestAuthProvider } from "@/test-lib/TestAuthProvider";
import { TestQueryProvider } from "@/test-lib/TestQueryProvider";
import { spyOnToast } from "@/test-lib/toast-spy";

import { useAddToCart } from "./use-add-to-cart";

beforeEach(() => {
  mswServer.use(putAddToCartHandler());
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

  expect(toastSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      type: "error",
      description:
        "Product doesn't exist. It may be unavailable or removed from the store.",
    })
  );
});
