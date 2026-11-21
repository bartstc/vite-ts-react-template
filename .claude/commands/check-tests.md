# Run tests related to changed code: $ARGUMENTS

Dev-triggered only. Run separately from `/check`.

## Steps

1. List changed files: `git diff --name-only --diff-filter=d core...HEAD` plus `git status --porcelain`. Keep source files under `src/` that still exist.
2. Run `pnpm exec vitest related --run <changed files>` (unit + storybook projects).
3. On failure, decide whether the code or the test is wrong. Fix the code unless the test encodes outdated behavior the task intentionally changed — then say so explicitly. Rerun. Stop after 3 rounds.

## Rules

- E2E (`pnpm test:e2e`) and visual (`pnpm test:visual:docker`) run only if `$ARGUMENTS` asks for them.
- Never skip, delete, or weaken assertions to make tests pass.
- Report: tests run, PASS/FAIL counts, fixes made, full output of anything still failing.
