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

#### Typescript

- Follow functional programming principles where possible, especially prefer immutability and pure functions.
- Avoid using `any` type. If necessary, use `unknown` instead.

#### React

- If a complicated `useEffect` is generated, create a custom hook instead.
- Keep components small and focused.
- When editing/adding styles, look for available API of [Chakra UI](https://www.chakra-ui.com/docs/components/concepts/overview).
