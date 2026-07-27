---
paths:
  - "**/*.test.ts"
  - "**/*.test.tsx"
  - "**/*.spec.ts"
  - "**/*.spec.tsx"
  - "e2e/**"
---

# Testing

## Tools

| Type        | Location                            | Tool       |
| ----------- | ----------------------------------- | ---------- |
| Unit        | `.test.ts` / `.test.tsx` beside src | Vitest     |
| Storybook   | `.stories.tsx` beside components    | Storybook  |
| E2E         | `e2e/` directory                    | Playwright |
| API mocking | `test-lib/handlers/`                | MSW        |
| Fixtures    | `test-lib/fixtures/`                | Custom     |

## Running Tests

- Storybook suite needs `/dev/shm` >= 1g (devcontainer sets it). On an older container, browser-crash errors mean serial runs: `pnpm test:storybook --run --fileParallelism=false`

## AI Boundaries

- Generate new test files and business logic freely
- Modify existing tests when change is mechanical (renames, API updates, imports, type fixes). Ask first when change alters intent — assertions, setup, scenario, or expectations
- Never delete a test without explicit request
- Analyze test failures to help debug

## Test Priorities

- Prioritize: happy path with realistic data, user-facing error conditions, edge cases affecting business logic
- Each test verifies distinct behavior — avoid multiple variations triggering the same code path
- Skip redundant cases: empty arrays when "not found" is covered, `undefined` when types prevent it
