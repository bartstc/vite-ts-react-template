# Testing Practices

Why we test the way we do: which tier owns what, where to mock, what to keep real, and which signals mean the
production code should change instead of the test. The `test-building-blocks` skill says how to write each kind of
test. This document gives the reasoning, so a rule can be applied to a case it does not mention.

Audience: developers and AI agents writing or reviewing tests in this repo.

## 1. Tiers

- **Unit (Vitest, jsdom):** pure logic (mappers, value objects, selectors), XState machines, `lib/api/` factories
  (request shape and error mapping), and hooks with a contract of their own.
- **Component (Storybook play functions, real browser via Vitest browser mode):** a component or a composition of
  components with its real hooks, stores and providers, and the business paths through it. Anything that depends on
  the browser engine (layout, focus, overlays, portals) belongs here too.
- **E2E (Playwright):** a few critical journeys across pages against the local API server.

Each behaviour has one owning tier. Unit tests cover branches and edge cases that are awkward to reach through UI;
stories cover the main user-observable states and the paths through them. Multi-step journeys inside one feature are
stories by default; journeys across pages are E2E.

## 2. Principles

**Pick the unit that keeps the test stable.** Usually that is a behaviour: a component with its hooks and children, or
a `lib/api/` factory with its error mapping. Sometimes it is a single hook, machine or function, when it holds enough
logic of its own to deserve direct tests: many paths, or several steps that depend on each other. Don't test a piece
that only forwards to its neighbours (a `providers/` re-export, a pass-through hook). Such a test breaks on refactors
and finds nothing. The cost of a wide unit is a less localised failure; the cost of a narrow one is more tests that
break when the structure changes. Split where the complexity is.

**Mock at the network seam.** `src/lib/api/` is our service layer: it sends the request, maps transport failures to
domain errors and logs. MSW intercepts below it, so a test runs all of our own code (URL, payload, query keys, error
mapping, TanStack Query, stores, hooks, child components) and fakes only the world outside the app. This is the
"mock only types you own" rule applied to HTTP: the wire is the edge. A handler is still our belief about a contract
someone else owns, and nothing keeps it true by itself — so handler bodies are typed with the DTO and built from
typed fixtures, and an API we do not own and cannot trust gets its response validated in `lib/api/`.

Where there is no wire to intercept (a vendor SDK with its own transport, WebSocket, clipboard, file download), wrap
the client in an owned module in `lib/` and mock that wrapper. If no wrapper exists, add one so the mock has a seam.

Hook and child-component stubs remove the logic that decides whether the feature works. A React hook is also an
import, not an injected role, so mocking it ties the test to a file path rather than a contract.

**Provider, not mock, for context.** Context providers are the DI seam. A hook that reads context is a consumer, and
mocking it removes the behaviour under test along with the missing context. A provider makes the context the test's
explicit input, so the negative case differs by one prop. Reusable providers live in `src/test-lib/`
(`TestQueryProvider`, `TestAuthProvider`) and `src/test-lib/storybook/` (decorators). For a one-off, provide the value
inline in the test.

**Not every test is worth writing.** Maintenance cost, not authoring cost, limits how many tests a team can afford.
Write a test when it pins something a user or consumer can observe (or a contract such as request shape or error
mapping), a plausible regression would fail it, and its upkeep stays below that value. There is no coverage target:
coverage follows from testing behaviours.

## 3. Conventions with caveats

- **Role selectors first** (`getByRole` with an accessible name, then label, then text, then test id). Here "role"
  means the ARIA role. Roles mirror how users find controls, and a role you cannot select is an accessibility finding.
- **`userEvent`, awaited.** Never `fireEvent`. With fake timers, create the user with
  `advanceTimers: vi.advanceTimersByTime`.
- **`waitFor`** takes one assertion per callback and is never empty. Prefer `findBy*` for elements.
- **A negative assertion needs a positive control** in the same test or suite, or it passes vacuously.
- **Assert what the user sees first.** In UI code the DOM is the natural oracle. Calls and store state come second.

## 4. When a stub is justified

Besides MSW at the network, a stub is justified only in these cases:

1. A source of non-determinism: `Date.now`, `crypto.randomUUID`, `Math.random`, timers.
2. A write-only side-effect sink the user does not see in the test's DOM: toasts (`spyOnToast`), logging, analytics.
3. A browser or platform capability that cannot run in the test: clipboard, file download. Mock the `lib/` wrapper.
4. An XState actor or action, injected with `machine.provide({ actors, actions })` — the machine's own DI seam.
5. A child that cannot run in the test environment (canvas, heavy charts) when the subject is the parent's logic. Stub
   it at its props boundary and cover the child in its own story.

Add a one-line comment next to the mock saying why.

## 5. Design-smell signals

Mock pain is feedback about the design: mocks amplify weak design such as tight coupling and misplaced
responsibilities. Change the production code, not the test.

| Signal in the test                                   | Likely cause                                       | Fix                                                  |
| ---------------------------------------------------- | -------------------------------------------------- | ---------------------------------------------------- |
| Need to `vi.mock` an app hook or a `lib/api/` export | Hook reads context or does I/O directly            | Make inputs parameters; move I/O into `lib/api/`     |
| More than two MSW overrides to reach one state       | Component orchestrates too much, or API too chatty | Move orchestration into a use-case hook or machine   |
| Fixture override longer than the test body           | Template misses the common case                    | Fix the template, or narrow the subject's input type |
| Heavy setup to reach one behaviour                   | Subject too large, or a missing abstraction        | Split the subject or introduce a hook/machine        |
| Test needs `getByTestId`                             | Missing role or accessible name                    | Fix the component                                    |
| Pure logic reachable only through the DOM            | Logic lives in a component                         | Extract it to a plain function and test it directly  |
| Test branches on an error message string             | Consumer reads transport errors                    | Map to a domain error class in `lib/api/`            |
| Test still passes after deleting the code it covers  | Vacuous assertion, or a mock supplies the answer   | Strengthen the assertion; remove the mock            |

## 6. References

- Freeman, Pryce, Mackinnon, Walnes, _Mock Roles, not Objects_ (2004): only mock types you own, wrap third-party code,
  too many mocks is a smell.
- Fowler, [Mocks Aren't Stubs](https://martinfowler.com/articles/mocksArentStubs.html) and
  [On the Diverse and Fantastical Shapes of Testing](https://martinfowler.com/articles/2021-test-shapes.html).
- [_Software Engineering at Google_, ch. 13](https://abseil.io/resources/swe-book/html/ch13.html): prefer real, then
  fake, then stub; wrap an API and double the wrapper.
- Khorikov, [Unmanaged dependencies](https://khorikov.org/posts/2021-11-29-unmanaged-dependencies-explained/) and
  [Mocking types you own](https://khorikov.org/posts/2020-06-15-mocking-types-that-you-own/).
- Cooper, _TDD, Where Did It All Go Wrong_ ([summary](https://herbertograca.com/2018/08/27/distillation-of-tdd-where-did-it-all-go-wrong/)).
- Dodds, [Stop mocking fetch](https://kentcdodds.com/blog/stop-mocking-fetch),
  [Write tests. Not too many. Mostly integration.](https://kentcdodds.com/blog/write-tests),
  [Common mistakes with RTL](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library).
- TkDodo, [Testing React Query](https://tkdodo.eu/blog/testing-react-query).
