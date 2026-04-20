# [Feature Name]

<!-- Replace [Feature Name] with a short, descriptive title. This file is the single source of truth for this feature until implementation is complete. -->

## Meta

<!-- REQUIRED. Keep this table updated throughout the spec lifecycle. -->

| Field          | Value                                                                  |
| -------------- | ---------------------------------------------------------------------- |
| Status         | `draft` / `review` / `approved` / `implementing` / `done` / `archived` |
| Author         |                                                                        |
| Created        | YYYY-MM-DD                                                             |
| Last updated   | YYYY-MM-DD                                                             |
| Spec directory | `specs/NNN-feature-name/`                                              |

---

## 1. Goal & Context

<!-- REQUIRED. 2-5 sentences. What problem does this solve and why now? Link to any prior art, issues, or conversations that motivated this work. This section constrains INTENT — not approach. -->

## 2. Requirements

<!-- REQUIRED. Behavioral requirements using EARS notation: "WHEN [condition] THE SYSTEM SHALL [behavior]." Each requirement gets a stable ID (R1, R2, …) for traceability in the task list. Focus on observable behavior, not implementation. -->

<!-- Example:
- **R1**: WHEN a user submits the login form with valid credentials, THE SYSTEM SHALL redirect to the dashboard within 2 seconds.
- **R2**: WHEN the API returns a 401, THE SYSTEM SHALL display an inline error message and preserve form input.
-->

## 3. Non-Goals / Out of Scope

<!-- REQUIRED. Explicitly list what this feature will NOT do. Prevents scope creep and stops the agent from "helpfully" adding unrequested capabilities. -->

## 4. Building Blocks Diff

<!-- REQUIRED. The core of the spec. List every building block that is ADDED, MODIFIED, or DELETED. Reference by name and type — do NOT define implementation internals. Implementation details live in coding standards and existing patterns. -->

<!-- Use the building block types from the building-blocks catalog (e.g., mutation-hook, pure-component, store, page, value-object). When a change doesn't map to a typed building block, use the target file path + a short description of what changes instead. -->

<!-- Test building blocks: `unit-test` and `component-story-test` are NOT listed here — they are implied by the Test Plan in section 9 and ride along with the component/module they verify. `msw-handler` and `fixture` ARE listed here when added or modified, since they are reusable infrastructure shared across multiple tests. -->

### Added

<!-- Example:
- `loginMutation` (mutation-hook) — handles POST /auth/login
- `LoginForm` (pure-component) — form with email/password fields
- `useAuthRedirect` (facade-hook) — redirects authenticated users away from login
- `userFixture` (fixture) — deterministic user test data
- `src/app/routes/login.tsx` — route entry for /login
-->

### Modified

<!-- Example:
- `AppRouter` (page) — add /login route
- `authStore` (store) — add `isAuthenticated` derived state
- `src/i18n/en/auth.json` — add login form translation keys
-->

### Deleted

<!-- Example:
- `legacyLoginPage` (pure-component) — replaced by LoginForm
- `src/app/redirects.ts` — remove legacy /signin redirect
-->

## 5. Design Decisions

<!-- REQUIRED for non-trivial features. Document key choices with brief rationale. For each decision, state what you chose, what you rejected, and why. If the agent proposed alternatives during the design phase, capture the winner here. -->

<!-- OPINIONATED CALL: Keep this section short — 2-4 decisions max. If you need more, the feature should probably be split. -->

<!-- Example:
- **Auth strategy**: Use httpOnly cookies over localStorage tokens — XSS mitigation outweighs the convenience tradeoff.
- **Form library**: Use native controlled inputs, not react-hook-form — form is simple enough that a dependency isn't justified.
-->

## 6. Boundaries

<!-- REQUIRED. Three-tier classification. Be specific — file paths, module names, not vague categories. -->

### ✅ Always (proceed without asking)

<!-- Example:
- Create new files in `src/features/auth/`
- Add unit tests alongside components
-->

### ⚠️ Ask First (needs human approval)

<!-- Example:
- Modify API contracts or request/response types
- Add new dependencies to package.json
- Change database schema
-->

### 🚫 Never (hard stops)

<!-- Example:
- Modify `src/core/auth/` internals
- Remove or disable existing tests
- Commit secrets or credentials
-->

## 7. Task Breakdown

<!-- REQUIRED. Ordered list of independently testable tasks. Each task references one or more building blocks from section 4 and traces back to requirements via IDs. Include target file paths. -->

<!-- Mark parallelizable tasks with [P]. Mark tasks requiring sequential execution with [S]. -->

<!-- Tasks that produce `msw-handler` or `fixture` blocks are support infrastructure — they trace to consumer tasks rather than R#s. Mark these with "(support task for R#, R#)". -->

<!-- Example:
1. [S] Create `authStore` with `isAuthenticated` state — `src/features/auth/model/auth.store.ts` (R1, R2)
2. [P] Create `loginMutation` — `src/features/auth/api/login.mutation.ts` (R1)
3. [P] Create `LoginForm` component + tests — `src/features/auth/ui/LoginForm.tsx` (R1, R2)
4. [P] Create `userFixture` — `test-lib/fixtures/user-fixture.ts` (support task for R1, R2)
5. [S] Wire `/login` route into `AppRouter` — `src/app/router.tsx` (R1)
-->

## 8. Error & Edge Cases

<!-- OPTIONAL but recommended. Use GIVEN/WHEN/THEN format for precision. Cover failure modes, boundary conditions, and concurrent scenarios. If you skip this section, expect the agent to guess — and guess wrong. -->

<!-- Example:
- GIVEN the user is already authenticated, WHEN they navigate to /login, THEN redirect to dashboard.
- GIVEN the API is unreachable, WHEN the user submits login, THEN display a network error with a retry button.
-->

## 9. Test Plan

<!-- REQUIRED when Section 2 contains any R# that describes new testable behavior.
Skip the entire section with a one-line notice when the spec as a whole introduces
no new testable behavior (visual-only changes, pure refactors, renames, file moves,
or other changes that leave observable behavior identical).

Maps every R# to a test. Scope: Vitest unit tests and Storybook component tests.
E2E tests are not part of the spec. -->

<!-- Layer values (exactly one per row):
- `storybook` — behavior verified via a story's play function. Primary layer.
- `vitest` — mechanics verified via unit tests. For mappers, transformers, value objects, and hooks with non-trivial logic.

Test column: bare file name of the tested module or component (e.g., `CheckoutForm`, `priceFormatter`) — not a full file path. The layer column already identifies whether the test is a `.stories.tsx` or a `.test.ts`. -->

<!-- Edge cases (section 8 bullets) are NOT mapped here. They are facets of their parent R# and are covered transitively. -->

| ID  | Layer     | Test           |
| --- | --------- | -------------- |
| R1  | storybook | CheckoutForm   |
| R2  | storybook | CheckoutForm   |
| R3  | vitest    | priceFormatter |

## 10. Acceptance Criteria

<!-- OPTIONAL. High-level "done" checklist. Useful for review gates. If your requirements (section 2) are precise enough, this section may be redundant — skip it. -->

## 11. Open Questions

<!-- OPTIONAL. Unresolved decisions that need human input before implementation can proceed. Each question should block a specific task from section 7. Remove questions as they're resolved and update the relevant sections. -->

<!-- Example:
- [ ] Q1: Should we support "remember me" functionality? (blocks task 3)
- [ ] Q2: Rate limiting strategy for login attempts — server-side only or client-side throttle too? (blocks task 2)
-->

## 12. References

<!-- OPTIONAL. Links to related specs, architecture docs, design mockups, API documentation, or external resources. Keep it to things the agent should read before implementation. -->
