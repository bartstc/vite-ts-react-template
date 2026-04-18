---
title: Mutation Options Factory
category: Data Fetching
layer: lib/api/
composedWith: mutation-hook
---

## Mutation Options Factory

Reusable `mutationOptions()` factory for a single API write operation. Contains `mutationFn` with domain error translation and logging.

### Constraints

- NEVER use `use` prefix — these are factories, not hooks. Name: `xxxMutationOptions`. File: `xxx-mutation.ts`
- One factory per API endpoint. Co-locate with related query options in the same resource directory
- Co-locate error classes with the factory. Map API errors exhaustively in `mutationFn` — translate, log, fall back to `UnknownError`

### Example

```tsx
// src/lib/api/carts/add-to-cart/add-to-cart-mutation.ts
import { mutationOptions } from "@tanstack/react-query";
import { httpService } from "@/lib/http";
import { Logger } from "@/lib/logger";
import { UnknownError } from "@/lib/types/unknown-error";

interface AddToCartPayload {
  productId: number;
  quantity?: number;
}

interface AddToCartDto {
  cartId: number;
  payload: AddToCartPayload;
}

export const addToCartMutationOptions = mutationOptions({
  mutationFn: async (body: AddToCartDto): Promise<void> => {
    try {
      await httpService.put<void, AddToCartPayload>(
        `carts/${body.cartId}`,
        body.payload
      );
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
  },
});

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

```tsx
// ❌ Wrong — invalidation in factory
export const addToCartMutationOptions = mutationOptions({
  mutationFn: async (body: AddToCartDto): Promise<void> => {
    await httpService.put(`carts/${body.cartId}`, body.payload);
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: cartQueryKeys.all });
  },
});
```

### References

- `@src/lib/api/` — resource-organized API directory
- `rules/mutation-hook.md` — composing hook pattern in `providers/`
