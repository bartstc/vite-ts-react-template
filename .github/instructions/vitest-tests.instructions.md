---
applyTo: "**/*.test.{ts,tsx}"
---

### Testing Guidelines (Vitest)

> Note: The guidelines below apply when writing unit tests with Vitest framework.

- Use `describe()` blocks to group related tests by functionality or component
- Write descriptive test names using `it('should ...')` format that clearly state the expected behavior
- Structure tests using Given-When-Then pattern: setup data, perform action, verify results
- Use `beforeEach()` to reset mocks (if any) and setup common test state for isolation
- Use `toStrictEqual()` instead of `toEqual()` for exact object matching
- Use `expect.poll()` for async operations and state changes
- Test both successful and error scenarios
- Use `vi.mock()` for external dependencies and `vi.clearAllMocks()` in `beforeEach()`
- Use existing fixture factories instead of inline object creation
- Mock complex objects as minimal implementations with only required properties
- Keep tests focused on single responsibilities
