---
name: test-building-blocks
description: Test building block catalog — typed patterns for Storybook play-function tests, Vitest hook tests, Vitest unit tests, MSW handlers, and test data fixtures. Read the relevant rule file before writing or modifying any test, handler, or fixture. Covers: deciding which kind of test to write, authoring a new test from scratch, adding MSW mocks or fixtures, and reviewing existing tests for conformance.
---

# Test Building Blocks

Typed catalog of test-related building blocks used in this project. Each block has a fixed name, layer, composition rules, and canonical example.

## How to Use

Read the rule file for each block you are about to implement. The summaries below are for routing — the rule files contain the full pattern.

Typical flow:

1. Read this file to route to the right block.
2. Read `rules/{block-name}.md` for the full pattern and canonical example.
3. Read the implementation code (component, hook, module) you are testing.
4. Write the test following the rule file's constraints.

## Testing Philosophy

The project's testing philosophy allocates verification across three layers:

- **Storybook play-function tests** are the primary verification layer for feature behavior. Focus on happy paths and the main user-observable states. Anything user-facing — components composing hooks, stores, providers — is verified here.
- **Vitest hook tests** (`renderHook`) cover custom hooks that need dedicated verification — edge cases, error paths, loading states, and hooks with logic not tied to a single component. Use independently of `component-story-test`; the two do not need to cover the same ground.
- **Vitest unit tests** are reserved for non-hook mechanics: mappers, transformers, value objects, selectors, and other pure logic.
- **No tests** for fixtures, MSW handlers, or trivial glue — these are support infrastructure, not the thing being verified.

Coverage is behavior-covered, not file-mapped. Every user-observable state has a story or a hook-test scenario; not every file has a test.

## Mocking Boundary

Mock at the **network boundary**, not the module boundary. MSW is the default for anything HTTP-backed. Do **not** mock `lib/api/` exports, React Query, or Zustand stores — let the real code run and intercept at the wire.

Module-level mocking (`vi.mock`, `vi.stubGlobal`) is reserved for:

- Non-determinism sources: `Date.now`, `crypto.randomUUID`, `Math.random`, timers.
- Write-only side-effect sinks: analytics, logging, toasts — centralized as project-owned spies in `test-lib/`.
- Pure utilities when unit-testing their direct caller.
- XState actors/actions via `machine.provide({ actors, actions })`.

Rationale: mocking `lib/api/` wrappers hides the bugs most likely to ship (wrong query key, wrong `select`, stale-time issues, cache collisions). MSW keeps the real wiring under test and only fakes the external world.

## Block Catalog

### Tests

| Block                  | Layer                     | Summary                                                                                                          | File                            |
| ---------------------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| `component-story-test` | co-located `.stories.tsx` | Storybook play-function test verifying user-facing behavior. Primary verification layer for rendered components. | `rules/component-story-test.md` |
| `hook-test`            | co-located `.test.tsx`    | Vitest test using `renderHook` for custom hooks — edge cases, error/loading paths, cross-component hooks.        | `rules/hook-test.md`            |
| `unit-test`            | co-located `.test.ts(x)`  | Vitest test for non-hook mechanics — mappers, transformers, value objects, selectors, pure functions.            | `rules/unit-test.md`            |

### Support Infrastructure

| Block         | Layer                | Summary                                                                                                                    | File                   |
| ------------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| `msw-handler` | `test-lib/handlers/` | One request handler per endpoint with optional resolver for per-scenario overrides. Shared across tests and stories.       | `rules/msw-handler.md` |
| `fixture`     | `test-lib/fixtures/` | Deterministic test data factory via `createFixture<T>()`. Supplies `toStructure`, `createPermutation`, `createCollection`. | `rules/fixture.md`     |

## Deciding Which Block to Use

Decide in this order:

1. **Is the code under test user-facing (rendered, interactive)?** → `component-story-test`. Covers the happy path and main user-observable states. Mutation hooks, Zustand stores, XState machines, context providers composed by the component are exercised transitively.
2. **Is the code under test a custom hook that needs dedicated verification?** → `hook-test`. Use for hooks whose edge cases, error branches, or loading states are awkward to reproduce through component UI, or for hooks used by multiple components where duplicating scenarios per component is wasteful.
3. **Is the code under test pure, non-hook mechanics?** → `unit-test`. Mappers, transformers, value objects, selectors, date math, query-keys factories.

For support code:

- **Need to mock an HTTP endpoint?** → `msw-handler`. One factory per endpoint; resolver at call site for per-scenario overrides.
- **Need deterministic test data?** → `fixture`. Domain type in, factory out. No randomness, no `Date.now()`.

**Do not write tests for:** fixtures, MSW handler factories, trivial glue (re-exports, constants, pass-through hooks).

## Rules

- Block files live in `rules/` — one file per block.
- Each file contains: description, constraints, and a canonical code example.
- Block names are stable identifiers. If referenced from a spec or documentation, use the exact name from the catalog.
