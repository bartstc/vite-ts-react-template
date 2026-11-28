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

| Type        | Location                                 | Tool                                            |
| ----------- | ---------------------------------------- | ----------------------------------------------- |
| Unit        | `.test.ts` / `.test.tsx` next to the src | Vitest                                          |
| Storybook   | `.stories.tsx` next to the components    | Storybook                                       |
| Visual      | `.stories.tsx` with the tag `visual`     | Vitest `toMatchScreenshot` (`pnpm test:visual`) |
| E2E         | `e2e/` directory                         | Playwright                                      |
| API mocking | `test-lib/handlers/`                     | MSW                                             |
| Fixtures    | `test-lib/fixtures/`                     | Custom                                          |

## How to Run Tests

- The Storybook suite needs `/dev/shm` >= 1g (the devcontainer sets it). On an older container, browser-crash errors mean that you must run the tests serially: `pnpm test:storybook --run --fileParallelism=false`

## AI Boundaries

- Write new test files and business logic without approval.
- Change existing tests when the change is mechanical (renames, API updates, imports, type fixes). Ask first when the change alters the intent: assertions, setup, scenario or expectations.
- Never delete a test unless the dev explicitly asks.
- Analyze test failures to help find the cause.

## Test Priorities

- Give priority to these cases: the happy path with realistic data, error conditions that the user sees, and edge cases that have an effect on business logic.
- Each test checks a different behavior. Do not write many variations that go through the same code path.
- Do not write redundant cases: empty arrays when a "not found" case exists, `undefined` when the types prevent it.

## Where the rules are

- How to write each type of test: the `test-building-blocks` skill. Read the rule file of the block before you write a test.
- Why (tiers, MSW as the mocking seam, when a stub is justified, design-smell signals): `docs/tests/README.md`
- Visual regression (which stories, determinism, baselines): `docs/tests/visual-testing.md`. Screenshots are only in stories with the tag `visual`, never in E2E.
- E2E (which paths, API seeding, data isolation, what you may mock): `docs/tests/e2e-testing.md`. How to write an E2E test: the `e2e-testing` skill.
