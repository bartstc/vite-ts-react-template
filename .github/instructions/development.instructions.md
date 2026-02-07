---
applyTo: "**/*.{ts,tsx}"
---

## Code Style and Patterns

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
- Follow functional programming principles where possible, especially prefer immutability and pure functions.
- Treat data as immutable - return new objects/arrays instead of mutating existing ones.

#### Naming Conventions

| Category           | Convention | Example                                           |
| ------------------ | ---------- | ------------------------------------------------- |
| React components   | PascalCase | `ProductCard.tsx`, `SignInForm.tsx`               |
| Storybook stories  | PascalCase | `ProductCard.stories.tsx`                         |
| Page Objects (E2E) | PascalCase | `ProductListPage.ts`, `HeaderComponent.ts`        |
| Everything else    | kebab-case | `auth-store.ts`, `use-counter.ts`, `build-url.ts` |

"Everything else" includes: hooks, stores, utils, types, models, HOCs, handlers, fixtures, providers, machines, and tests.

Test files mirror their source: `use-counter.ts` → `use-counter.test.ts`, `all-or-nothing.ts` → `all-or-nothing.test.ts`.

#### Typescript

- Avoid using `any` type. If necessary, use `unknown` instead.
- Avoid type assertions (`value as Type`) - prefer proper type guards or refactoring.
- Prefer solving problems with TypeScript types over runtime JavaScript code when possible.

#### React

- Split complex `useEffect` into smaller, focused `useEffect`s.
- Keep components small and focused on single responsibility.
- Prefer composition over prop drilling - use `children` prop and component composition patterns.
- Isolate business logic from presentation - components should focus on UI, extract logic to custom hooks or separate functions.
