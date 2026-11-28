# Project

This project is a React SPA, built with Vite. It uses the feature slice architecture with clean architecture principles.

## Stack

TypeScript SPA. React 19, Vite 8, React Router 8, TanStack Query, Zustand, XState, Chakra UI, i18next. Testing: Vitest, Storybook, Playwright, MSW. The test strategy is in `docs/tests/README.md`.

## Commands

- `pnpm dev` — start the dev server (port 5173)
- `pnpm dev:all` — start the frontend (port 5173) and the local API server (port 3001)
- `pnpm typecheck` — do a type check of all sources (src, e2e, stories, tests)
- `pnpm lint --fix` — run lint and fix automatically
- `pnpm test` — run all tests (unit and Storybook)
- `pnpm test:e2e` — run Playwright E2E (headless)
- `pnpm test:visual:docker` — run visual regression tests in the pinned container
- `pnpm storybook` — start component development (port 6006)

Package manager: only PNPM. Path alias: `@/*` → `src/`.

## Core Principles

- **Simplicity first** — make each change as simple as possible. Change as little code as possible. Choose the boring solution.
- **Surgical changes** — change only what the task needs. Do not refactor, reformat or "improve" the code near your change. Remove only the orphans that your own changes make.
- If you are not sure about requirements or business logic, ask the developer. Never assume.
- For changes of more than 300 LOC or more than 3 files, ask for confirmation before you continue.
- Stay in the context of the current task. If a fresh start is necessary, tell the dev.
- Change API contracts only with explicit approval.
- Use git commands only when the dev explicitly asks.

## Communication

- Work silently between tool calls. Your first text in a turn is a result or a question.
- Stop and report in these cases:
  - Different readings of the requirements or code give different code.
  - You checked 3 or more places and did not find the answer to the same question.
  - Your approach failed two times.
- In the report, write one line about what is not clear, the options, and what you need from me. Then wait. Never choose an interpretation silently.
- Keep reports, options and summaries very concise, with high information density. But write full sentences in Simplified Technical English (`docs/writing-style.md`).
- Final reply: the outcome first. Then the assumptions, risks and commands to run, if there are any.
- Always report these items in full: errors, failed tests, security or data-loss risks, and confirmations before destructive actions.

## Workflow

**1. Plan Mode Default**

- Enter plan mode for each task that is not trivial (3 or more steps, or architectural decisions).
- If something goes wrong, STOP and make a new plan immediately. Do not continue.
- For complex features, write or ask for a spec before implementation.

**2. Self-Improvement Loop**

- A correction can show an error that will probably occur again: you made it again, or you made it although a rule, doc or warning exists. Then add a lesson to the end of the `## Inbox` of `specs/lessons.md` (`Status: new`, the template is in the file). If you are not sure, ask: `Record as lesson? <one-line summary>`
- End that reply with one line: `Lesson captured: L<NNN> — <title> (untriaged)`
- Never edit rules, skills or docs because of a lesson. The dev promotes lessons with `/triage-lessons`.

**3. Verification On Demand**

- Do not run typecheck, lint or tests, and do not add verification steps to plans, unless the dev asks.
- Report the real output. A step that you did not run is `SKIPPED`, never `PASS`.

**4. Demand Elegance (Balanced)**

- For changes that are not trivial, ask: "Is there a more elegant solution?"
- If a fix seems like a hack, ask: "With all that I know now, what is the elegant solution?" Then implement it.
- Do not do this for simple fixes. Do not over-engineer.

**5. Autonomous Bug Fixing**

- When you get a bug report, fix it. Do not ask for help.
- Use logs, errors and failed tests to find the cause. The developer must not need to change context.

**6. Spec-Driven Development**

- For features that touch 5 or more files, or have 5 or more open decisions, first write a spec with the `writing-spec` skill.
- When you implement a spec, read the `building-blocks` rule file for each block in the Building Blocks Diff before you write code. That rule file is the canonical pattern. Do not examine existing files to find patterns. Read existing files only for integration points (imports, symbols, types).
- If a rule file is missing or not clear, report the gap. Do not examine the codebase instead.
- Do not do this when the developer opts out.

## Conventions

- Use `AIDEV-NOTE:`, `AIDEV-TODO:` and `AIDEV-QUESTION:` anchors near code that is not trivial. This is an exception to the rule of no comments.
