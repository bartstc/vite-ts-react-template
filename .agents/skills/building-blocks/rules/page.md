---
title: Page
category: Component Patterns
layer: pages/
composedWith: pure-component, compound-component
---

## Page

Composes presentation components into a complete screen. The only place where coupling to router state (params, search params, navigation) is acceptable. Pages are the seam between routing and UI — they read route context and pass plain props downward.

### Constraints

- Pages should be thin orchestrators: pull route params, invoke hooks, pass props to pure components. If a page has significant logic, extract it into a `facade-hook` or `use-case-hook`.
- One page per route. If two routes share 90% of their UI, extract the shared part into a component — don't make one page serve two routes with conditionals.
- Page loaders in `src/pages/<Page>/loader.ts` compose resource-level loaders from query-options-factory

### Example

```tsx
import { useProductQuery } from "@/features/products/providers/product-query";
import { ProductDetails } from "@/features/products/components/ProductDetails";
import { Page } from "@/lib/components/Layout/Page";
import { useNavigate, useParams } from "@/lib/router";

const ProductPage = () => {
  const params = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { data } = useProductQuery(params.productId!);

  return (
    <Page gap={6}>
      <Button variant="plain" onClick={() => navigate("/products")}>
        <ArrowLeft />
        Back to list
      </Button>
      <ProductDetails product={data} onBack={() => navigate("/products")} />
    </Page>
  );
};

// Router-level exports — page owns its error boundary
export const Component = ProductPage;

export const ErrorBoundary = () => {
  const error = useRouteError();
  if (error instanceof ResourceNotFoundException) {
    return <ProductNotFoundResult />;
  }
  return <InternalErrorResult />;
};
```
