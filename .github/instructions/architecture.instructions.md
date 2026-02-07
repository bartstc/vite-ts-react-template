---
applyTo: "**"
---

## Architecture Overview

React SPA built with Vite using feature slice architecture with clean architecture principles.

### Core Technologies

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
- **XState** for state machines

### Project Structure

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

### Feature Architecture

Each feature follows feature slice architecture patterns with three layers:

- **components/** - UI components, presentational and decoupled from data sources, business logic, and router state
- **application/** - Business logic, state management, custom hooks, stores, and functions
- **providers/** - Data fetching, external APIs, platform/SDK interactions, commands/mutations
- **models/** - Type definitions

### Key Patterns

| Pattern               | Description                                                      |
| --------------------- | ---------------------------------------------------------------- |
| Co-location           | Related files (component + story + test) grouped together        |
| MSW handlers          | API mocking centralized in `test-lib/handlers/`                  |
| Fixture pattern       | Test data generation in `test-lib/fixtures/`                     |
| Strong typing         | Comprehensive TypeScript with branded types                      |
| Component Composition | Features export composed components for pages                    |
| Centralized API       | All API logic in `src/lib/api/` with endpoint-based organization |

### State Management

| Type           | Use Case                                                                                                      |
| -------------- | ------------------------------------------------------------------------------------------------------------- |
| XState         | State orchestration with explicit states and constrained transitions (e.g., auth flows, multi-step processes) |
| Zustand stores | Complex local state (auth, modals, etc.)                                                                      |
| React Query    | Server state and caching                                                                                      |
| React state    | Simple component state                                                                                        |

XState is preferred for business processes where states must be explicit and transitions constrained.

### Routing

- **File-based routing** - Pages in `src/pages/` with corresponding loaders
- **Strong typing** - Route paths defined in `lib/router/routes.ts`
- **Lazy loading** - Components loaded on demand with error boundaries

### Error Handling

- Using `react-error-boundary` for unexpected component runtime errors

### Build Optimization

- Lazy loading and code splitting based on `react-router`
- Using direct imports instead of default exports
