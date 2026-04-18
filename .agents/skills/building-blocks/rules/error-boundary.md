---
title: Error Boundary
category: Component Patterns
layer: components/
composedWith: query-options-factory
---

## Error Boundary

Scoped runtime error handling for a feature component that runs its own query. Contains failure to the component's own DOM so the rest of the page keeps working. Catches both render errors and query fetch errors through a single wrapper.

### Constraints

- Only for components with their own **query hook**.
- `ErrorBoundary` and `withErrorBoundary` live in `src/lib/components/ErrorBoundary/`. Use `withErrorBoundary` by default — do not hand-roll.
- Add `throwOnError: true` on the query's `useQuery` call in `providers/`.
- No retry for ErrorBoundary by default.

### Example

```tsx
import { withErrorBoundary } from "@/lib/components/ErrorBoundary/with-error-boundary";

interface IProps {
  productId: string;
}

const ProductRatingBase = ({ productId }: IProps) => {
  const { data } = useMarketingProductQuery(productId);
  // render with data
};

const ProductRating = withErrorBoundary<IProps>(ProductRatingFallback)(
  ProductRatingBase
);

export { ProductRating };
```
