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
