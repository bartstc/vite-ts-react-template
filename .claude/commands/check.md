# Run static checks on changed code: $ARGUMENTS

Dev-triggered only. Run when the dev decides the work is done.

## Steps

1. List changed files: `git diff --name-only --diff-filter=d core...HEAD` plus `git status --porcelain` (staged, unstaged, untracked). Keep `*.ts`, `*.tsx`, `*.mjs` that still exist.
2. Run `pnpm typecheck` (whole project — tsc cannot be scoped to files).
3. Run `pnpm exec eslint --max-warnings 0 <changed files>`.
4. Fix reported errors in changed files only. Rerun steps 2–3. Stop after the first clean pass or after 3 rounds.

## Rules

- Do not run tests — that is `/check-tests`.
- Never add `eslint-disable`, `@ts-ignore`, or `@ts-expect-error` to silence a check. If a rule seems wrong, stop and report.
- Do not fix errors in files outside the changed set — report them.
- Report: typecheck PASS/FAIL, lint PASS/FAIL, files changed by fixes, anything left unresolved with full error output.
