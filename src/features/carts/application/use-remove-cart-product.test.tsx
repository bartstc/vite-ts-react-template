import { act, renderHook } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";

import { initializeAuthStore } from "@/features/auth/application/auth-store";
import { generateUuid } from "@/test-lib/generate-uuid";
import { deleteRemoveCartProductHandler } from "@/test-lib/handlers/delete-remove-cart-product-handler";
import { errorResponse } from "@/test-lib/handlers/error-responses";
import { mswServer } from "@/test-lib/msw-server";
import { TestAuthProvider } from "@/test-lib/TestAuthProvider";
import { TestQueryProvider } from "@/test-lib/TestQueryProvider";
import { spyOnToast } from "@/test-lib/toast-spy";

import { useRemoveCartProduct } from "./use-remove-cart-product";

beforeEach(() => {
  mswServer.use(deleteRemoveCartProductHandler());
});

afterEach(() => {
  vi.restoreAllMocks();
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

it("shows a success toast after removing one unit from the cart", async () => {
  const toastSpy = spyOnToast();
  const { result } = renderHook(() => useRemoveCartProduct(), { wrapper });

  await act(async () => {
    await result.current.removeOneFromCart(generateUuid());
  });

  expect(toastSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      type: "success",
      description: "Product removed.",
    })
  );
});

it("shows a success toast after removing all units of a product", async () => {
  const toastSpy = spyOnToast();
  const { result } = renderHook(() => useRemoveCartProduct(), { wrapper });

  await act(async () => {
    await result.current.removeAllFromCart(generateUuid(), 3);
  });

  expect(toastSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      type: "success",
      description: "Product removed from your cart.",
    })
  );
});

it("shows a product-not-found error toast when the server returns 'Product not found in cart'", async () => {
  mswServer.use(
    deleteRemoveCartProductHandler(() =>
      errorResponse(404, "Product not found in cart")
    )
  );
  const toastSpy = spyOnToast();
  const { result } = renderHook(() => useRemoveCartProduct(), { wrapper });

  await act(async () => {
    await result.current.removeOneFromCart(generateUuid());
  });

  expect(toastSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      type: "error",
      description:
        "Product not found in your cart. It may have already been removed.",
    })
  );
});

it("shows a generic error toast when an unexpected server error occurs", async () => {
  mswServer.use(
    deleteRemoveCartProductHandler(() =>
      errorResponse(500, "Internal server error")
    )
  );
  const toastSpy = spyOnToast();
  const { result } = renderHook(() => useRemoveCartProduct(), { wrapper });

  await act(async () => {
    await result.current.removeOneFromCart(generateUuid());
  });

  expect(toastSpy).toHaveBeenCalledWith(
    expect.objectContaining({
      type: "error",
      description: "Something went wrong. Please try again or contact us.",
    })
  );
});

it("returns false and shows no toast when the user is not authenticated", async () => {
  const toastSpy = spyOnToast();
  const { result } = renderHook(() => useRemoveCartProduct(), {
    wrapper: unauthenticatedWrapper,
  });

  let returnValue: boolean | undefined;
  await act(async () => {
    returnValue = await result.current.removeOneFromCart(generateUuid());
  });

  expect(returnValue).toBe(false);
  expect(toastSpy).not.toHaveBeenCalled();
});
