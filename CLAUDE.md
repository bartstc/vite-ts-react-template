# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Golden Rules

- When unsure about implementation details, requirements, or business logic, ALWAYS consult the developer rather than making assumptions.
- We optimize for maintainability over cleverness. When in doubt, choose the boring solution.

| #:  | AI _may_ do                                                                                                                                                                                                  | AI _must NOT_ do                                                                                                                                      |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| G-0 | Whenever unsure about something that's related to the project, ask the developer for clarification before making changes.                                                                                    | ❌ Write changes or use tools when you are not sure about something project-specific, or if you don't have context for a particular feature/decision. |
| G-1 | Generate code **only inside** relevant source directories (e.g., `src/features/` for features, `src/lib/api/` for the API, `src/pages/` for composing feature-wise components), or explicitly pointed files. | ❌ Touch files beyond `src`, or any `*.stories.tsx` / `*.test.tsx` / `*.test.ts` files (humans own tests & specs), unless requested.                  |
| G-2 | Add/update **`AIDEV-NOTE:` anchor comments** near non-trivial edited code.                                                                                                                                   | ❌ Delete or mangle existing `AIDEV-` comments.                                                                                                       |
| G-3 | Follow lint/style configs (`.prettierrc`, `.eslint.config.mjs`). Use the project's configured linter, if available, instead of manually re-formatting code.                                                  | ❌ Re-format code to any other style.                                                                                                                 |
| G-4 | For changes >300 LOC or >3 files, **ask for confirmation**.                                                                                                                                                  | ❌ Refactor large modules without human guidance.                                                                                                     |
| G-5 | Stay within the current task context. Inform the dev if it'd be better to start afresh.                                                                                                                      | ❌ Continue work from a prior prompt after "new task" – start a fresh session.                                                                        |
| G-6 | Modify API contracts only with explicit developer approval and clear documentation.                                                                                                                          | ❌ Change API contracts (e.g., endpoints, DTOs, mapping logic) without approval.                                                                      |

## Plan & Review

### Before starting work

- Always start with planning the work unless requested not to do it. After getting the plan, never present it in the chat, write it to .claude/tasks/TASK_NAME.md instead.
- The plan should be a detailed implementation plan and the reasoning behind them, as well as tasks broken down.
- If the task requires external knowledge or certain package, also research to get latest knowledge (Use Task tool for research).
- Don't over plan it, always think MVP.
- Once you write the plan, firstly ask me to review it. Do not continue until I approve the plan.

### While implementing

- You should update the plan as you work.
- After you complete tasks in the plan, you should update and append detailed descriptions of the changes you made, so following tasks can be easily hand over to other engineers.

### Scanning Repository

- **Use Only Referenced Files**: Analyze, generate code, or match patterns using only files explicitly mentioned in the user's prompt. [Important]
- **Locate Anchors First**: Before scanning, check for existing `AIDEV-*` anchors in relevant subdirectories. [Important]
- **No Broad Scans**: Avoid scanning unreferenced files unless the user explicitly permits it.
- **Handle Insufficient Information**: If referenced files lack context, state: "Insufficient information in provided files." Suggest specific files or details needed, e.g., "Please provide 'src/features/auth/[file_name]' or clarify expected behavior."

## Essential Commands

### Essential Commands

- `pnpm dev` - Start development server on port 5173
- `pnpm lint` - Run ESLint with flat config
- `pnpm test` - Run all tests (unit + storybook)
- `pnpm test:unit` - Run unit tests only
- `pnpm test:storybook` - Run storybook tests only
- `pnpm test:coverage` - Run tests with coverage report
- `pnpm storybook` - Start Storybook development server on port 6006

### CI Commands

- `pnpm test:unit:ci` - Run unit tests with coverage and reports for CI
- `pnpm test:storybook:ci` - Run storybook tests with coverage and reports for CI

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
- **Vitest 3** for testing
- **Storybook 9** for component development
- **Zustand** for state management
- **Chakra UI** for components

### Project Structure

```
src/
├── app/           # App-level configuration (App.tsx, Providers.tsx)
├── features/      # Feature modules using feature slice architecture
│   ├── auth/      # Authentication feature
│   ├── carts/     # Shopping cart feature
│   ├── products/  # Product catalog feature
├── lib/           # Shared libraries and utilities
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
- **Component Composition**: Features export composed components for pages to use

### Path Resolution

- Uses `@/*` path mapping for clean imports from `src/`
- Example: `import { Button } from '@/shared/components/button'`

### Testing Strategy

- **Unit tests** - `.test.ts` / `.test.tsx` files alongside source code
- **Storybook tests** - `.stories.tsx` files alongside components
- **MSW integration** - Mocked APIs for both development and testing
- **Coverage reporting** - Istanbul coverage with LCOV reports

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

## Code Style and Patterns

### Code Style

- Formatting: Prettier with 80-char lines
- Imports: sorted with eslint-plugin-import
- Components, providers: `PascalCase`, co-located with their tests `PascalCase.stories`
- Hooks, functions, classes, contexts: `kebab-case`, co-located with their tests `kebab-case.test`

### Anchor comments

Add specially formatted comments throughout the codebase, where appropriate, for yourself as inline knowledge that can be easily `grep`ped for.

- Use `AIDEV-NOTE:`, `AIDEV-TODO:`, or `AIDEV-QUESTION:` (all-caps prefix) for comments aimed at AI and developers.
- Keep them concise (≤ 120 chars).
- Before scanning files, always first try to **grep for existing anchors** `AIDEV-*` in prompt's referenced files or relevant files/subdirectories. [Important]
- **Update relevant anchors** when modifying associated code.
- **Do not remove `AIDEV-NOTE`s** without explicit human instruction.
- Make sure to add relevant anchor comments, whenever a file or piece of code is:
  - too complex, or
  - very important, or
  - confusing, or
  - could have a bug

### Code Standards

#### General

- Preserve the original structure and formatting of the user's input.
- Always follow the existing structure and formatting of referenced files.
- Do not add comments to code unless explicitly requested. If needed, focus on better var/function names instead.
- Always use async/await for async code.
- Always use try/catch blocks for async operations.

#### Typescript

- If TypeScript inference can do the job, use it instead of explicit types.
- Follow functional programming principles where possible, especially prefer immutability and pure functions.
- Prefer type over interface unless the user explicitly requests an interface.
- Use optional chaining (?.) and nullish coalescing (??) operators for safe property access if needed.
- Avoid using `any` type. If necessary, use `unknown` instead.

#### React

- Use functional components with hooks.
- If a complicated `useEffect` is generated, create a custom hook instead.
- Always prefix custom hooks with `use`
- Keep components small and focused.
- Try to separate JSX and custom styles from logic.
- When editing/adding styles, look for available API of [Chakra UI](https://www.chakra-ui.com/docs/components/concepts/overview).

## Testing Discipline

| What           | AI CAN Do               | AI MUST NOT Do           |
| -------------- | ----------------------- | ------------------------ |
| Implementation | Generate business logic | Touch test files         |
| Test Planning  | Suggest test scenarios  | Write test code          |
| Debugging      | Analyze test failures   | Modify test expectations |

### Test Case Scenarios Preference

- Focus on **business logic and domain requirements**, not implementation details
- Test **meaningful scenarios** that could realistically occur in production
- Keep test scenarios focused on single responsibilities
- Avoid redundant edge cases like:
  - Empty arrays when "not found" is already tested
  - `undefined` collections when the type system prevents this
  - Multiple variations of the same error condition
- Prioritize tests for:
  - Happy path scenarios with realistic data
  - Error conditions that users might encounter
  - Edge cases that affect business logic (not just code coverage)
- Each test should verify **distinct behavior**, not just different ways to trigger the same code path
