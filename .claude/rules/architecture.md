---
paths:
  - "src/**"
  - "e2e/**"
---

# Architecture Rules

## Project Structure

- `src/features/` — feature modules using feature slice architecture
- `src/lib/api/` — centralized API layer: queryOptions factories, mutations, DTOs by resource
- `src/lib/` — shared utilities, components, HTTP client, i18n, routing, theme
- `src/pages/` — route-level page components composing features
- `src/app/` — app-level config (App.tsx, Providers.tsx)
- `e2e/` — Playwright end-to-end tests
- `test-lib/` — test utilities, MSW handlers, fixtures

## Feature Slice Layers

- Each feature has four layers: `components/`, `application/`, `providers/`, `models/`
- `components/` imports from `application/`, `models/`, and `providers/`
- `application/` imports from `models/` and `providers/` — not from `components/`
- `providers/` is the data access gateway: composes query hooks, mutations, loaders from `src/lib/api/`
- Library-specific code (React Query, etc.) stays inside `providers/` — never leak beyond this layer
- API logic starts in `src/lib/api/` (queryOptions factories, mutations, DTOs by resource), then gets exposed through the relevant feature's `providers/`
- Query files expose `queryOptions` factories — hook composition belongs in `providers/`, not in API files
- Co-locate related files: component + story + test together

Read `docs/architecture.md` for full project structure, state management guide, and routing patterns.
