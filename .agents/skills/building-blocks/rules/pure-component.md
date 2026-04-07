---
title: Pure Component
category: Component Patterns
layer: components/
composedWith: facade-hook, compound-component
---

## Pure Component

Props in, JSX out. No side effects, no internal state, no hooks beyond maybe `useMemo` for derived values. Maximally testable, maximally reusable — the default component type until you need something more.

### Constraints

- If it has complex `useState`s or/and `useEffect`s, extract it into a `facade-hook` and keep the component pure. The component becomes a function of props — easy to test and reason about.
- Can subscribe to contexts via `useContext` when needed. Reading theme, locale, or feature flags doesn't break purity as long as the component remains a deterministic function of its inputs (props + context).
- Pure doesn't mean simple. A pure component can have complex rendering logic — conditionals, loops, computed styles — as long as it's all derived from props with no external dependencies beyond context.

### Example

```tsx
interface Props {
  name: string;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
  onAddToCart: () => void;
}

export const ProductCard = ({
  name,
  price,
  imageUrl,
  isAvailable,
  onAddToCart,
}: Props) => (
  <div className="product-card">
    <img src={imageUrl} alt={name} />
    <h3>{name}</h3>
    <span>{formatCurrency(price)}</span>
    <button onClick={onAddToCart} disabled={!isAvailable}>
      {isAvailable ? "Add to Cart" : "Out of Stock"}
    </button>
  </div>
);
```
