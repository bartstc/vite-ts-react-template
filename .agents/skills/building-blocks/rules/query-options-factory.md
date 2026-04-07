---
title: Query Options Factory
category: Data Fetching
layer: lib/api/
composedWith: query-keys-factory, dto-model
---

## Query Options Factory

Reusable, composable query configuration objects via `queryOptions()`. Export a factory function — not a custom hook — so consumers can spread and override options without losing type safety.

### Constraints

- Avoid wrapping `queryOptions` in custom hooks that swallow options — the factory **is** the abstraction. Hook composition belongs in `providers/`.
- Co-located with its `dto-model` and `query-keys-factory` for the same resource.
- The factory wires together the query key (from `query-keys-factory`) and the fetch function — consumers never assemble these manually.

### Example

```tsx
import { queryOptions } from "@tanstack/react-query";
import { httpService } from "@/lib/http"; // project HTTP client
import { productsQueryKeys } from "../products-query-keys"; // query-keys-factory
import type { ProductDto } from "./product-dto"; // dto-model

export const productQuery = (productId: string) =>
  queryOptions({
    queryKey: productsQueryKeys.detail(productId),
    queryFn: (): Promise<ProductDto> =>
      httpService.get<ProductDto>(`products/${productId}`),
  });
```

```tsx
// providers/ — hook composition wraps the factory, this is the only place useQuery is called
import { useQuery } from "@tanstack/react-query";
import { productQuery } from "@/lib/api/products/product-query";

export const useProductQuery = (productId: string) =>
  useQuery(productQuery(productId));
```
