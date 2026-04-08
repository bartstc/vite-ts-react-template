---
title: Use Case Hook
category: App Orchestration
layer: application/
composedWith: mutation-hook, notification-hook, store
---

## Use Case Hook

Orchestration hook that composes a `mutation-hook` and a `notification-hook` into a single feature-level operation. Returns `{ <domainAction>, isPending }` so the component calls one function and handles only UI concerns.

### Constraints

- One use case hook per user-facing operation, not per mutation. If "add to cart" requires a mutation + toast + dialog, that's one use case hook.
- Error routing (which error → which notification) belongs here, not in the component. The component just calls the action.
- Keep it thin — orchestration only, no business logic. If you're adding conditionals beyond error routing, the logic probably belongs in a service or the mutation itself.
- The use case hook is the feature's public API — components import `useAddToCart`, never the underlying mutation hook directly.
- **Name the returned action after the domain operation** — derive it from the hook name (drop `use`, camelCase). E.g. `useAddToCart` → `addToCart`.

### Example

```tsx
import {
  useAddToCartMutation,
  UnknownProductError,
  ProductNotAvailableError,
} from "@/features/carts/providers/use-add-to-cart-mutation"; // mutation-hook re-export
import { useAddToCartNotifications } from "./use-add-to-cart-notifications"; // notification-hook

export const useAddToCart = () => {
  const [mutateAsync, isPending] = useAddToCartMutation();
  const {
    notifySuccess,
    notifyFailure,
    notifyUnknownProduct,
    notifyProductNotAvailable,
  } = useAddToCartNotifications();

  const addToCart = async (payload: {
    productId: number;
    quantity?: number;
  }) => {
    try {
      await mutateAsync(payload);
      notifySuccess();
    } catch (e) {
      if (e instanceof UnknownProductError) {
        notifyUnknownProduct();
        return;
      }
      if (e instanceof ProductNotAvailableError) {
        notifyProductNotAvailable();
        return;
      }
      notifyFailure();
    }
  };

  return { addToCart, isPending };
};
```

```tsx
// Component usage
const { addToCart, isPending } = useAddToCart();

<Button
  loading={isPending}
  onClick={() => addToCart({ productId, quantity: 1 })}
>
  Add to cart
</Button>;
```
