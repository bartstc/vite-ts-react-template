import { renderHook } from "@testing-library/react";
// eslint-disable-next-line no-restricted-imports
import * as reactRouter from "react-router";
import { describe, expect, it, vi, beforeEach, expectTypeOf } from "vitest";

import { useNavigate, type PathParams } from "@/lib/router";
import { routes } from "@/lib/router/routes";
import { generateUuid } from "@/test-lib/generate-uuid";

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-return
  return { ...(actual as any), useNavigate: vi.fn() };
});

describe("useNavigate", () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(reactRouter.useNavigate).mockReturnValue(mockNavigate);
  });

  it("replaces path parameters with provided values", async () => {
    const { result } = renderHook(() => useNavigate());
    const navigate = result.current;

    const reviewId = generateUuid();
    const productId = generateUuid();

    await navigate({
      path: routes.product.children.productReviews.children.reviewDetails,
      params: { reviewId, productId },
    });

    expect(mockNavigate).toHaveBeenCalledWith(
      {
        pathname: `/products/${productId}/reviews/${reviewId}`,
        search: undefined,
      },
      undefined
    );
  });

  it("handles optional parameters correctly", async () => {
    const { result } = renderHook(() => useNavigate());
    const navigate = result.current;

    const productId = generateUuid();

    await navigate({
      path: routes.product.children.productReviews.children.reviewDetails,
      params: { reviewId: undefined, productId },
    });

    expect(mockNavigate).toHaveBeenCalledWith(
      {
        pathname: `/products/${productId}/reviews/undefined`,
        search: undefined,
      },
      undefined
    );
  });

  it("appends search string to the path", async () => {
    const { result } = renderHook(() => useNavigate());
    const navigate = result.current;

    const productId = generateUuid();
    const filterValue = "active";

    await navigate({
      path: routes.product.path,
      params: { productId },
      search: `?filter=${filterValue}`,
    });

    expect(mockNavigate).toHaveBeenCalledWith(
      { pathname: `/products/${productId}`, search: `?filter=${filterValue}` },
      undefined
    );
  });

  it("passes navigation options to the underlying navigate function", async () => {
    const { result } = renderHook(() => useNavigate());
    const navigate = result.current;

    const productId = generateUuid();
    const previousPath = "/previous";
    const options = { replace: true, state: { from: previousPath } };

    await navigate(
      { path: routes.product.path, params: { productId } },
      options
    );

    expect(mockNavigate).toHaveBeenCalledWith(
      { pathname: `/products/${productId}`, search: undefined },
      options
    );
  });

  it("supports string paths for relative navigation", async () => {
    const { result } = renderHook(() => useNavigate());
    const navigate = result.current;

    const relativePath = "../productReviews";
    await navigate(relativePath);

    expect(mockNavigate).toHaveBeenCalledWith(relativePath, undefined);
  });
});

describe("PathParams", () => {
  it("should correctly infer parameter types from route paths", () => {
    type SimplePathParams =
      PathParams<"/products/:productId/reviews/:reviewId">;

    expectTypeOf<SimplePathParams>().toEqualTypeOf<{
      productId: string | undefined;
      reviewId: string | undefined;
    }>();
  });
});
