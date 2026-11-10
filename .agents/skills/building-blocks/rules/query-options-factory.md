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
- Name: `xxxQuery`. File: `xxx-query.ts`. Hook composition (`useXxxQuery`) belongs in `providers/`.
- When the query is used in a route loader, co-locate `xxxLoader` function in the same file.
- Map the failures the UI reacts to (e.g. 404) to domain error classes in `queryFn` and log them. Rethrow anything unmapped unchanged, so generic error handling still sees it.

### Example

```tsx
import { queryOptions } from "@tanstack/react-query";
import { httpService } from "@/lib/http"; // project HTTP client
import { AjaxError } from "@/lib/http/ajax-error";
import { Logger } from "@/lib/logger";
import { productsQueryKeys } from "../products-query-keys"; // query-keys-factory
import type { ProductDto } from "./product-dto"; // dto-model

export const productQuery = (productId: string) =>
  queryOptions({
    queryKey: productsQueryKeys.detail(productId),
    queryFn: async (): Promise<ProductDto> => {
      try {
        return await httpService.get<ProductDto>(`products/${productId}`);
      } catch (e) {
        Logger.error("Failed to fetch product", e as Error);
        if (e instanceof AjaxError && e.status === 404) {
          throw new ProductNotFoundError(productId);
        }
        throw e; // unmapped — rethrow unchanged
      }
    },
  });

export class ProductNotFoundError extends Error {
  constructor(readonly productId: string) {
    super("Product not found");
    this.name = "ProductNotFoundError";
  }
}

// only when needed by page
export const productLoader = async (productId: string) =>
  queryClient.ensureQueryData(productQuery(productId));
```

```tsx
// providers/ — hook composition wraps the factory, this is the only place useQuery is called
import { useQuery } from "@tanstack/react-query";
import { productQuery } from "@/lib/api/products/product-query";

export const useProductQuery = (productId: string) =>
  useQuery(productQuery(productId));
```
