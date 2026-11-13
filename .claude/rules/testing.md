---
paths:
  - "**/*.test.ts"
  - "**/*.test.tsx"
  - "**/*.spec.ts"
  - "**/*.spec.tsx"
  - "**/*.stories.tsx"
  - "**/__screenshots__/**"
  - "e2e/**"
---

# Testing

## Tools

| Type        | Location                            | Tool                                            |
| ----------- | ----------------------------------- | ----------------------------------------------- |
| Unit        | `.test.ts` / `.test.tsx` beside src | Vitest                                          |
| Storybook   | `.stories.tsx` beside components    | Storybook                                       |
| Visual      | `.stories.tsx` tagged `visual`      | Vitest `toMatchScreenshot` (`pnpm test:visual`) |
| E2E         | `e2e/` directory                    | Playwright                                      |
| API mocking | `test-lib/handlers/`                | MSW                                             |
| Fixtures    | `test-lib/fixtures/`                | Custom                                          |

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

## Where the rules live

- How to write each kind of test: `test-building-blocks` skill — read the block's rule file before writing a test
- Why (tiers, MSW as the mocking seam, when a stub is justified, design-smell signals): `docs/testing.md`
- Visual regression (which stories, determinism, baselines): `docs/visual-testing.md`. Screenshots only in stories tagged `visual`, never in E2E
- E2E (which paths, API seeding, data isolation, what may be mocked): `docs/e2e-testing.md`; how to write one: `e2e-testing` skill
