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
    │   ├── api/       # Centralized API layer (queries, mutations, DTOs)
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
- **providers/** - Hook composition and data access gateway for the feature slice. Exposes query hooks, mutations, loaders, and domain errors sourced from `src/lib/api/`. When the DTO shape diverges from the domain model, the mapping function lives here — applied inside the query/mutation hook so consumers always receive the correct domain model type.
  - files are named after their primary export or reexport: `useCartProductsQuery` → `use-cart-products-query.ts`, `useAddToCartMutation` → `use-add-to-cart-mutation.ts`
- **models/** - Domain type definitions only. Exposes frontend models for the feature. When the DTO shape is identical to the domain model, re-export with a domain name (`export type { ProductDto as Product }`). When it diverges, define the domain type here.

**Dependency rule:**

| Layer          | May import from                                  |
| -------------- | ------------------------------------------------ |
| `components/`  | `application/`, `providers/`, `models/`, `lib/*` |
| `application/` | `providers/`, `models/`, `lib/*`                 |
| `providers/`   | `models/`, `lib/api/`, `lib/*`                   |
| `models/`      | `lib/api/`, `lib/*`                              |

**Cross-slice primitives:** `features/auth/` and `features/authv2/` are cross-cutting concerns (identity, permissions, auth state). Any feature slice may import from them.

## API Library

`src/lib/api/` is the global home for all HTTP logic: `queryOptions` factories, loaders, mutation hooks, query keys, domain errors, and DTOs, organised by resource. Query files expose `queryOptions` factories (no `useQuery` hooks — hook composition belongs in `providers/`). Feature `providers/` compose hooks on top of those factories and re-export them for feature slice. New API logic always goes in `src/lib/api/` first, then gets exposed through the relevant feature's `providers/`.

**File naming in `src/lib/api/`:**

| Type             | Suffix           | Example                   |
| ---------------- | ---------------- | ------------------------- |
| Query options    | `-query.ts`      | `cart-products-query.ts`  |
| Mutation options | `-mutation.ts`   | `add-to-cart-mutation.ts` |
| DTO interface    | `-dto.ts`        | `cart-product-dto.ts`     |
| Query keys       | `-query-keys.ts` | `cart-query-keys.ts`      |

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

## Internationalization

- Translation files live in `public/locales/{lang}/translation.json`
- Keys mirror the feature path e.g. `features.products.<key>`
- All user-facing text goes through i18next — no hardcoded strings in components
- When adding any value that renders as a user-facing label, add the corresponding translation key in the same task
- When removing a value, remove its stale translation key

## Routing

- **File-based routing** - Pages in `src/pages/` with corresponding loaders
- **Strong typing** - Route paths defined in `lib/router/routes.ts`
- **Lazy loading** - Components loaded on demand with error boundaries

## Error Handling

- Using `react-error-boundary` for unexpected component runtime errors

## Build Optimization

- Lazy loading and code splitting based on `react-router`
- Using direct imports instead of default exports
