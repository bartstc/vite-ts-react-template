# Code Style

## File Naming

| Category           | Convention | Example                             |
| ------------------ | ---------- | ----------------------------------- |
| React components   | PascalCase | `ProductCard.tsx`, `SignInForm.tsx` |
| Storybook stories  | PascalCase | `ProductCard.stories.tsx`           |
| Page Objects (E2E) | PascalCase | `ProductListPage.ts`                |
| All other files    | kebab-case | `auth-store.ts`, `use-counter.ts`   |

Test files have the same name as their source: `use-counter.ts` → `use-counter.test.ts`.
If possible, the name of a file is the name of its primary export. `ProductCard.tsx` exports the `ProductCard` component. `use-add-product.ts` exports the `useAddProduct` hook.

## TypeScript

- Use `unknown` instead of `any`. Refactor or use type guards instead of type assertions (`as Type`).
- If possible, solve problems with TypeScript types instead of runtime code.
- Use only named exports.

## React

- Divide a complex `useEffect` into smaller effects, each with one purpose.
- Prefer composition with the `children` prop to prop drilling.
- Move business logic to custom hooks or functions. Keep components presentational.

## General

- Prefer immutability and pure functions. Return new objects and arrays instead of changing them.
- Follow the lint and style configs (`.prettierrc`, `.eslint.config.mjs`). Do not reformat to a different style.
