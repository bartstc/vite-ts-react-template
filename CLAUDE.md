# CLAUDE.md

React SPA built with Vite using feature slice architecture with clean architecture principles.

## Golden Rules

- When unsure about implementation details, requirements, or business logic, ALWAYS consult the developer rather than making assumptions.
- We optimize for maintainability over cleverness. When in doubt, choose the boring solution.
- When reporting information, options, pros/cons, or summarizing changes, be extremely concise—sacrifice grammar if needed.
- Keep plans and documentation concise yet detailed—prioritize information density over formatting.

| #   | AI _may_ do                                                                                      | AI _must NOT_ do                                                                                    |
| --- | ------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| G-0 | Ask for clarification when unsure about project-specific details                                 | Write changes without context for a feature/decision                                                |
| G-1 | Generate code in `src/features/`, `src/lib/api/`, `src/pages/`, or explicitly pointed files      | Touch files beyond `src` and `e2e`, or `*.stories.tsx` / `*.test.tsx` / `*.spec.ts` without request |
| G-2 | Add/update `AIDEV-NOTE:` anchor comments near non-trivial code (exception to "no comments" rule) | Delete or mangle existing `AIDEV-` comments                                                         |
| G-3 | Follow lint/style configs (`.prettierrc`, `.eslint.config.mjs`)                                  | Re-format code to any other style                                                                   |
| G-4 | For changes >300 LOC or >3 files, ask for confirmation                                           | Refactor large modules without human guidance                                                       |
| G-5 | Stay within current task context; inform dev if fresh start needed                               | Continue work from prior prompt after "new task"                                                    |
| G-6 | Modify API contracts only with explicit approval and documentation                               | Change API contracts without approval                                                               |
| G-7 | Use git commands only when explicitly requested                                                  | Stage, commit, or push without explicit request                                                     |

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

## Path Resolution

Uses `@/*` path mapping for imports from `src/` (e.g., `import { Button } from '@/lib/components/button'`)

## Detailed Guidelines

- [Architecture](.claude/docs/architecture.md) - Tech stack, project structure, patterns, state management
- [Code Style](.claude/docs/code-style.md) - TypeScript, React, and general coding standards
- [Testing](.claude/docs/testing.md) - Testing strategy, AI boundaries, test case preferences
- [Workflow](.claude/docs/workflow.md) - Planning process, repository scanning, anchor comments
