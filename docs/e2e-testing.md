# E2E Testing Practices

Why we write Playwright E2E tests the way we do: what this tier owns, how tests get their data, what may be mocked, how
to wait, and which signals mean the app or the test design should change instead of the test. It extends
[testing.md](./testing.md), which covers the unit and component tiers.

The `e2e-testing` skill says how to write a journey test and the pieces it uses (page objects, fixtures, forms). This document
gives the reasoning, so a rule can be applied to a case it does not mention. When the two disagree, fix whichever is
wrong.

Audience: developers writing or reviewing E2E tests, and anyone changing the `e2e-testing` skill. An agent writing a
test needs only the skill; it reads this document when a case is not covered there.

## 1. What E2E owns

| Tier                                | Proves                                                           | Fakes                       |
| ----------------------------------- | ---------------------------------------------------------------- | --------------------------- |
| Unit (Vitest)                       | Pure logic, machines, `lib/api/` request shape and error mapping | Network (MSW)               |
| Component (Storybook, real browser) | One feature's states, branches, validation and multi-step flows  | Network (MSW)               |
| **E2E (Playwright)**                | **Critical business paths across pages, against the real API**   | Third parties and time only |

E2E proves what no lower tier can:

- Pages are wired together: a link, redirect or guard lands on the right route with the right state.
- Auth and session work: sign in, sign out, protected routes.
- **The contract with our API holds.** MSW handlers in lower tiers are our _belief_ about the API; E2E is where the
  belief meets the real server — the payload the UI sends is accepted, the response it gets renders.
- State survives navigation and reload: created entities appear in lists, edits persist.

Visual regression is owned by the component tier ([visual-testing.md](./visual-testing.md)). E2E may later add at most
3–5 full-page screenshots of the app shell, Chromium only, with every data-bearing region masked. Never screenshot
unmasked real data.

**Overlap with stories is expected.** A business path walks through screens that stories already cover. That is fine:
the path is a different behaviour from its steps. What E2E does not do is re-enumerate them. A story owns _every_
validation message and _every_ state of a screen; the E2E path goes through the screen once, on the route the business
cares about, and asserts the outcome only the real stack can show. A failure path belongs in E2E only when it is
critical and depends on the real server (rejected credentials, a conflict the backend detects).

**Choosing paths.** Ask: _if this broke in production, would we roll back?_ If yes, it is a candidate. Then: _does it
cross pages or depend on the real API?_ If no, a story is enough. Keep a handful of paths per area. One test per path,
with `test.step` phases — not one test per step, because a step-sized test has to fake what the previous step produced.

## 2. Principles

### 2.1 Arrange through the API, act through the UI

Everything the path needs before it starts is created through the API in a fixture, using Playwright's `request`
fixture. Only the behaviour under test goes through the UI.

UI setup is slow, and it fails for reasons unrelated to the path: one broken form turns every test that clicks through
it red and hides where the real failure is. API setup is fast and deterministic, and the fixture name states the
precondition.

- Seeding helpers are typed with the app's DTO types (imported, not redeclared) and throw with status and body when the
  request fails, so a setup failure is never mistaken for a UI failure.
- Helpers never touch `page` and never assert on UI.
- If the API cannot create a precondition, that is a finding — propose a seed or test-only endpoint; do not fall back to
  UI setup silently.

### 2.2 Data isolation

Every test must pass alone, in any order, and never depend on another test's leftovers. There are two ways to get
there, and the choice decides how the suite may run in parallel:

| Strategy                                                                             | Parallel workers | Fits                                                      |
| ------------------------------------------------------------------------------------ | ---------------- | --------------------------------------------------------- |
| **Reset to seed** — an automatic fixture resets the shared database before each test | One              | A local API with a reset endpoint and a small suite       |
| **Own your data** — each test creates uniquely named data and deletes it in teardown | Many             | A shared environment, or a suite too slow to run serially |

Never combine a global reset with parallel workers: one worker's reset wipes another's data mid-test.

With **own your data**: names are unique per test (include `testInfo.workerIndex` and a timestamp); cleanup goes after
`await use(...)` in the fixture, which runs even when the test fails; fixtures are test-scoped unless the data is
expensive and read-only. Entities the API cannot create (usually users) are seeded reference data — one per worker when
tests mutate them.

### 2.3 Mock only the outside world

The same rule as the lower tiers — mock at the edge of our system — but in E2E the edge moves: our API is part of the
system under test, so it stays real. Exercising it is the point of the tier.

`page.route` and `page.clock` are allowed only for:

1. **Third-party services** we do not own and cannot run locally (payments, maps, external identity providers,
   analytics). Abort analytics globally in a fixture.
2. **Time** (`page.clock`), installed before navigation.
3. **Browser capabilities**: grant permissions or set geolocation on the context; receive downloads with
   `page.waitForEvent("download")`.

Every double has a one-line comment naming which case it falls under. Routed bodies are typed. **Routing our own API is
never justified**: if reaching a state needs a specific API response, seed that state (§2.1) or move the test to a
story with MSW. Neither is stubbing app modules or adding test-only flags to production code.

### 2.4 Wait for and assert what the user sees

The user waits for the screen, not for the network, so the test does too. Locator actions wait until an element can be
used, and web-first assertions retry until they pass or time out; they are the only waiting mechanism. A sleep is slow
and still flaky, `networkidle` never settles in an app that polls, and a value read once (`isVisible()`,
`textContent()`) passes or fails on timing luck.

Assertions check what the user sees first: text, roles, visibility, URL. A backend effect the UI does not show is
checked through the API. Every test ends with an assertion that fails if the path broke, and a negative assertion
needs a positive control, or it passes when the page never loaded.

Waiting on the network is a last resort, for a result no UI reflects. It lives in the test, never in a page object:
the page object describes the UI, and an API URL there is hidden coupling every caller pays for. A save the user cannot
see complete is also a UX gap worth reporting.

## 3. Page objects

Page objects hide _how_ to find and drive the UI; the test decides _what_ to check.

- They expose `readonly` locators; tests assert on them with web-first matchers. "Tests own assertions" means the
  `expect` is in the test — not that the page object returns snapshot values.
- Multi-control actions (fill and submit) are methods. Navigation methods end with a readiness check and return the
  target page object — the only assertion a page object may contain.
- No transport details (URLs of API calls, status codes, `waitForResponse`), no CSS/XPath. Shared UI is
  a component object scoped by a root locator, composed into pages.
- Transient UI (toasts) is asserted in the test, not kept as a page-object property.

## 4. Conventions

- **Locators**: role and accessible name, then label, then text; `getByTestId` last, with a comment. A role you cannot
  select is an accessibility finding in the component. Anchor overlapping names (`/^next$/i`), scope repeated controls
  to their container, filter by content instead of `nth`. Strict-mode errors are fixed by a better locator.
- **Text**: tests run in one fixed locale; match the meaningful part with a regex, not whole sentences.
- **Structure**: `e2e/tests/<area>/<path>.spec.ts`; test names state the user outcome; phases in `test.step`.
- **Auth**: a setup project signs in once per role and saves `storageState`; tests load it. Tests of sign-in itself
  start from an empty state. Saved state lives in a git-ignored folder; credentials come from env variables and never
  appear in names, steps or logs.
- **Determinism**: fixed `locale` and `timezoneId` in config, matching the unit tier. Random values in names are fine;
  assertions only use values the test created.
- **App imports**: E2E code may import types and pure constants (DTOs, enums, route paths) and `src/test-lib/` fixtures.
  Never components, hooks or stores.
- **Tags**: `@smoke` for the minimal per-PR set, area tags for subsets (`--grep @area`). Never tag by flakiness.
- **Timeouts**: never raise global timeouts to hide slowness; mark one slow test with `test.slow()` and a comment.

## 5. Flakiness

A flaky test teaches the team to ignore red builds, so it is a bug, not a pass.

- Retries run in CI only, with `trace: "on-first-retry"`, so every retry leaves a trace. Set `failOnFlakyTests` in CI
  so a pass-on-retry fails the build.
- Before review, run new or changed tests with `--repeat-each=10` (and several workers, if the suite runs in parallel).
- Diagnose from the trace. Do not add waits, retries or `force`.
- Quarantine with `test.fixme()` and a ticket reference. Never delete a flaky test silently.
- Usual causes, most frequent first: one-shot assertions, shared data between tests, waiting on the network instead of
  the UI, animations, the real clock, strict-mode violations hidden by `.first()`.

## 6. Design-smell signals

Pain in an E2E test is feedback about the app or the test design. Fix the cause, not the test.

| Signal in the test                           | Likely cause                                          | Fix                                                 |
| -------------------------------------------- | ----------------------------------------------------- | --------------------------------------------------- |
| Sleeps, `networkidle`, custom wait helpers   | No user-visible readiness signal                      | Assert UI state; add a loading/ready indicator      |
| Fails alone or in a different order          | Shared or leaked data                                 | Reset or own data per test (§2.2)                   |
| Long UI clicking before the path starts      | Missing API seeding                                   | Seed through `request`; add an endpoint if missing  |
| `getByTestId` everywhere                     | Missing roles or accessible names                     | Fix the component                                   |
| `.first()` / `.nth()` to silence strict mode | Duplicate names or a too-broad locator                | Scope by container, or give elements distinct names |
| `page.route` on our own API                  | Component-tier concern written as E2E                 | Seed the state, or move the test to a story         |
| `force: true`                                | An overlay or animation intercepts the pointer        | Fix the overlay; assert it is gone first            |
| Page object with ~15 locators / ~10 methods  | Several workflows in one class                        | Split into component objects                        |
| Test enumerates a screen's states or fields  | Story-tier concern written as E2E                     | Keep one path in E2E; move the matrix to stories    |
| Needs a test-only flag in production code    | Precondition not reachable through the real interface | Make it seedable through the API                    |
| Passes only on retry                         | Race or timing dependence                             | Treat as a bug; find it in the trace                |

## 7. Review checklist

- [ ] The path is critical and crosses pages or the real API; no story or unit test can prove it alone.
- [ ] `test`/`expect` from the fixtures module; page objects from fixtures.
- [ ] Preconditions seeded through the API; the test passes alone and in any order.
- [ ] No sleeps, `networkidle`, `waitForSelector`, one-shot assertions or unexplained `force`.
- [ ] No `page.route` on our own API; every double has a reason comment.
- [ ] Locators role-first; every `getByTestId` justified; no `.first()` silencing strictness.
- [ ] Phases in `test.step`; the final assertion fails if the path broke.
- [ ] No credentials in code, names, steps or logs.
- [ ] Page objects hold no business assertions and no transport details.

## 8. References

- Playwright: [Best practices](https://playwright.dev/docs/best-practices), [Page object models](https://playwright.dev/docs/pom),
  [Fixtures](https://playwright.dev/docs/test-fixtures), [Authentication](https://playwright.dev/docs/auth),
  [Assertions](https://playwright.dev/docs/test-assertions), [Locators](https://playwright.dev/docs/locators),
  [Mock APIs](https://playwright.dev/docs/mock), [Clock](https://playwright.dev/docs/clock),
  [Retries](https://playwright.dev/docs/test-retries).
- [_Software Engineering at Google_, ch. 14 — Larger testing](https://abseil.io/resources/swe-book/html/ch14.html).
- Fowler, [On the Diverse and Fantastical Shapes of Testing](https://martinfowler.com/articles/2021-test-shapes.html).
