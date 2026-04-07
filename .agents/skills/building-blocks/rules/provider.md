---
title: Provider
category: State Management
layer: providers/
composedWith: store
---

## Provider

React Context providers acting as dependency injection for the component tree. Deliver feature-level state — cart contents, current workspace, active filters — without prop drilling. Keep providers thin: they deliver state, they don't manage it. State logic belongs in the store or machine; the provider just makes it available.

### Constraints

- Two files per provider: one for the context (with `createContext` + the consumer hook), one for the provider component (accepts `PropsWithChildren`). Separating them keeps the dependency graph clean — consumers import the hook, not the provider.
- Never put business logic in providers. If a provider has `useEffect`, `useReducer`, or complex derivations, the logic needs to move into a dedicated store or hook that the provider merely wraps.
- Default context value: use `null` and throw in the consumer hook. This catches missing providers at runtime instead of silently returning garbage.

### Example

```tsx
// cart-context.ts — context + consumer hook
import { createContext, useContext } from "react";

interface CartContextValue {
  cartId: string;
  items: CartItem[];
}

const CartContext = createContext<CartContextValue | null>(null);

export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

export { CartContext };
```

```tsx
// CartProvider.tsx — thin wrapper, no logic
import { type PropsWithChildren } from "react";
import { CartContext } from "./cart-context";
import { useCartStore } from "./use-cart-store"; // state lives here

export const CartProvider = ({ children }: PropsWithChildren) => {
  const { cartId, items } = useCartStore();

  return (
    <CartContext.Provider value={{ cartId, items }}>
      {children}
    </CartContext.Provider>
  );
};
```

```tsx
// Usage — components import the hook, never the provider or context directly
const CartSummary = () => {
  const { items } = useCart();
  return <span>{items.length} items in cart</span>;
};
```
