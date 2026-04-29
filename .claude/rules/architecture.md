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

- Each feature has four layers: `components/`, `application/`, `providers/`, `models/`
- `components/` imports from `application/`, `models/`, `providers/`, and `lib/*`
- `application/` imports from `models/`, `providers/`, and `lib/*` — not from `components/`
- `providers/` is the data access gateway: composes query hooks, mutations from `src/lib/api/`; may import from `models/`, `lib/api/`, `lib/*`
- `models/` holds domain type definitions only — no logic; may import from `lib/api/` and `lib/*`
- `lib/api/` must never be imported in `components/`, `application/`, or `pages/`
- Library-specific code (React Query, etc.) stays inside `providers/` — never leak beyond this layer
- API logic starts in `src/lib/api/` (queryOptions factories, mutations, DTOs by resource), then gets exposed through the relevant feature's `providers/`
- Query files expose `queryOptions` factories — hook composition belongs in `providers/`, not in API files
- Co-locate related files: component + story + test together
