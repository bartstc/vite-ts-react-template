---
title: Mutation Hook
category: Data Fetching
layer: providers/
composedWith: use-case-hook, notification-hook, query-keys-factory
---

## Mutation Hook

Server write operations wrapped in `useMutation` with domain error translation and cache invalidation via `query-keys-factory`. Returns a `[handler, isPending]` tuple: the handler encapsulates the async call + error mapping.

### Constraints

- Error classes are co-located with the hook — they're reusable across feature slices, so they live with the mutation definition.
- Keep the handler's error mapping exhaustive: catch API errors, translate to typed domain errors, fall back to `UnknownError`. Components should never see raw HTTP errors.
- Invalidation belongs here — the mutation knows what resource it wrote to, so it owns cache coherence via `query-keys-factory`.

### Example

```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpService } from "@/lib/http"; // project HTTP client
import { Logger } from "@/lib/logger";
import { UnknownError } from "@/lib/types/unknown-error";
import { cartQueryKeys } from "@/lib/api/carts/cart-query-keys"; // query-keys-factory

interface AddToCartPayload {
  productId: number;
  quantity?: number;
}

interface AddToCartDto {
  cartId: number;
  payload: AddToCartPayload;
}

export const useAddToCartMutation = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation<void, unknown, AddToCartDto>({
    mutationFn: (body) =>
      httpService.put<void, AddToCartPayload>(`carts/${body.cartId}`, {
        productId: body.payload.productId,
        quantity: body.payload.quantity,
      }),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: cartQueryKeys.detail(variables.cartId),
      });
    },
  });

  const handler = async (cartId: number, payload: AddToCartPayload) => {
    try {
      return await mutateAsync({ cartId, payload });
    } catch (e) {
      Logger.error("Failed to add item to cart", e as Error);

      if (httpService.isError(e) && e.message === "Unknown product") {
        throw new UnknownProductError();
      }
      if (httpService.isError(e) && e.message === "Product not available") {
        throw new ProductNotAvailableError();
      }

      throw new UnknownError();
    }
  };

  return [handler, isPending] as const;
};

export class UnknownProductError extends Error {
  constructor() {
    super("Unknown product");
    this.name = "UnknownProductError";
  }
}

export class ProductNotAvailableError extends Error {
  constructor() {
    super("Product not available");
    this.name = "ProductNotAvailableError";
  }
}
```
