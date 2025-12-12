---
applyTo: "**/*.test.{ts,tsx}"
---

## Testing Discipline

| What           | AI CAN Do               | AI MUST NOT Do           |
| -------------- | ----------------------- | ------------------------ |
| Implementation | Generate business logic | Touch test files         |
| Test Planning  | Suggest test scenarios  | Write test code          |
| Debugging      | Analyze test failures   | Modify test expectations |

### Test Case Scenarios Preference

- Focus on **business logic and domain requirements**, not implementation details
- Test **meaningful scenarios** that could realistically occur in production
- Keep test scenarios focused on single responsibilities
- Avoid redundant edge cases like:
  - Empty arrays when "not found" is already tested
  - `undefined` collections when the type system prevents this
  - Multiple variations of the same error condition
- Prioritize tests for:
  - Happy path scenarios with realistic data
  - Error conditions that users might encounter
  - Edge cases that affect business logic (not just code coverage)
- Each test should verify **distinct behavior**, not just different ways to trigger the same code path
