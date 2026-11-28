# Testing Practices

This document gives the reasons for how we write tests. It covers which tier owns what, where to use mocks, what to
keep real, and which signals show that the production code must change instead of the test. The `test-building-blocks`
skill tells you how to write each type of test. This document gives the reasons, so that you can apply a rule to a case
that the rule does not mention.

Audience: developers and AI agents who write or review tests in this repo.

## 1. Tiers

- **Unit (Vitest, jsdom):** pure logic (mappers, value objects, selectors), XState machines, `lib/api/` factories
  (request shape and error mapping), and hooks that have a contract of their own.
- **Component (Storybook play functions, real browser through Vitest browser mode):** a component or a composition of
  components with its real hooks, stores and providers, and the business paths through it. All behavior that depends on
  the browser engine (layout, focus, overlays, portals) also belongs here.
- **E2E (Playwright):** a few critical journeys across pages against the local API server. Refer to
  [e2e-testing.md](./e2e-testing.md).
- **Visual (stories with the tag `visual`, Vitest browser mode `toMatchScreenshot`):** the appearance of shared
  components and a few key compositions: layout, spacing, color, typography, theme. It adds to the assertions of the
  play function and never replaces them. Only this tier takes screenshots, never E2E. Refer to
  [visual-testing.md](./visual-testing.md).

Each behavior has one owner tier. Unit tests cover branches and edge cases that are difficult to reach through the UI.
Stories cover the main states that a user can see and the paths through them. By default, a journey with many steps in
one feature is a story. A journey across pages is E2E.

## 2. Principles

**Select the unit that keeps the test stable.** Usually, that unit is a behavior: a component with its hooks and
children, or a `lib/api/` factory with its error mapping. Sometimes it is one hook, machine or function that has
sufficient logic of its own for direct tests: many paths, or many steps that depend on each other. Do not do a test of
a part that only sends calls to its neighbors (a `providers/` re-export, a pass-through hook). Such a test breaks when
you refactor and finds nothing. A wide unit gives a failure that is less local. A narrow unit gives more tests that
break when the structure changes. Split where the complexity is.

**Use mocks at the network seam.** `src/lib/api/` is our service layer. It sends the request, changes transport
failures into domain errors and writes logs. MSW intercepts below it. Thus, a test runs all of our own code (URL,
payload, query keys, error mapping, TanStack Query, stores, hooks, child components) and fakes only the world outside
the app. This is the rule "mock only types you own" applied to HTTP: the wire is the edge. But a handler is still our
belief about a contract that another party owns, and nothing keeps that belief true automatically. Thus, we type handler
bodies with the DTO and build them from typed fixtures. For an API that we do not own and cannot trust, `lib/api/`
validates the response.

Sometimes there is no wire to intercept (a vendor SDK with its own transport, WebSocket, clipboard, file download).
Then put the client in an owned wrapper module in `lib/` and use a mock for that wrapper. If no wrapper exists, add one,
so that the mock has a seam.

Stubs of hooks and child components remove the logic that decides if the feature works. A React hook is also an
import, not an injected role. Thus, a mock of a hook connects the test to a file path, not to a contract.

**Use a provider, not a mock, for context.** Context providers are the DI seam. A hook that reads context is a consumer.
A mock of that hook removes the behavior under test together with the missing context. A provider makes the context an
explicit input of the test, so that the negative case differs by one prop. Reusable providers are in `src/test-lib/`
(`TestQueryProvider`, `TestAuthProvider`) and `src/test-lib/storybook/` (decorators). For a single case, give the value
inline in the test.

**Not every test has sufficient value.** The cost of maintenance, not the cost of the first version, limits how many
tests a team can keep. Write a test when all of these conditions are true:

- It pins something that a user or consumer can see (or a contract, for example request shape or error mapping).
- A probable regression causes it to fail.
- Its maintenance costs less than its value.

There is no coverage target. Coverage comes from tests of behaviors.

## 3. Conventions with caveats

- **Role selectors first** (`getByRole` with an accessible name, then label, then text, then test id). Here, "role"
  means the ARIA role. Roles show how users find controls. If you cannot select a role, that is an accessibility
  finding.
- **`userEvent`, with `await`.** Never use `fireEvent`. With fake timers, create the user with
  `advanceTimers: vi.advanceTimersByTime`.
- **`waitFor`** gets one assertion in each callback and is never empty. For elements, prefer `findBy*`.
- **A negative assertion needs a positive control** in the same test or suite. If not, it passes vacuously.
- **Assert first what the user sees.** In UI code, the DOM is the natural oracle. Calls and store state come second.

## 4. When a stub is justified

In addition to MSW at the network, a stub is justified only in these cases:

1. A source of non-determinism: `Date.now`, `crypto.randomUUID`, `Math.random`, timers.
2. A side-effect sink that only receives writes and that the user does not see in the DOM of the test: toasts
   (`spyOnToast`), logging, analytics.
3. A browser or platform capability that cannot run in the test: clipboard, file download. Use a mock for the `lib/`
   wrapper.
4. An XState actor or action, injected with `machine.provide({ actors, actions })`. This is the DI seam of the machine.
5. A child that cannot run in the test environment (canvas, heavy charts), when the subject is the logic of the parent.
   Put the stub at the props boundary of the child, and cover the child in its own story.

Add a comment of one line next to the mock that gives the reason.

## 5. Design-smell signals

Pain with mocks is feedback about the design. Mocks make weak design worse, for example tight coupling and
responsibilities in the wrong place. Change the production code, not the test.

| Signal in the test                                         | Probable cause                                                       | Fix                                                              |
| ---------------------------------------------------------- | -------------------------------------------------------------------- | ---------------------------------------------------------------- |
| You need `vi.mock` for an app hook or a `lib/api/` export  | The hook reads context or does I/O directly                          | Make the inputs parameters, move the I/O into `lib/api/`         |
| More than two MSW overrides to reach one state             | The component controls too much, or the API is too chatty            | Move the orchestration into a use-case hook or machine           |
| The fixture override is longer than the test body          | The template does not cover the usual case                           | Fix the template, or make the input type of the subject narrower |
| Large setup to reach one behavior                          | The subject is too large, or an abstraction is missing               | Split the subject or add a hook or machine                       |
| The test needs `getByTestId`                               | A role or accessible name is missing                                 | Fix the component                                                |
| Pure logic that you can reach only through the DOM         | The logic is in a component                                          | Move it to a plain function and do a direct test of it           |
| The test branches on the string of an error message        | The consumer reads transport errors                                  | Map to a domain error class in `lib/api/`                        |
| The test still passes after you delete the code it covers  | A vacuous assertion, or a mock gives the answer                      | Make the assertion stronger, remove the mock                     |
| A screenshot is the only assertion on an interactive story | No test of the behavior, and reviewers approve diffs without a check | Add play assertions, keep the screenshot as an addition          |
| A visual threshold went up to make CI green                | It hides a real regression or nondeterminism                         | Find the source (motion, clock, data, fonts) and fix it          |

## 6. References

- Freeman, Pryce, Mackinnon, Walnes, _Mock Roles, not Objects_ (2004): only mock types you own, wrap third-party code,
  too many mocks is a smell.
- Fowler, [Mocks Aren't Stubs](https://martinfowler.com/articles/mocksArentStubs.html) and
  [On the Diverse and Fantastical Shapes of Testing](https://martinfowler.com/articles/2021-test-shapes.html).
- [_Software Engineering at Google_, ch. 13](https://abseil.io/resources/swe-book/html/ch13.html): prefer real, then
  fake, then stub, and wrap an API and use the double for the wrapper.
- Khorikov, [Unmanaged dependencies](https://khorikov.org/posts/2021-11-29-unmanaged-dependencies-explained/) and
  [Mocking types you own](https://khorikov.org/posts/2020-06-15-mocking-types-that-you-own/).
- Cooper, _TDD, Where Did It All Go Wrong_ ([summary](https://herbertograca.com/2018/08/27/distillation-of-tdd-where-did-it-all-go-wrong/)).
- Dodds, [Stop mocking fetch](https://kentcdodds.com/blog/stop-mocking-fetch),
  [Write tests. Not too many. Mostly integration.](https://kentcdodds.com/blog/write-tests),
  [Common mistakes with RTL](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library).
- TkDodo, [Testing React Query](https://tkdodo.eu/blog/testing-react-query).
