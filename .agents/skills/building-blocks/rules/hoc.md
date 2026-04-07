---
title: Higher-Order Component
category: Component Patterns
layer: components/
composedWith: []
---

## Higher-Order Component

Component in → enhanced component out. The pre-hooks pattern for cross-cutting concerns: auth guards, error boundaries, suspense wrappers, analytics instrumentation, permission gates. Still earns its place when the concern is about **whether or how** a component renders, not about data it needs — hooks can't conditionally render a different component.

### Constraints

- Use sparingly. If the enhancement is "give this component some data," a hook is almost always simpler. HOCs shine for render-level decisions: show/hide, wrap in boundary, gate on permission.
- Always forward props with generics (`<TProps extends object>`) to preserve the wrapped component's type contract. Set `displayName` for DevTools — the `eslint-disable` on display name is a known cost.

### Example

```tsx
import { type ComponentType, Suspense, type SuspenseProps } from "react";

// Generic suspense wrapper — avoids repeating <Suspense> at every lazy boundary
export const withSuspense =
  <TProps extends object>(fallback?: SuspenseProps["fallback"]) =>
  (Component: ComponentType<TProps>) => {
    const Wrapped = (props: TProps) => (
      <Suspense fallback={fallback}>
        <Component {...props} />
      </Suspense>
    );
    Wrapped.displayName = `withSuspense(${
      Component.displayName ?? Component.name
    })`;
    return Wrapped;
  };
```

```tsx
// Usage
const LazyDashboard = withSuspense(<Spinner />)(CartItem);
```
