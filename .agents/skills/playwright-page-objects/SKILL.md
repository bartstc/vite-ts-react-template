---
name: playwright-page-objects
description: Use when creating page objects or refactoring Playwright E2E tests for better maintainability with Page Object Model patterns.
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
---

# Playwright Page Objects

Modern POM architecture using Playwright's fixtures pattern, composition over inheritance, and role-based locators.

## When to Apply

- Setting up E2E test architecture from scratch
- Creating new page objects or component helpers
- Implementing test fixtures for dependency injection
- Refactoring existing page objects for maintainability
- Writing reusable component-level test abstractions

## Core Principles

1. **Fixtures over PageManager** — On-demand instantiation, automatic setup/teardown, native TypeScript inference
2. **Composition over inheritance** — Compose from focused components, avoid deep class hierarchies
3. **Role-based selectors first** — `getByRole()` > `getByLabel()` > `getByText()` > `getByTestId()`
4. **Tests own assertions** — Page objects expose state via getters, tests make assertions
5. **Separate pages by workflow** — ProductListPage ≠ ProductDetailsPage (different user interactions)
6. **Readonly locators** — All page object locator properties should be `readonly`
7. **Fluent interfaces** — Methods return `this` for chaining; navigation methods return target page object
8. **Private internals** — Mark implementation details (spinners, retry logic, helpers) as `private`
9. **Wait for stability** — Use `waitForPageLoad()`, `waitForResponse()` before assertions
10. **High-level actions** — Create AppActions class for complex multi-page user flows

## Quick Reference

| Pattern            | When to Use                                | Reference                                             |
| ------------------ | ------------------------------------------ | ----------------------------------------------------- |
| Fixtures           | Always for page object instantiation       | [fixtures-pattern.md](references/fixtures-pattern.md) |
| Basic POM          | All page objects                           | [core-patterns.md](references/core-patterns.md)       |
| Composition        | Shared UI elements (header, cards, modals) | [core-patterns.md](references/core-patterns.md)       |
| Waiting strategies | Loading states, API responses              | [core-patterns.md](references/core-patterns.md)       |
| High-level actions | Multi-page flows (checkout, onboarding)    | [core-patterns.md](references/core-patterns.md)       |
| Form handling      | Multi-step forms, validation               | [form-handling.md](references/form-handling.md)       |

## Locator Priority

```
1. page.getByRole('button', { name: 'Add to Cart' })  // Preferred
2. page.getByLabel('Email')                           // Form inputs
3. page.getByText('Welcome back')                     // Non-interactive
4. page.getByPlaceholder('Search...')                 // When no label
5. page.getByTestId('cart-item-count')                // Escape hatch
```

## Anti-Patterns Summary

| Anti-Pattern        | Problem                     | Solution                        |
| ------------------- | --------------------------- | ------------------------------- |
| Assertions in POMs  | Hidden test logic           | Expose state, assert in tests   |
| Fat page objects    | 50+ locators unmaintainable | Split into components           |
| Deep inheritance    | Rigid, hard to modify       | Use composition                 |
| CSS selectors       | Break on styling changes    | Use role-based selectors        |
| Wrapping Playwright | Unnecessary abstraction     | Use Playwright directly         |
| All members public  | Exposes internals           | Mark internal members `private` |

## References

- [Fixtures Pattern](references/fixtures-pattern.md) — Setup and dependency injection
- [Core Patterns](references/core-patterns.md) — Basic POM, composition, locators, waiting, high-level actions
- [Form Handling](references/form-handling.md) — Multi-step flows, validation components
- [Anti-Patterns](references/anti-patterns.md) — What to avoid
