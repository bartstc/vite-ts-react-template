---
title: Facade Hook
category: Component Patterns
layer: components/
composedWith: pure-component, compound-component
---

## Facade Hook

Encapsulates logic a component needs so the component body stays pure — focused entirely on rendering JSX. Defined below the component in the same file. Think of it as the component's private method: not exported, not reused, exists solely to keep the render function clean.

### Constraints

- One facade hook per component. If you need two, the component probably has two responsibilities.
- The hook returns exactly what the component's JSX needs — pre-shaped data, handlers, derived values. The component never transforms what the hook returns.
- Facade hooks are for logic extraction, not data fetching orchestration. Loading states, queries, and mutations stay in the component or page. The facade hook handles formatting, derivations, and non-trivial transformations.
- Don't confuse with shared hooks. A facade hook is private to its component. If multiple components need the same logic, that's a shared hook or `use-case-hook`, not a facade.

### Example

```tsx
interface Props {
  product: Product;
  locale: string;
}

// Component stays focused on rendering
export const ProductHeader = ({ product }: Props) => {
  const { displayTitle, priceLabel, badge } = useFormattedProduct(product);

  return (
    <div className="product-header">
      <h1>{displayTitle}</h1>
      {badge && <span className="badge">{badge}</span>}
      <span className="price">{priceLabel}</span>
    </div>
  );
};

// Facade hook — private, not exported, defined below the component
const useFormattedProduct = (product: Product) => {
  const displayTitle = useMemo(() => {
    const base = product.name.trim();
    const variant = product.variant ? ` — ${product.variant}` : "";
    const limited = product.isLimitedEdition ? " (Limited Edition)" : "";
    return `${base}${variant}${limited}`;
  }, [product.name, product.variant, product.isLimitedEdition]);

  const priceLabel = useMemo(() => {
    const formatter = new MoneyVO.format({
      style: "currency",
      currency: product.currency,
    });
    return product.discountPrice
      ? `${formatter.format(product.discountPrice)} (was ${formatter.format(product.price)})`
      : formatter.format(product.price);
  }, [product.price, product.discountPrice, product.currency]);

  const badge = useMemo(() => {
    if (product.stock === 0) return "Out of Stock";
    if (product.stock <= 3) return `Only ${product.stock} left`;
    if (product.isNew) return "New";
    return null;
  }, [product.stock, product.isNew]);

  return { displayTitle, priceLabel, badge };
};
```
