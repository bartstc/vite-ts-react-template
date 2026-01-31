---
applyTo: "**"
---

## Golden Rules

- When unsure about implementation details, requirements, or business logic, ALWAYS consult the developer rather than making assumptions.
- We optimize for maintainability over cleverness. When in doubt, choose the boring solution.
- When reporting information, options, pros/cons, or summarizing changes, be extremely concise—sacrifice grammar if needed.
- Keep plans and documentation concise yet detailed—prioritize information density over formatting.

| #:  | AI _may_ do                                                                                                                                                                                                  | AI _must NOT_ do                                                                                                                                             |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| G-0 | Whenever unsure about something that's related to the project, ask the developer for clarification before making changes.                                                                                    | ❌ Write changes or use tools when you are not sure about something project-specific, or if you don't have context for a particular feature/decision.        |
| G-1 | Generate code **only inside** relevant source directories (e.g., `src/features/` for features, `src/lib/api/` for the API, `src/pages/` for composing feature-wise components), or explicitly pointed files. | ❌ Touch files beyond `src` and `e2e`, or any `*.stories.tsx` / `*.test.tsx` / `*.test.ts` / `*.spec.ts` files (humans own tests & specs), unless requested. |
| G-2 | Add/update **`AIDEV-NOTE:` anchor comments** near non-trivial edited code.                                                                                                                                   | ❌ Delete or mangle existing `AIDEV-` comments.                                                                                                              |
| G-3 | Follow lint/style configs (`.prettierrc`, `.eslint.config.mjs`). Use the project's configured linter, if available, instead of manually re-formatting code.                                                  | ❌ Re-format code to any other style.                                                                                                                        |
| G-4 | For changes >300 LOC or >3 files, **ask for confirmation**.                                                                                                                                                  | ❌ Refactor large modules without human guidance.                                                                                                            |
| G-5 | Stay within the current task context. Inform the dev if it'd be better to start afresh.                                                                                                                      | ❌ Continue work from a prior prompt after "new task" – start a fresh session.                                                                               |
| G-6 | Modify API contracts only with explicit developer approval and clear documentation.                                                                                                                          | ❌ Change API contracts (e.g., endpoints, DTOs, mapping logic) without approval.                                                                             |
| G-7 | Use git commands only when explicitly requested by the developer.                                                                                                                                            | ❌ Stage, commit, or push changes without explicit developer request.                                                                                        |

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

**Package Manager:** PNPM only (`pnpm`, not `npm` or `yarn`)

### Essential Commands

| Command                | Description                      |
| ---------------------- | -------------------------------- |
| `pnpm dev`             | Start dev server (port 5173)     |
| `pnpm lint`            | Run ESLint                       |
| `pnpm lint --fix`      | Fix lint errors                  |
| `pnpm test`            | Run all tests (unit + storybook) |
| `pnpm test:unit`       | Unit tests only                  |
| `pnpm test:storybook`  | Storybook tests only             |
| `pnpm test:e2e`        | E2E tests (Playwright, headless) |
| `pnpm test:e2e:ui`     | E2E interactive web UI mode      |
| `pnpm test:e2e:headed` | E2E with visible browser         |
| `pnpm test:e2e:debug`  | E2E debug mode                   |
| `pnpm test:e2e:report` | Open E2E HTML report             |
| `pnpm test:coverage`   | Tests with coverage report       |
| `pnpm storybook`       | Storybook (port 6006)            |

### CI Commands

| Command                  | Description                      |
| ------------------------ | -------------------------------- |
| `pnpm test:unit:ci`      | Unit tests with coverage/reports |
| `pnpm test:storybook:ci` | Storybook tests with reports     |
| `pnpm test:e2e:ci`       | E2E tests with reports           |
