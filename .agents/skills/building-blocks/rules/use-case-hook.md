---
title: Use Case Hook
category: App Orchestration
layer: application/
composedWith: mutation-hook, notification-hook, store
---

## Use Case Hook

Orchestration hook that composes a `mutation-hook` and a `notification-hook` into a single feature-level operation. Returns a `[execute, isPending]` tuple so the component calls one function and handles only UI concerns.

### Constraints

- One use case hook per user-facing operation, not per mutation. If "add to cart" requires a mutation + toast + dialog, that's one use case hook.
- Error routing (which error → which notification) belongs here, not in the component. The component just calls `execute()`.
- Keep it thin — orchestration only, no business logic. If you're adding conditionals beyond error routing, the logic probably belongs in a service or the mutation itself.
- The use case hook is the feature's public API — components import `useAddToCart`, never the underlying mutation hook directly.

### Example

```tsx
import {
  useAddToCartMutation,
  UnknownProductError,
  ProductNotAvailableError,
} from "@/lib/api/carts/use-add-to-cart"; // mutation-hook
import { useAddToCartNotifications } from "./use-add-to-cart-notifications"; // notification-hook

interface UseAddToCartParams {
  cartId: number;
}

export const useAddToCart = ({ cartId }: UseAddToCartParams) => {
  const [add, isPending] = useAddToCartMutation();
  const notifications = useAddToCartNotifications();

  const execute = async (payload: { productId: number; quantity?: number }) => {
    try {
      await add(cartId, payload);
      notifications.notifySuccess();
    } catch (e) {
      if (e instanceof UnknownProductError) {
        notifications.notifyUnknownProduct();
        return;
      }
      if (e instanceof ProductNotAvailableError) {
        notifications.notifyProductNotAvailable();
        return;
      }
      notifications.notifyFailure();
    }
  };

  return [execute, isPending] as const;
};
```

```tsx
// Component usage
const [addToCart, isLoading] = useAddToCart({ cartId });

const onAdd = async () => {
  await addToCart({ productId, quantity: 1 });
};
```
