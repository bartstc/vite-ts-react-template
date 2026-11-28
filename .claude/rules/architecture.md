---
paths:
  - "src/features/**"
---

# Architecture Rules

## Project Structure

- `src/features/` — feature modules that use the feature slice architecture
- `src/lib/` — shared utilities, components, HTTP client, i18n, routing, theme
  - `src/lib/api/` — the central API layer: queryOptions factories, mutationOptions factories, DTOs by resource
  - `src/lib/permissions/` — utilities for permission gates. The available permissions are in `@/features/authv2/models/permissions`
- `src/pages/` — route-level page components that compose features
- `src/app/` — app-level config (App.tsx, Providers.tsx)
- `e2e/` — Playwright end-to-end tests
- `test-lib/` — test utilities, MSW handlers, fixtures

## Feature Slice Layers

Each feature has four layers: `components/`, `application/`, `providers/`, `models/`.

### Dependency rule

| Layer          | May import from                                  |
| -------------- | ------------------------------------------------ |
| `components/`  | `application/`, `providers/`, `models/`, `lib/*` |
| `application/` | `providers/`, `models/`, `lib/*`                 |
| `providers/`   | `models/`, `lib/api/`, `lib/*`                   |
| `models/`      | `lib/api/`, `lib/*`                              |

**Cross-slice primitives:** `features/auth/` and `features/authv2/` are cross-cutting concerns. All feature slices may import from them.

### Additional rules

- `providers/` is the data access gateway. Code for a specific library (React Query and others) stays in this layer and never goes outside it.
- API logic starts in `src/lib/api/` (queryOptions factories, mutations, DTOs by resource). Then the `providers/` of the related feature expose it.
- Query files expose `queryOptions` factories. Hook composition belongs in `providers/`, not in API files.
- Keep related files together: component, story and test.
- Before you write a generic helper, hook or UI component, list `src/lib/` (and `src/lib/components/`). Use again what exists. New generic code goes in `lib/`. Never make a copy of it in a feature.
