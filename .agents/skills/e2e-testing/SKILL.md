---
name: e2e-testing
description: Use when writing, reviewing or refactoring Playwright E2E tests — journey tests and the page objects, component objects, fixtures and forms they use. Not for unit or Storybook tests (test-building-blocks).
allowed-tools:
  - Bash
  - Read
  - Write
  - Edit
---

# E2E Testing

How to write a Playwright E2E test in this repo: the journey test, and the pieces it is built from. The rationale (what
E2E owns, data isolation, what may be mocked, flakiness) is in [`docs/e2e-testing.md`](../../../docs/e2e-testing.md).
When the doc, this file and a reference disagree, fix whichever is wrong.

## How to use

1. **Choose the tier.** The path must be critical and cross pages or depend on the real API
   (`docs/e2e-testing.md` §1). If a story or unit test can prove it, say so and stop.
2. **Write the journey test.** Read [journey-test.md](references/journey-test.md).
3. **Build the pieces it needs.** Read the reference for each piece you add or change. Read the UI under test for its
   roles and accessible names.

| Piece                   | When                                                 | Reference                                       |
| ----------------------- | ---------------------------------------------------- | ----------------------------------------------- |
| Journey test            | Every test in a `*.spec.ts`                          | [journey-test.md](references/journey-test.md)   |
| Page / component object | A page or shared UI the test drives                  | [page-objects.md](references/page-objects.md)   |
| Fixture                 | Providing a page object, or seeding data via the API | [fixtures.md](references/fixtures.md)           |
| Forms                   | A page object fills or submits a form                | [forms.md](references/forms.md)                 |
| Anti-patterns           | Reviewing or refactoring                             | [anti-patterns.md](references/anti-patterns.md) |

## Journey principles

1. **One test per critical path**, phases as `test.step`, each step ending with a web-first assertion; the final one
   fails if the path broke.
2. **Fixtures, not `new`.** Specs import `test`/`expect` from the fixtures module and receive page objects and seeded
   data as fixtures.
3. **Arrange through the API, act through the UI.** Preconditions come from data fixtures and saved auth state; only
   the path under test is clicked.
4. **Wait for what the user sees.** Locator actions and web-first assertions are the waiting mechanism. When no UI
   reflects a result, wait for it in the test (`waitForResponse` created before the action, or `expect.poll` on the
   API), never in a page object.
5. **Fill and check only what the path needs.** State and field matrices belong in stories.

## Page object principles

1. **Readonly locators, tests own assertions.** Page objects expose `Locator`s; tests assert with `toBeVisible`,
   `toHaveText`, `toHaveURL`, …. No value getters (`isVisible()`, `textContent()`) feeding `expect`.
2. **Readiness checks only.** The one assertion a page object may contain ends a navigation method.
3. **Navigation returns the target page object**; plain actions return `Promise<void>`.
4. **Composition over inheritance.** No `BasePage`; shared UI is a component object scoped by a root locator.
5. **Separate pages by workflow.** List and details are different page objects.
6. **Private internals.** Helpers and sub-locators tests should not use are `private`.
7. **No transport details.** No API URLs, status codes or `waitForResponse`.
8. **Small.** Split at ~15 locators or ~10 methods.

## Locator priority

```ts
page.getByRole("button", { name: /add to cart/i }); // 1. preferred
page.getByLabel(/email/i); //                           2. form controls
page.getByText(/welcome back/i); //                     3. non-interactive content
page.getByPlaceholder(/search/i); //                    4. no label (an a11y smell)
page.getByTestId("cart-badge"); //                      5. escape hatch — comment why
```

## Never

`waitForTimeout`, `networkidle`, `waitForSelector`, `page.$`, one-shot `expect(await …)` checks, `.first()` to silence
strict mode, `page.route` on our own API, `force: true` without a reason comment. Details and fixes are in
[anti-patterns.md](references/anti-patterns.md).

Not every existing test conforms; many predate these rules.
