---
name: playwright-page-objects
description: Enterprise Playwright Page Object Model architecture for React applications. Use when designing E2E test structure, creating page objects, implementing fixtures, or writing component-level test helpers.
---

# Playwright Page Objects

Modern POM architecture using Playwright's fixtures pattern, composition over inheritance, and role-based locators.

## When to Apply

Use this skill when:

- Setting up E2E test architecture from scratch
- Creating new page objects or component helpers
- Implementing test fixtures for dependency injection
- Refactoring existing page objects for maintainability
- Writing reusable component-level test abstractions

## Quick Reference

| Pattern             | When to Use                                | Reference                                                     |
| ------------------- | ------------------------------------------ | ------------------------------------------------------------- |
| Fixtures            | Always for page object instantiation       | [fixtures-pattern.md](references/fixtures-pattern.md)         |
| Composition         | Shared UI elements (header, cards, modals) | [composition-patterns.md](references/composition-patterns.md) |
| Role-based locators | All interactive elements                   | [locator-strategies.md](references/locator-strategies.md)     |
| Fluent interfaces   | Multi-step forms, wizards                  | [form-handling.md](references/form-handling.md)               |
| Readonly locators   | All page object properties                 | [typescript-patterns.md](references/typescript-patterns.md)   |

## Core Principles

1. **Fixtures over PageManager** — On-demand instantiation, automatic setup/teardown
2. **Composition over inheritance** — Compose from focused components, avoid deep hierarchies
3. **Role-based selectors first** — `getByRole()` > `getByLabel()` > `getByTestId()`
4. **Assertions in tests** — Page objects expose state, tests make assertions
5. **Separate pages by workflow** — ProductListPage ≠ ProductDetailsPage

## Recommended Folder Structure

```
e2e/
├── pages/
│   ├── index.ts                 # Fixtures setup (extends base.test)
│   ├── base/
│   │   └── BasePage.ts
│   ├── auth/
│   │   └── SignInPage.ts
│   ├── products/
│   │   ├── ProductListPage.ts
│   │   └── ProductDetailsPage.ts
│   ├── cart/
│   │   └── CartPage.ts
│   ├── checkout/
│   │   └── CheckoutPage.ts
│   └── components/
│       ├── HeaderComponent.ts
│       ├── ProductCardComponent.ts
│       └── ModalComponent.ts
└── tests/
    ├── auth/
    ├── products/
    ├── cart/
    └── checkout/
```

## Locator Priority

```typescript
// 1. Role-based (preferred)
page.getByRole("button", { name: "Add to Cart" });

// 2. Label-based (form inputs)
page.getByLabel("Email");

// 3. Text-based (non-interactive)
page.getByText("Welcome back");

// 4. Placeholder (when no label)
page.getByPlaceholder("Search products...");

// 5. Test ID (escape hatch)
page.getByTestId("cart-item-count");
```

## Anti-Patterns to Avoid

| Anti-Pattern        | Problem                   | Solution                        |
| ------------------- | ------------------------- | ------------------------------- |
| Fat page objects    | 50+ locators, 20+ methods | Split into components           |
| Deep inheritance    | Rigid, hard to modify     | Use composition                 |
| Assertions in POMs  | Hidden test logic         | Expose state, assert in tests   |
| CSS selectors       | Break on styling changes  | Use role-based selectors        |
| Wrapping Playwright | Unnecessary abstraction   | Use Playwright directly         |
| All members public  | Exposes internals         | Mark internal members `private` |

## References

- [Fixtures Pattern](references/fixtures-pattern.md) — Setup and dependency injection
- [Composition Patterns](references/composition-patterns.md) — Component-based architecture
- [Locator Strategies](references/locator-strategies.md) — Selector best practices
- [Page Implementations](references/page-implementations.md) — E-commerce examples
- [Form Handling](references/form-handling.md) — Multi-step flows
- [TypeScript Patterns](references/typescript-patterns.md) — Type-safe POMs
- [Anti-Patterns](references/anti-patterns.md) — What to avoid
