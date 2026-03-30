---
paths:
  - "**/*.test.ts"
  - "**/*.test.tsx"
  - "**/*.spec.ts"
  - "**/*.spec.tsx"
  - "e2e/**"
---

# Testing

## Testing Strategy

| Type            | Location                                  | Tool       |
| --------------- | ----------------------------------------- | ---------- |
| Unit tests      | `.test.ts` / `.test.tsx` alongside source | Vitest     |
| Storybook tests | `.stories.tsx` alongside components       | Storybook  |
| E2E tests       | `e2e/` directory                          | Playwright |
| API mocking     | `test-lib/handlers/`                      | MSW        |
| Test fixtures   | `test-lib/fixtures/`                      | Custom     |

## AI Boundaries

| What           | AI CAN Do                                 | AI MUST NOT Do                  |
| -------------- | ----------------------------------------- | ------------------------------- |
| Implementation | Generate business logic; create new tests | Modify existing test files      |
| Test Planning  | Write new test files when asked           | Edit existing test expectations |
| Debugging      | Analyze test failures                     | Change existing test code       |

## Test Case Scenarios

**Prioritize tests for:**

- Happy path scenarios with realistic data
- Error conditions users might encounter
- Edge cases that affect business logic (not just coverage)

**Avoid redundant edge cases:**

- Empty arrays when "not found" is already tested
- `undefined` collections when type system prevents this
- Multiple variations of the same error condition

Each test should verify **distinct behavior**, not different ways to trigger the same code path.
