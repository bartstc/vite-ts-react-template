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
- For domain computations, the value object belongs to the feature that owns the result. Cart total → `Cart.calculateTotal(items)`, not a loose `calculateCartTotal` utility.

### Example

```tsx
// src/lib/format
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
// Domain computation spanning multiple objects — belongs to the concept that owns the result
// src/features/carts/application
export class Cart {
  private static readonly DISCOUNT_THRESHOLD = 100;
  private static readonly DISCOUNT_PERCENT = 10;

  static calculateTotal(items: CartItem[]): number {
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    return Cart.isEligibleForDiscount(subtotal)
      ? subtotal * (1 - Cart.DISCOUNT_PERCENT / 100)
      : subtotal;
  }

  private static isEligibleForDiscount(subtotal: number): boolean {
    return subtotal >= Cart.DISCOUNT_THRESHOLD;
  }
}
```

```tsx
// Usage — all price-related logic in one place
Price.format(product.price); // "$29.99"
Price.fromCents(2999); // 29.99
Price.isValid(product.price); // true

// Usage - use Value Object rather than loose utilities
Cart.calculateTotal(products);
```
