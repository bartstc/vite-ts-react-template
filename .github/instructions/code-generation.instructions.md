---
applyTo: "**/*.{ts,tsx}"
---

### Code Generation Guidelines

- Preserve the original structure and formatting of the user's input.
- Always follow the existing structure and formatting of referenced files.
- Do not add comments to code unless explicitly requested. If needed, focus on better var/function names instead.
- Always use async/await for async code.
- Always use try/catch blocks for async operations.
- If an additional reference file (e.g., implementation or type definitions) is needed for better results, acknowledge this and ask the user to provide it.

#### Typescript

- If TypeScript inference can do the job, use it instead of explicit types.
- Follow functional programming principles where possible, especially prefer immutability and pure functions.
- Prefer type over interface unless the user explicitly requests an interface.
- Use optional chaining (?.) and nullish coalescing (??) operators for safe property access if needed.
- Avoid using `any` type. If necessary, use `unknown` instead.

#### React

- Use functional components with hooks.
- If a complicated `useEffect` is generated, create a custom hook instead.
- Keep components small and focused.
- Try to separate JSX and custom styles from logic.
