---
paths:
  - "src/**"
  - "e2e/**"
---

# Architecture

## Core Technologies

- **React 19** with TypeScript
- **Vite 7** for build tooling
- **React Query (TanStack Query)** for data fetching
- **React Router 7** for routing
- **i18next** for internationalization
- **MSW 2** for API mocking
- **Vitest 4** for unit and component testing
- **Storybook 10** for component development
- **Playwright** for E2E testing
- **Zustand** for state management
- **Chakra UI** for components

## Project Structure

```
.
├── e2e/           # End-to-end tests with Playwright
└── src/
    ├── app/           # App-level configuration (App.tsx, Providers.tsx)
    ├── features/      # Feature modules using feature slice architecture
    │   ├── auth/      # Authentication feature
    │   ├── carts/     # Shopping cart feature
    │   ├── products/  # Product catalog feature
    ├── lib/           # Shared libraries and utilities
    │   ├── api/       # Centralized API layer (queries, commands, DTOs)
    │   ├── components/ # Reusable UI components
    │   ├── http/      # HTTP client and error handling
    │   ├── i18n/      # Internationalization setup
    │   ├── router/    # Routing utilities
    │   └── theme/     # Theme configuration
    ├── pages/         # Route-level page components composing feature components & logic
    └── test-lib/      # Testing utilities and fixtures
```

## Feature Architecture

Each feature follows feature slice architecture patterns with three layers:

## Feature Architecture

Each feature follows feature slice architecture patterns with four layers:

- **components/** - UI components, presentational and decoupled from business logic (application) and router state. Data access is only through `providers/`.
- **application/** - Business logic, portable state management (stores, FSMs, form validation), custom hooks. Should not depend on router state or external APIs directly (only through `providers/`).
- **providers/** - Hook composition and data access gateway for the feature slice. Exposes query hooks, mutations, loaders, domain errors, and DTOs sourced from `src/lib/api/`. Library-specific code (React Query, etc.) must not leak beyond this layer.
- **models/** - Domain type definitions, utilities, and type mapping functions.

**Dependency rule:** `components/` and `application/` import from `models/` and `providers/`. `providers/` and `models/` have no internal feature dependencies.

## API Layer

`src/lib/api/` is the global home for all HTTP logic: `queryOptions` factories, loaders, mutation hooks, query keys, domain errors, and DTOs, organised by resource. Query files expose `queryOptions` factories (no `useQuery` hooks — hook composition belongs in `providers/`). Feature `providers/` compose hooks on top of those factories and re-export them for feature slice. New API logic always goes in `src/lib/api/` first, then gets exposed through the relevant feature's `providers/`.

## Key Patterns

| Pattern               | Description                                                      |
| --------------------- | ---------------------------------------------------------------- |
| Co-location           | Related files (component + story + test) grouped together        |
| MSW handlers          | API mocking centralized in `test-lib/handlers/`                  |
| Fixture pattern       | Test data generation in `test-lib/fixtures/`                     |
| Strong typing         | Comprehensive TypeScript with branded types                      |
| Component Composition | Features export composed components for pages                    |
| Centralized API       | All API logic in `src/lib/api/` with endpoint-based organization |

## State Management

| Type           | Use Case                                                                                                      |
| -------------- | ------------------------------------------------------------------------------------------------------------- |
| XState         | State orchestration with explicit states and constrained transitions (e.g., auth flows, multi-step processes) |
| Zustand stores | Complex local state (auth, modals, etc.)                                                                      |
| React Query    | Server state and caching                                                                                      |
| React state    | Simple component state                                                                                        |

XState is preferred for business processes where states must be explicit and transitions constrained.

## Routing

- **File-based routing** - Pages in `src/pages/` with corresponding loaders
- **Strong typing** - Route paths defined in `lib/router/routes.ts`
- **Lazy loading** - Components loaded on demand with error boundaries

## Error Handling

- Using `react-error-boundary` for unexpected component runtime errors

## Build Optimization

- Lazy loading and code splitting based on `react-router`
- Using direct imports instead of default exports
