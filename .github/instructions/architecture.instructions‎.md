---
applyTo: "**"
---

## Architecture Overview

React SPA built with Vite using feature slice architecture with clean architecture principles.

### Core Technologies

- **React 19** with TypeScript
- **Vite 7** for build tooling
- **i18next** for internationalization
- **Vitest 4** for unit and component testing
- **Storybook 10** for component development

### Project Structure

```
.
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

- **presentation/** - UI components, UI-wise hooks
- **application/** - Business logic, state management, logic-wise hooks
- **infrastructure/** - Data fetching, external APIs, contracts, DTOs
- **types/** - Type definitions

### Key Patterns

| Pattern               | Description                                                      |
| --------------------- | ---------------------------------------------------------------- |
| Co-location           | Related files (component + story + test) grouped together        |
| MSW handlers          | API mocking centralized in `test-lib/handlers/`                  |
| Fixture pattern       | Test data generation in `test-lib/fixtures/`                     |
| Strong typing         | Comprehensive TypeScript with branded types                      |
| Component Composition | Features export composed components for pages                    |
| Centralized API       | All API logic in `src/lib/api/` with endpoint-based organization |

### Routing

- **File-based routing** - Pages in `src/pages/` with corresponding loaders
- **Strong typing** - Route paths defined in `lib/router/routes.ts`
- **Lazy loading** - Components loaded on demand with error boundaries

### Error Handling

- Using `react-error-boundary` for unexpected component runtime errors

### Build Optimization

- Lazy loading and code splitting based on `react-router`
- Using direct imports instead of default exports