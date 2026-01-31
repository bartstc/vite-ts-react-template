# Code Style

## General

- Preserve original structure and formatting of referenced files
- Follow existing patterns in the codebase
- Follow functional programming principles - prefer immutability and pure functions
- Treat data as immutable - return new objects/arrays instead of mutating

## TypeScript

- Avoid `any` type - use `unknown` if necessary
- Avoid type assertions (`value as Type`) - prefer type guards or refactoring
- Prefer solving problems with TypeScript types over runtime code when possible

## React

- Split complex `useEffect` into smaller, focused effects
- Prefer composition over prop drilling - use `children` prop and component composition
- Isolate business logic from presentation - extract logic to custom hooks or separate functions
