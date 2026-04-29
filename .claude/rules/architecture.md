---
paths:
  - "src/features/**"
---

# Architecture Rules

## Project Structure

- `src/features/` — feature modules using feature slice architecture
- `src/lib/` — shared utilities, components, HTTP client, i18n, routing, theme
  . `src/lib/api/` — centralized API layer: queryOptions factories, mutationOptions factories, DTOs by resource
  - `src/lib/permissions/` — permission gating utilities. Available permissions: `@/features/authv2/models/permissions`
- `src/pages/` — route-level page components composing features
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

**Cross-slice primitives:** `features/auth/` and `features/authv2/` are cross-cutting concerns. Any feature slice may import from them.

### Additional rules

- `providers/` is the data access gateway — library-specific code (React Query, etc.) stays inside this layer and never leaks beyond it
- API logic starts in `src/lib/api/` (queryOptions factories, mutations, DTOs by resource), then gets exposed through the relevant feature's `providers/`
- Query files expose `queryOptions` factories — hook composition belongs in `providers/`, not in API files
- Co-locate related files: component + story + test together
