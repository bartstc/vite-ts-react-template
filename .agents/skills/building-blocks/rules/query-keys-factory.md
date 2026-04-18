---
title: Query Keys Factory
category: Data Fetching
layer: lib/api/
composedWith: query-options-factory
---

## Query Keys Factory

Hierarchical, co-located key factories enabling precise cache invalidation and query management. One factory per resource, each key level narrows scope: `all` → `lists` → `list(params)` → `details` → `detail(id)` → nested sub-resources. (TkDodo: Effective React Query Keys)

### Constraints

- Keys are `as const` tuples — TypeScript enforces structure, no stringly-typed accidents.
- Each level spreads from its parent, so invalidating `cartQueryKeys.all` wipes every cart-related query, while `cartQueryKeys.detail(id)` targets one.
- Mutation hooks import these for `onSuccess` invalidation — the factory is the single source of truth for what "cart queries" means.
- Sub-resources nest under their parent: `detail(cartId) → products(cartId)`. Invalidating a detail also catches its children.

### Example

```tsx
import type { QueryParams } from "@/types/query-params";

export const productsQueryKeys = {
  all: ["products"] as const,
  lists: () => [...productsQueryKeys.all, "list"] as const,
  list: (params: QueryParams) =>
    [...productsQueryKeys.lists(), params] as const,
  details: () => [...productsQueryKeys.all, "detail"] as const,
  detail: (productId: string) =>
    [...productsQueryKeys.details(), productId] as const,
};
```
