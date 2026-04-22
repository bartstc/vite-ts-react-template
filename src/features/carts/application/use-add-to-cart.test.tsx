import { act, renderHook } from "@testing-library/react";
import { setupServer } from "msw/node";
import type { PropsWithChildren } from "react";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  expect,
  it,
  vi,
} from "vitest";

import {
  Provider,
  initializeAuthStore,
} from "@/features/auth/application/auth-store";
import {
  ProductNotAvailableError,
  UnknownProductError,
} from "@/features/carts/providers/use-add-to-cart-mutation";
import { USER_CART_ID } from "@/test-lib/fixtures/user-fixture";
import { generateUuid } from "@/test-lib/generate-uuid";
import { putAddToCartHandler } from "@/test-lib/handlers/put-add-to-cart-handler";
import { TestAuthProvider } from "@/test-lib/TestAuthProvider";
import { TestQueryProvider } from "@/test-lib/TestQueryProvider";
import { spyOnToast } from "@/test-lib/toast-spy";

import { useAddToCart } from "./use-add-to-cart";
import { useProductAddedDialogStore } from "./use-product-added-dialog-store";

interface AddToCartMutationModule {
  UnknownProductError: new () => Error;
  ProductNotAvailableError: new () => Error;
  addToCartMutationOptions: object;
}

const { mockMutationFn } = vi.hoisted(() => ({
  mockMutationFn: vi.fn(),
}));

vi.mock(
  "@/lib/api/carts/{cart-id}/add-to-cart-mutation",
  async (importOriginal) => {
    const { UnknownProductError, ProductNotAvailableError } =
      await importOriginal<AddToCartMutationModule>();
    return {
      UnknownProductError,
      ProductNotAvailableError,
      addToCartMutationOptions: { mutationFn: mockMutationFn },
    };
  }
);

const server = setupServer(putAddToCartHandler());

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

beforeEach(() => {
  mockMutationFn.mockResolvedValue(undefined);
});

afterEach(() => {
  useProductAddedDialogStore.setState({ isOpen: false, selectedItem: null });
  vi.restoreAllMocks();
});

const wrapper = ({ children }: PropsWithChildren) => (
  <TestQueryProvider>
    <TestAuthProvider>{children}</TestAuthProvider>
  </TestQueryProvider>
);

const unauthenticatedWrapper = ({ children }: PropsWithChildren) => {
  const unauthenticatedStore = initializeAuthStore({
    isAuthenticated: false,
    isError: false,
    state: "finished",
  });

  return (
    <TestQueryProvider>
      <Provider value={unauthenticatedStore}>{children}</Provider>
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

it("shows an error toast and keeps the dialog closed on UnknownProductError", async () => {
  mockMutationFn.mockRejectedValueOnce(new UnknownProductError());
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

it("shows an error toast and keeps the dialog closed on ProductNotAvailableError", async () => {
  mockMutationFn.mockRejectedValueOnce(new ProductNotAvailableError());
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
        "Product is not available. It may be out of stock or removed from the store.",
    })
  );
});
