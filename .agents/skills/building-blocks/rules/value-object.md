---
title: Value Object
category: Data Modeling
layer: application/
composedWith: []
---

## Value Object

Classes with static methods encapsulating domain logic and correlated utilities for a single concept. Type guards, formatters, validators, parsers, domain operations — give functions a home instead of homeless exports. One class = one concept + all its operations.

### Constraints

- All methods are static — value objects are namespaces with type safety, not instances with state.
- Group by concept, not by operation type. `Price.format()`, `Price.isValid()`, `Price.fromCents()` — not a `formatters.ts` file with `formatPrice`, `formatDate`, `formatName`.
- Can be also defined for domain concepts, for e-commerce for instance `Product.getRating()`.

### Example

```tsx
export class Price {
  static format(amount: number, currency = "USD"): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  }

  static fromCents(cents: number): number {
    return cents / 100;
  }

  static isValid(amount: unknown): amount is number {
    return typeof amount === "number" && amount >= 0 && Number.isFinite(amount);
  }
}
```

```tsx
// Usage — all price-related logic in one place
Price.format(product.price); // "$29.99"
Price.fromCents(2999); // 29.99
Price.isValid(product.price); // true
```
