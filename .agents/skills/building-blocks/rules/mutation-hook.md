---
title: Mutation Hook
category: Data Fetching
layer: providers/
composedWith: mutation-options-factory, query-keys-factory
---

## Mutation Hook

Server write hook composed from `mutation-options-factory`. Spreads the factory options and adds e.g. cache invalidation or custom error handling. Returns a `[handler, isPending]` tuple. Lives in `providers/` — the data access gateway for the feature slice.

### Constraints

- ALWAYS use `use` prefix — `useXxxMutation`, never `xxxMutation`. File: `use-xxx-mutation.ts`
- Compose from a `mutation-options-factory` via spread — do not inline `mutationFn` or error translation here
- Invalidation belongs here — the hook knows what queries to invalidate via `query-keys-factory`
- When the consumer needs to extend `onSuccess` (e.g., close a modal after mutation), spread and chain the factory's callbacks

### Example

```tsx
// src/features/carts/providers/use-add-to-cart-mutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addToCartMutationOptions } from "@/lib/api/carts/add-to-cart/add-to-cart-mutation";
import { cartQueryKeys } from "@/lib/api/carts/cart-query-keys";

export const useAddToCartMutation = (cartId: number) => {
  const queryClient = useQueryClient();

  const { mutateAsync, isPending } = useMutation({
    ...addToCartMutationOptions,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: cartQueryKeys.detail(cartId),
      });
    },
  });

  const handler = async (payload: AddToCartPayload) => {
    return mutateAsync({ cartId, payload });
  };

  return [handler, isPending] as const;
};
```

### References

- `rules/mutation-options-factory.md` — raw factory pattern in `lib/api/`
- `rules/query-keys-factory.md` — cache key structure for invalidation
