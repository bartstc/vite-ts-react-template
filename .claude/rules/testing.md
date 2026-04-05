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

## AI Boundaries

- Generate new test files and business logic freely
- Analyze test failures to help debug
- Never modify existing test files or change existing test expectations without explicit request

## Test Priorities

- Prioritize: happy path with realistic data, user-facing error conditions, edge cases affecting business logic
- Each test verifies distinct behavior — avoid multiple variations triggering the same code path
- Skip redundant cases: empty arrays when "not found" is covered, `undefined` when types prevent it
