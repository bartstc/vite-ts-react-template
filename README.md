# SPA Vite Template

An opinionated, production-ready starter for **Single Page Application** development with React. Pre-configured tooling, libraries, and a demo app so you can skip the boilerplate and focus on building.

## What's included

### Developer experience

- [Vite](https://vitejs.dev/) — fast dev server and build tooling
- [TypeScript](https://www.typescriptlang.org/) — strict type safety
- [ESLint](https://eslint.org/) + [Prettier](https://prettier.io/) + [Husky](https://typicode.github.io/husky/) — consistent code style
- [PNPM](https://pnpm.io/) — fast, disk-efficient package manager
- [Devcontainer](https://code.visualstudio.com/docs/devcontainers/containers) — reproducible VS Code dev environment
- [GitHub Actions](https://docs.github.com/en/actions) CI — tests, build, coverage reports, deploy draft
- [GitHub Copilot](https://github.com/features/copilot) — instructions, skills, and custom prompts (`.github/instructions/`, `.github/skills/`, `.github/prompts/`)
- [Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview) — project rules (`CLAUDE.md`), skills, subagents, and custom commands (`.claude/`)

### Testing

- [Vitest](https://vitest.dev/) — unit and integration tests
- [Storybook](https://storybook.js.org/) — component tests in a real browser
- [Playwright](https://playwright.dev/) — E2E tests across Chromium, Firefox, and WebKit

### Libraries

- [Chakra UI](https://chakra-ui.com/) — accessible, modular component library
- [React Router 7](https://reactrouter.com/home) — routing with strong path typing
- [React Query](https://tanstack.com/query/v4/) — data fetching and server state synchronization
- [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction) — lightweight state management
- [i18next](https://www.i18next.com/) — internationalization
- [XState](https://stately.ai/docs/xstate) — state orchestration (example usage)
- [React Hook Form](https://react-hook-form.com) - form state management with light and composable abstraction
- [MSW 2](https://mswjs.io/) — API mocking for development and tests

### Architecture

```
src/        React SPA (features, pages, lib)
server/     Local Fastify API server (dev/demo)
e2e/        Playwright end-to-end tests
```

- Feature slice architecture with clean architecture principles — each feature has four layers (`components/`, `application/`, `providers/`, `models/`) with strict dependency rules
- Centralized API layer with endpoint-based organization and type consolidation
- Spec-driven development for AI-assisted workflows — four-phase gated spec process, typed building block patterns, and a self-improvement loop
- Formatting utilities for numbers, monetary values, and dates
- File naming: PascalCase for React components/stories/page objects, kebab-case for everything else
- A demo app with authentication showcasing the project structure and tooling in action (powered by a local Fastify server in `server/`)
- Read more: [`docs/architecture.md`](docs/architecture.md)

### AI-assisted development

This project uses spec-driven development for non-trivial features. Instead of prompting an AI agent to "build X," you collaboratively write a short spec (80–150 lines) that constrains intent, design, and sequencing before any code is written.

- **Spec workflow** — four-phase gated process: Goal & Scope → Design → Sequencing → Review. Each phase requires developer approval before proceeding.
- **Building blocks catalog** — typed patterns (mutations, queries, stores, components, hooks, models) that specs reference by name. The agent reads the pattern before implementing.
- **Self-improvement loop** — lessons from past implementations accumulate in `specs/lessons.md` and feed back into future sessions.
- Read more: [`docs/spec-development-docs.md`](docs/spec-development-docs.md)

## Getting started

Clone the repo and set up your own remote:

```
git clone --depth 1 https://github.com/bartstc/spa-vite-template.git [project_name]
cd [project_name]
rm -rf .git && git init
git remote add origin git@github.com:username/project.git
```

### Dev environment

It's recommended to run the dev server inside a container for consistent Node/PNPM versions. If you're using VS Code, the included [devcontainer config](https://code.visualstudio.com/docs/devcontainers/containers) handles this out of the box.

## Commands

| Command                | Description                                |
| ---------------------- | ------------------------------------------ |
| `pnpm dev`             | Dev server with HMR on port `5173`         |
| `pnpm dev:server`      | Local API server only on port `3001`       |
| `pnpm dev:all`         | Frontend + API server together             |
| `pnpm lint`            | Check for lint errors                      |
| `pnpm build`           | Production build                           |
| `pnpm test`            | Run all tests (unit + storybook)           |
| `pnpm test:unit`       | Unit tests only                            |
| `pnpm test:storybook`  | Storybook component tests only             |
| `pnpm test:coverage`   | Tests with coverage report                 |
| `pnpm test:e2e`        | E2E tests (headless)                       |
| `pnpm test:e2e:ui`     | E2E in interactive web UI mode             |
| `pnpm test:e2e:headed` | E2E with visible browser                   |
| `pnpm test:e2e:debug`  | E2E in debug mode                          |
| `pnpm test:e2e:report` | Open the HTML report from the last E2E run |
| `pnpm storybook`       | Storybook on port `6006`                   |

## Testing strategy

### Unit tests (`*.test.ts`, `*.test.tsx`)

- **Environment**: jsdom
- **Location**: Co-located with source files in `src/`
- **Run with**: `pnpm test:unit`

### Component tests (`*.stories.tsx`)

- **Environment**: Real browser (Chromium) via @vitest/browser-playwright
- **Location**: Co-located with components in `src/`
- **Run with**: `pnpm test:storybook`

### E2E tests (`*.spec.ts`)

- **Environment**: Chromium, Firefox, and WebKit via @playwright/test
- **Location**: `e2e/`
- **Run with**: `pnpm test:e2e`

## Removing libraries you don't need

This template is opinionated — it picks libraries so you don't have to. If something doesn't fit your project, here's how to strip it out:

| Library      | What to remove                                                                         |
| ------------ | -------------------------------------------------------------------------------------- |
| Chakra UI    | `src/lib/components/`, Chakra provider in `src/app/`, `@chakra-ui/*` deps              |
| React Router | `src/pages/`, route config in `src/app/`, `react-router` dep                           |
| React Query  | Query provider in `src/app/`, `src/lib/api/` query hooks, `@tanstack/react-query` deps |
| i18next      | `src/lib/i18n/`, i18n provider in `src/app/`, `i18next` + `react-i18next` deps         |
| Zustand      | Store files in `src/features/*/stores/`, `zustand` dep                                 |
| XState       | State machine files (example usage), `xstate` + `@xstate/react` deps                   |
| MSW          | `src/test-lib/handlers/`, `msw` dep, browser/server setup files                        |

After removing, run `pnpm install` to clean the lockfile and `pnpm lint` to catch broken imports.

## Contributing

Open for contributions — bugfixes, new features, and extra modules are welcome.

- **Code**: Fork the repo, push your changes, and submit a pull request.
- **Bugs**: Report issues via [GitHub Issues](https://github.com/bartstc/spa-vite-template/issues).

## License

[MIT](https://github.com/bartstc/vite-ts-react-template/blob/core/LICENSE)
