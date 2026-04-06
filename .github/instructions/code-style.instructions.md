---
applyTo: "**"
---

# Code Style

## File Naming

| Category           | Convention | Example                             |
| ------------------ | ---------- | ----------------------------------- |
| React components   | PascalCase | `ProductCard.tsx`, `SignInForm.tsx` |
| Storybook stories  | PascalCase | `ProductCard.stories.tsx`           |
| Page Objects (E2E) | PascalCase | `ProductListPage.ts`                |
| Everything else    | kebab-case | `auth-store.ts`, `use-counter.ts`   |

Test files mirror source: `use-counter.ts` → `use-counter.test.ts`.
File names match the primary export when possible: `ProductCard.tsx` exports `ProductCard` component, `use-add-product.ts` exports `useAddProduct` hook.

## TypeScript

- Use `unknown` instead of `any` — refactor or use type guards instead of type assertions (`as Type`)
- Prefer solving problems with TypeScript types over runtime code when possible
- Use named exports exclusively

## React

- Split complex `useEffect` into smaller, focused effects
- Prefer composition with `children` prop over prop drilling
- Extract business logic to custom hooks or functions — keep components presentational

## General

- Prefer immutability and pure functions — return new objects/arrays instead of mutating
- Follow lint/style configs (`.prettierrc`, `.eslint.config.mjs`) — do not reformat to any other style
