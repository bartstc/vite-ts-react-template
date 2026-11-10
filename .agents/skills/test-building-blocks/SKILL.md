---
name: test-building-blocks
description: Test building block catalog — Storybook play-function tests, Vitest hook tests, lib/api factory tests, Vitest unit tests, MSW handlers, and test data fixtures. ALWAYS read the relevant rule file before writing or modifying any test, story play function, handler, or fixture. Use it when writing new tests, filling a coverage gap, reviewing a spec, or deciding which tier a behaviour belongs at. Not for Playwright E2E (playwright-page-objects).
---

# Test Building Blocks

Catalog of the test building blocks used in this project. Block names are stable identifiers, so plans and reviews can
refer to them as `` `name` (block-type) ``.

The rationale — tiers, why MSW is the mocking seam, when a stub is justified, design-smell signals — is in
[`docs/testing.md`](../../../docs/testing.md). When the doc, this file and a rule file disagree, fix whichever is wrong.

## How to use

Read the rule file of each block you are about to write or change. The summaries below are for routing only; the rule
files hold the constraints, examples and anti-patterns.

- **Writing a test**: route with the steps below, read that rule file, read the code under test, write the test.
- **Filling a gap**: name the block and the behaviour, e.g.
  `` `useAddToCart` (hook-test) — missing the product-not-available case ``.
- **Reviewing**: check each test against its block's rule file and against the mocking boundary below.

Production code that cannot be tested cleanly is a finding about the production code, not a licence to loosen the
test. Say so and name what is missing — usually a seam in `lib/` or a provider in `test-lib/`. When nothing here fits,
say so and write the plainest Vitest test that covers the behaviour; do not force a near match.

## Catalog

### Tests

| Block                  | Subject                                                                                                          | Rule                            |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| `component-story-test` | A component or composition in a real browser: its states per args/handlers, and what the user's actions do.      | `rules/component-story-test.md` |
| `hook-test`            | A hook with a contract of its own, via `renderHook`.                                                             | `rules/hook-test.md`            |
| `api-test`             | A `lib/api/` factory's `mutationFn` / `queryFn`: the request it sends and the domain error each failure maps to. | `rules/api-test.md`             |
| `unit-test`            | Pure logic and XState machines — mappers, value objects, selectors, date math.                                   | `rules/unit-test.md`            |

### Support infrastructure

| Block         | Subject                                                                                | Rule                   |
| ------------- | -------------------------------------------------------------------------------------- | ---------------------- |
| `msw-handler` | One handler factory per endpoint in `test-lib/handlers/`, shared by tests and stories. | `rules/msw-handler.md` |
| `fixture`     | `createFixture<T>` test-data factory in `test-lib/fixtures/`.                          | `rules/fixture.md`     |

### Routing

1. **Pure and deterministic, or an XState machine?** → `unit-test`.
2. **A `lib/api/` factory whose error mapping has branches?** → `api-test`. A factory with no mapping is covered
   transitively by the hook or story that uses it.
3. **A hook?** Prefer covering it through the component that uses it (`component-story-test`). `hook-test` only when
   the hook has a contract of its own — several consumers, or a scenario awkward to stage through UI (error branches,
   unauthenticated paths).
4. **Rendered UI?** → `component-story-test`. One story per meaningful state; a multi-step journey inside a feature is
   one story with `step`s.
5. **Across pages, against the real local API?** Not here — Playwright E2E (`playwright-page-objects` skill).

**Do not test:** fixtures, MSW handlers, test providers and decorators, constants, `providers/` re-exports, pass-through
hooks, DTO and type declarations.

## The mocking boundary

The one rule that governs every block: **mock only at the edge of the app — the network — and provide context with a
provider rather than a mock.**

| Mock this                                                                        | Not this                                                         |
| -------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| HTTP via MSW handlers (`mswServer.use(...)`, `parameters.msw.handlers`)          | `lib/api/` exports, the HTTP client, `@tanstack/react-query`     |
| Non-determinism: `Date.now`, `crypto.randomUUID`, `Math.random`, timers          | Any app hook — `providers/` hooks, use-case hooks, context hooks |
| Write-only sinks: toasts (`spyOnToast`), logging, analytics                      | Child components, unless they cannot run (state why)             |
| Platform gaps behind an owned `lib/` wrapper: clipboard, download, non-HTTP SDKs | Zustand stores — set real state, reset in `afterEach`            |
| XState actors/actions via `machine.provide({ actors, actions })`                 | Domain logic, mappers, parsers — let them run                    |

Everything between that edge and the subject runs for real: `lib/api/` factories, TanStack Query, provider hooks,
stores, machines, child components. A hook mock goes red on a harmless refactor and stays green on a real regression;
an MSW handler survives both.

**Context comes from a test provider**, never from a mock of the hook that reads it: `TestQueryProvider`,
`TestAuthProvider` in `src/test-lib/`, and decorators in `src/test-lib/storybook/`. Read those folders for what exists.
Compose the ones a test needs into one wrapper; if the context you need has no provider, add one.

## Conventions

Shared by every block; the rule files only state what is specific to them.

- **Location and name**: co-located with the subject. `use-add-to-cart.ts` → `use-add-to-cart.test.tsx`;
  `ProductsList.tsx` → `ProductsList.stories.tsx`. `.tsx` only when the file has JSX.
- **Structure** (Vitest): `describe("<subject>")` → optional nested `describe` per method or state → `it("...")`
  naming the behaviour, not the implementation. Blank line between arrange/act and the `expect`s.
- **One behaviour per test.** A genuine matrix — same rule, several inputs — goes in `it.each`; one `it` each when the
  cases have different reasons. Skip cases the type system already prevents.
- **Queries**: by role and accessible name first, then label, then text, `getByTestId` last. Anchor the name
  (`/^next$/i`) where another control's name contains this one. A role query you cannot write is an accessibility bug
  in the component.
- **Interactions**: awaited `userEvent`, always. Never `fireEvent`, never an un-awaited call.
- **Async**: `findBy*` to wait for an element, `waitFor` to wait for one assertion, `getBy*` only for what is already
  there. Never `sleep`. No fake timers unless a debounce forces it, scoped to one `it`.
- **Assertions**: what the user sees first, then the arguments a spy received — `toHaveBeenCalledWith`, not just
  `toHaveBeenCalled`. A negative assertion needs a positive control in the same suite. Nothing on implementation
  details: render counts, internal state, class names, query keys, `queryClient.getQueryData`.
- **Cleanup**: `afterEach(() => vi.restoreAllMocks())` in any test that installs spies. Reset module-level stores and
  caches the subject touches — they leak between tests.
- **Data**: fixtures, not inline literals. Values crossing from arrange to assert are module constants, so both sides
  share one symbol.
- **No DOM snapshots** for logic.
- **Timezone** is `Europe/London` (`test-globals.ts`); MSW handlers reset after each test and unhandled requests fail the test (`test-setup-unit.ts`).
- **Console noise** from a deliberate failure is silenced per test, not globally:
  `vi.spyOn(console, "error").mockImplementation(() => undefined)`.

## Rules

- One rule file per block in `rules/`. Each has its constraints, examples and anti-patterns.
- **The constraints are the rule; the examples only illustrate them.** Examples are modelled on this repo but drift as
  code changes. When an example and a constraint disagree, follow the constraint.
- Block names are stable. Renaming one means updating everything that references it.
- Not every existing test conforms — many predate these rules.
