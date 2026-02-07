# Code Style

## General

- Preserve original structure and formatting of referenced files
- Follow existing patterns in the codebase
- Follow functional programming principles - prefer immutability and pure functions
- Treat data as immutable - return new objects/arrays instead of mutating

## Naming Conventions

### File naming

| Category           | Convention | Example                                           |
| ------------------ | ---------- | ------------------------------------------------- |
| React components   | PascalCase | `ProductCard.tsx`, `SignInForm.tsx`               |
| Storybook stories  | PascalCase | `ProductCard.stories.tsx`                         |
| Page Objects (E2E) | PascalCase | `ProductListPage.ts`, `HeaderComponent.ts`        |
| Everything else    | kebab-case | `auth-store.ts`, `use-counter.ts`, `build-url.ts` |

"Everything else" includes: hooks, stores, utils, types, models, HOCs, handlers, fixtures, providers, machines, and tests.

Test files mirror their source: `use-counter.ts` → `use-counter.test.ts`, `all-or-nothing.ts` → `all-or-nothing.test.ts`.

## TypeScript

- Avoid `any` type - use `unknown` if necessary
- Avoid type assertions (`value as Type`) - prefer type guards or refactoring
- Prefer solving problems with TypeScript types over runtime code when possible

## React

- Split complex `useEffect` into smaller, focused effects
- Prefer composition over prop drilling - use `children` prop and component composition
- Isolate business logic from presentation - extract logic to custom hooks or separate functions
