# E2E Testing Practices

This document gives the reasons for how we write Playwright E2E tests. It covers what this tier owns, how tests get
their data, what you can mock, how to wait, and which signals show that the app or the test design must change instead
of the test. It extends [README.md](./README.md), which covers the unit and component tiers.

The `e2e-testing` skill tells you how to write a journey test and the parts that it uses (page objects, fixtures,
forms). This document gives the reasons, so that you can apply a rule to a case that the rule does not mention. When
the skill and this document do not agree, fix the one that is wrong.

Audience: developers who write or review E2E tests, and all persons who change the `e2e-testing` skill. An agent that
writes a test needs only the skill. It reads this document when the skill does not cover a case.

## 1. What E2E owns

| Tier                                | Proves                                                                    | Fakes                       |
| ----------------------------------- | ------------------------------------------------------------------------- | --------------------------- |
| Unit (Vitest)                       | Pure logic, machines, request shape and error mapping of `lib/api/`       | Network (MSW)               |
| Component (Storybook, real browser) | The states, branches, validation and flows with many steps of one feature | Network (MSW)               |
| **E2E (Playwright)**                | **Critical business paths across pages, against the real API**            | Only third parties and time |

E2E proves what no lower tier can prove:

- The pages connect correctly: a link, redirect or guard goes to the correct route with the correct state.
- Auth and session work: sign in, sign out, protected routes.
- **The contract with our API is correct.** MSW handlers in lower tiers are our _belief_ about the API. E2E is where
  the belief meets the real server: the server accepts the payload that the UI sends, and the UI shows the response that
  it gets.
- State stays after navigation and reload: created entities show in lists, and edits stay.

E2E tests take no screenshots. The component tier owns visual regression.

**Overlap with stories is expected.** A business path goes through screens that stories already cover. That is
correct, because the path is a different behavior from its steps. But E2E does not list all the steps again. A story
owns _every_ validation message and _every_ state of a screen. The E2E path goes through the screen one time, on the
route that is important to the business. It asserts the result that only the real stack can show. A failure path
belongs in E2E only when it is critical and depends on the real server (rejected credentials, a conflict that the
backend finds).

**How to select paths.** Ask: _if this broke in production, would we roll back?_ If yes, it is a candidate. Then ask:
_does it go across pages or depend on the real API?_ If no, a story is sufficient. Keep a small number of paths for
each area. Write one test for each path, with `test.step` phases. Do not write one test for each step, because a test
of one step must fake what the previous step made.

## 2. Principles

### 2.1 Arrange through the API, act through the UI

A fixture creates all the data that the path needs before it starts. The fixture uses the API through the Playwright
`request` fixture. Only the behavior under test goes through the UI.

Setup through the UI is slow, and it fails for reasons that are not related to the path. One broken form makes red
every test that clicks through it, and it hides where the real failure is. Setup through the API is fast and
deterministic, and the name of the fixture states the precondition.

- Seeding helpers use the DTO types of the app (imported, not declared again). When the request fails, they throw an
  error with the status and body. Thus, nobody thinks that a setup failure is a UI failure.
- Helpers never touch `page` and never assert on UI.
- If the API cannot create a precondition, that is a finding. Propose a seed or an endpoint only for tests. Do not
  change to UI setup silently.

### 2.2 Data isolation

Each test must pass alone and in any order. It must never depend on data that another test left. There are two ways to
get this result, and the choice decides how the suite can run in parallel:

| Strategy                                                                                | Parallel workers | Fits                                                              |
| --------------------------------------------------------------------------------------- | ---------------- | ----------------------------------------------------------------- |
| **Reset to seed** — an automatic fixture resets the shared database before each test    | One              | A local API with a reset endpoint and a small suite               |
| **Own your data** — each test creates data with unique names and deletes it in teardown | Many             | A shared environment, or a suite that is too slow to run serially |

Never use a global reset together with parallel workers. The reset of one worker deletes the data of another worker
during its test.

With **own your data**, these rules apply:

- Names are unique for each test (include `testInfo.workerIndex` and a timestamp).
- Cleanup goes after `await use(...)` in the fixture. This code runs also when the test fails.
- Fixtures are test-scoped, unless the data is expensive and read-only.
- Entities that the API cannot create (usually users) are seeded reference data. Use one for each worker when tests
  change them.

### 2.3 Mock only the outside world

The rule is the same as in the lower tiers: use mocks at the edge of our system. But in E2E, the edge moves. Our API is
part of the system under test, so it stays real. The tier exists to exercise the API.

You can use `page.route` and `page.clock` only for these cases:

1. **Third-party services** that we do not own and cannot run locally (payments, maps, external identity providers,
   analytics). Abort analytics globally in a fixture.
2. **Time** (`page.clock`), installed before navigation.
3. **Browser capabilities**: give permissions or set the geolocation on the context. Receive downloads with
   `page.waitForEvent("download")`.

Each double has a comment of one line that names its case. Routed bodies are typed. **A route on our own API is never
justified.** If a state needs a specific API response, seed that state (§2.1) or move the test to a story with MSW.
Stubs of app modules and flags only for tests in production code are also never justified.

### 2.4 Wait for and assert what the user sees

The user waits for the screen, not for the network, so the test does the same. Locator actions wait until the user can
use an element. Web-first assertions try again until they pass or time out. They are the only mechanism to wait. A
sleep is slow and still flaky. `networkidle` never settles in an app that polls. A value that you read one time
(`isVisible()`, `textContent()`) passes or fails by chance of timing.

Assertions first check what the user sees: text, roles, visibility, URL. Check a backend effect that the UI does not
show through the API. Each test ends with an assertion that fails if the path broke. A negative assertion needs a
positive control. If not, it passes when the page did not load.

A wait on the network is the last choice, for a result that no UI shows. It is in the test, never in a page object.
The page object describes the UI. An API URL in a page object is a hidden coupling, and each caller pays for it. A save
that the user cannot see complete is also a UX gap. Report it.

## 3. Page objects

Page objects hide _how_ to find and use the UI. The test decides _what_ to check.

- They expose `readonly` locators. Tests assert on them with web-first matchers. "Tests own assertions" means that the
  `expect` is in the test. It does not mean that the page object returns snapshot values.
- Actions with many controls (fill and submit) are methods. Navigation methods end with a readiness check and return
  the page object of the target. This check is the only assertion that a page object can contain.
- No transport details (URLs of API calls, status codes, `waitForResponse`), no CSS or XPath. Shared UI is a component
  object scoped by a root locator. Pages contain component objects.
- Assert transient UI (toasts) in the test. Do not keep it as a property of the page object.

## 4. Conventions

- **Locators**: role and accessible name first, then label, then text. Use `getByTestId` last, with a comment. If you
  cannot select a role, that is an accessibility finding in the component. Anchor names that overlap (`/^next$/i`).
  Scope repeated controls to their container. Filter by content instead of `nth`. Fix strict-mode errors with a better
  locator.
- **Text**: tests run in one fixed locale. Match the important part with a regex, not full sentences.
- **Structure**: `e2e/tests/<area>/<path>.spec.ts`. Test names state the result for the user. Phases are in
  `test.step`.
- **Auth**: a setup project signs in one time for each role and saves `storageState`. Tests load it. Tests of the
  sign-in start from an empty state. The saved state is in a folder that git ignores. Credentials come from env
  variables and never show in names, steps or logs.
- **Determinism**: fixed `locale` and `timezoneId` in the config, the same as in the unit tier. Random values in names
  are correct. Assertions use only values that the test created.
- **App imports**: E2E code can import types and pure constants (DTOs, enums, route paths) and `src/test-lib/`
  fixtures. Never import components, hooks or stores.
- **Tags**: use `@smoke` for the minimum set for each PR, and area tags for subsets (`--grep @area`). Never tag by
  flakiness.
- **Timeouts**: never increase global timeouts to hide slowness. Mark one slow test with `test.slow()` and a comment.

## 5. Flakiness

A flaky test teaches the team to ignore red builds. Thus, a flaky test is a bug, not a pass.

- Retries run only in CI, with `trace: "on-first-retry"`, so that each retry leaves a trace. Set `failOnFlakyTests` in
  CI, so that a pass on retry makes the build fail.
- Before review, run new or changed tests with `--repeat-each=10` (and with many workers, if the suite runs in
  parallel).
- Find the cause in the trace. Do not add waits, retries or `force`.
- Quarantine a test with `test.fixme()` and a ticket reference. Never delete a flaky test silently.
- Usual causes, most frequent first:
  1. One-shot assertions.
  2. Data that tests share.
  3. Waits on the network instead of the UI.
  4. Animations.
  5. The real clock.
  6. Strict-mode violations that `.first()` hides.

## 6. Design-smell signals

Pain in an E2E test is feedback about the app or the test design. Fix the cause, not the test.

| Signal in the test                              | Probable cause                                   | Fix                                                      |
| ----------------------------------------------- | ------------------------------------------------ | -------------------------------------------------------- |
| Sleeps, `networkidle`, custom wait helpers      | No readiness signal that the user can see        | Assert UI state, add a loading or ready indicator        |
| Fails alone or in a different order             | Shared or leaked data                            | Reset or own the data for each test (§2.2)               |
| Many UI clicks before the path starts           | API seeding is missing                           | Seed through `request`, add an endpoint if it is missing |
| `getByTestId` everywhere                        | Roles or accessible names are missing            | Fix the component                                        |
| `.first()` or `.nth()` to silence strict mode   | Duplicate names or a locator that is too broad   | Scope by container, or give elements different names     |
| `page.route` on our own API                     | A concern of the component tier written as E2E   | Seed the state, or move the test to a story              |
| `force: true`                                   | An overlay or animation intercepts the pointer   | Fix the overlay, and first assert that it is gone        |
| A page object with ~15 locators or ~10 methods  | Many workflows in one class                      | Split into component objects                             |
| The test lists the states or fields of a screen | A concern of the story tier written as E2E       | Keep one path in E2E, move the matrix to stories         |
| Needs a flag only for tests in production code  | The real interface cannot reach the precondition | Make it possible to seed through the API                 |
| Passes only on retry                            | A race or a dependency on timing                 | Treat it as a bug, and find it in the trace              |

## 7. Review checklist

- [ ] The path is critical and goes across pages or the real API. No story or unit test can prove it alone.
- [ ] `test` and `expect` come from the fixtures module. Page objects come from fixtures.
- [ ] Preconditions are seeded through the API. The test passes alone and in any order.
- [ ] No sleeps, `networkidle`, `waitForSelector`, one-shot assertions or `force` without a reason.
- [ ] No `page.route` on our own API. Each double has a comment with the reason.
- [ ] Locators are role-first. Each `getByTestId` has a reason. No `.first()` silences strictness.
- [ ] Phases are in `test.step`. The last assertion fails if the path broke.
- [ ] No credentials in code, names, steps or logs.
- [ ] Page objects contain no business assertions and no transport details.

## 8. References

- Playwright: [Best practices](https://playwright.dev/docs/best-practices), [Page object models](https://playwright.dev/docs/pom),
  [Fixtures](https://playwright.dev/docs/test-fixtures), [Authentication](https://playwright.dev/docs/auth),
  [Assertions](https://playwright.dev/docs/test-assertions), [Locators](https://playwright.dev/docs/locators),
  [Mock APIs](https://playwright.dev/docs/mock), [Clock](https://playwright.dev/docs/clock),
  [Retries](https://playwright.dev/docs/test-retries).
- [_Software Engineering at Google_, ch. 14 — Larger testing](https://abseil.io/resources/swe-book/html/ch14.html).
- Fowler, [On the Diverse and Fantastical Shapes of Testing](https://martinfowler.com/articles/2021-test-shapes.html).
