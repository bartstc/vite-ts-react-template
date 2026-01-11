---
applyTo: "**"
---

## Golden Rules

- When unsure about implementation details, requirements, or business logic, ALWAYS consult the developer rather than making assumptions.
- We optimize for maintainability over cleverness. When in doubt, choose the boring solution.

| #:  | AI _may_ do                                                                                                                                                                                                  | AI _must NOT_ do                                                                                                                                      |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| G-0 | Whenever unsure about something that's related to the project, ask the developer for clarification before making changes.                                                                                    | ❌ Write changes or use tools when you are not sure about something project-specific, or if you don't have context for a particular feature/decision. |
| G-1 | Generate code **only inside** relevant source directories (e.g., `src/features/` for features, `src/lib/api/` for the API, `src/pages/` for composing feature-wise components), or explicitly pointed files. | ❌ Touch files beyond `src`, or any `*.stories.tsx` / `*.test.tsx` / `*.test.ts` / `*.spec.ts` files (humans own tests & specs), unless requested.    |
| G-2 | Add/update **`AIDEV-NOTE:` anchor comments** near non-trivial edited code.                                                                                                                                   | ❌ Delete or mangle existing `AIDEV-` comments.                                                                                                       |
| G-3 | Follow lint/style configs (`.prettierrc`, `.eslint.config.mjs`). Use the project's configured linter, if available, instead of manually re-formatting code.                                                  | ❌ Re-format code to any other style.                                                                                                                 |
| G-4 | For changes >300 LOC or >3 files, **ask for confirmation**.                                                                                                                                                  | ❌ Refactor large modules without human guidance.                                                                                                     |
| G-5 | Stay within the current task context. Inform the dev if it'd be better to start afresh.                                                                                                                      | ❌ Continue work from a prior prompt after "new task" – start a fresh session.                                                                        |
| G-6 | Modify API contracts only with explicit developer approval and clear documentation.                                                                                                                          | ❌ Change API contracts (e.g., endpoints, DTOs, mapping logic) without approval.                                                                      |
| G-7 | Use git commands only when explicitly requested by the developer.                                                                                                                                            | ❌ Stage, commit, or push changes without explicit developer request.                                                                                 |

> **Note:** Rules G-3, G-4, and G-7 primarily apply to Agent mode when Copilot makes autonomous changes.

## Workflow Guidelines

### When working on complex tasks

- Break down work into clear, incremental steps
- In Plan mode, Copilot will propose an implementation plan for review
- In Agent mode, follow the task incrementally with clear checkpoints
- Update relevant `AIDEV-*` anchor comments as you work

### Context Usage

- **Locate Anchors First**: Before editing code, check for existing `AIDEV-*` anchors in relevant files/subdirectories using grep. [Important]
- **Handle Insufficient Information**: If context is unclear, ask: "Please provide '[specific file/detail]' or clarify expected behavior."

## Commands

### Essential Commands

- `pnpm dev` - Start development server on port 5173
- `pnpm lint` - Run ESLint with flat config
- `pnpm lint --fix` - Run ESLint and fix linting errors/warnings
- `pnpm test` - Run all tests (unit + storybook)
- `pnpm test:unit` - Run unit tests only
- `pnpm test:storybook` - Run storybook tests only
- `pnpm test:e2e` - Run E2E tests with Playwright
- `pnpm test:e2e:ui` - Run E2E tests in interactive UI mode
- `pnpm test:e2e:debug` - Run E2E tests in debug mode
- `pnpm test:coverage` - Run unit + storybook tests with coverage report
- `pnpm storybook` - Start Storybook development server on port 6006

### CI Commands

- `pnpm test:unit:ci` - Run unit tests with coverage and reports for CI
- `pnpm test:storybook:ci` - Run storybook tests with coverage and reports for CI
- `pnpm test:e2e:ci` - Run E2E tests with reports for CI

### Package Manager

This project uses **PNPM** as the package manager. Always use `pnpm` commands, not `npm` or `yarn`.

## Architecture Overview

This is a React SPA built with Vite using feature slice based architecture with clean architecture principles.

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

- **presentation/** - UI components, UI-wise hooks
- **application/** - Business logic, state management, logic-wise hooks
- **infrastructure/** - Data fetching, external APIs, contracts, DTOs
- **types/** - Type definitions

### Key Patterns

- **Co-location** - Related files (component + story + test) are grouped together
- **MSW handlers** - API mocking is centralized in `test-lib/handlers/`
- **Fixture pattern** - Test data generation in `test-lib/fixtures/`
- **Strong typing** - Comprehensive TypeScript usage with branded types
- **Component Composition**: Features export composed components for pages to use,
- **Centralized API** - All API logic consolidated in `src/lib/api/` with endpoint-based organization

### Path Resolution

- Uses `@/*` path mapping for clean imports from `src/`
- Example: `import { Button } from '@/shared/components/button'`

### Testing Strategy

- **Unit tests** - `.test.ts` / `.test.tsx` files alongside source code
- **Storybook tests** - `.stories.tsx` files alongside components
- **E2E tests** - Playwright tests in `tests/` directory (or `e2e/`)
- **MSW integration** - Mocked APIs for both development and testing
- **Coverage reporting** - Istanbul coverage with LCOV reports (for unit + storybook tests)

### State Management

- **Zustand stores** - For complex local state (auth, modals, etc.)
- **React Query** - For server state and caching
- **React state** - For simple component state

### Routing

- **File-based routing** - Pages in `src/pages/` with corresponding loaders
- **Strong typing** - Route paths defined in `lib/router/routes.ts`
- **Lazy loading** - Components loaded on demand with error boundaries

### Error Handling

- Using `react-error-boundary` for unexpected components runtime errors

### Build Optimization

- Lazy loading and code splitting based on `react-router`
- Using direct imports instead of default
