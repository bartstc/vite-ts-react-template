# Project

React SPA built with Vite using feature slice architecture with clean architecture principles.

## Stack

TypeScript SPA. React 19, Vite 7, React Router 7, TanStack Query, Zustand, XState, Chakra UI, i18next. Testing: Vitest, Storybook, Playwright, MSW.

## Commands

- `pnpm dev` — start dev server (port 5173)
- `pnpm lint --fix` — lint and auto-fix
- `pnpm test` — all tests (unit + storybook)
- `pnpm test:e2e` — Playwright E2E (headless)
- `pnpm storybook` — component dev (port 6006)

Package manager: PNPM only. Path alias: `@/*` → `src/`.

## Core Principles

- **Simplicity first** — make every change as simple as possible, minimize code impact, choose the boring solution
- When unsure about requirements or business logic, ask the developer — never assume
- For changes >300 LOC or >3 files, ask for confirmation before proceeding
- Stay within current task context; inform dev if fresh start needed
- Modify API contracts only with explicit approval
- Use git commands only when explicitly requested
- Keep reports, options, and summaries extremely concise — prioritize information density

## Workflow

**1. Plan Mode Default**

- Enter plan mode for any non-trivial task (3+ steps or architectural decisions)
- If something goes wrong, STOP and re-plan immediately — do not keep pushing
- For complex features, write or request a spec before implementation
- Use plan mode for verification steps, not just building

**2. Self-Improvement Loop**

- After any correction, capture the pattern in `tasks/lessons.md` and write a rule to prevent recurrence
- Review `tasks/lessons.md` at the start of each session
- Ruthlessly iterate on lessons until the mistake rate drops

**3. Verification Before Done**

- Never mark a task complete without proving it works
- Run tests, check logs, and demonstrate correctness
- Ask: "Would a staff engineer approve this?"

**4. Demand Elegance (Balanced)**

- For non-trivial changes, ask: "Is there a more elegant solution?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple fixes — do not over-engineer

**5. Autonomous Bug Fixing**

- When given a bug report: just fix it
- Use logs, errors, and failing tests to diagnose — require zero context switching from the developer

## Conventions

- Use `AIDEV-NOTE:`, `AIDEV-TODO:`, `AIDEV-QUESTION:` anchors near non-trivial code (exception to no-comments rule)

## Reference Docs

- Read `docs/architecture.md` when adding features, modifying project structure, or making architectural decisions
