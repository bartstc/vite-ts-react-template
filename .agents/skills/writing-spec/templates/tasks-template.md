---
schema_version: 1
id: NNN-feature-name
artifact: tasks
status: draft # draft / review / approved / implementing / done / archived
author:
created: YYYY-MM-DD
last_updated: YYYY-MM-DD
---

# [Feature Name] — Tasks

<!-- This file is the SEQUENCING layer: ordered work, edge cases, acceptance, and unresolved questions. Every task must trace back to a requirement ID from requirements.md. -->

## 1. Task Breakdown

<!-- REQUIRED. Ordered list of independently testable tasks. Each task references one or more building blocks from design.md (section 1) and traces back to requirements via IDs. Include target file paths. -->

<!-- Mark parallelizable tasks with [P]. Mark tasks requiring sequential execution with [S]. -->

<!-- Example:
1. [S] Create `authStore` with `isAuthenticated` state — `src/features/auth/model/auth.store.ts` (R1, R2)
2. [P] Create `loginMutation` — `src/features/auth/api/login.mutation.ts` (R1)
3. [P] Create `LoginForm` component + tests — `src/features/auth/ui/LoginForm.tsx` (R1, R2)
4. [S] Wire `/login` route into `AppRouter` — `src/app/router.tsx` (R1)
5. [S] Add E2E test for login flow — `e2e/auth/login.spec.ts` (R1, R2)
-->

## 2. Error & Edge Cases

<!-- OPTIONAL but recommended. Use GIVEN/WHEN/THEN format for precision. Cover failure modes, boundary conditions, and concurrent scenarios. If you skip this section, expect the agent to guess — and guess wrong. -->

<!-- Example:
- GIVEN the user is already authenticated, WHEN they navigate to /login, THEN redirect to dashboard.
- GIVEN the API is unreachable, WHEN the user submits login, THEN display a network error with a retry button.
-->

## 3. Acceptance Criteria

<!-- OPTIONAL. High-level "done" checklist. Useful for review gates. If your requirements (requirements.md, section 2) are precise enough, this section may be redundant — skip it. -->

## 4. Open Questions

<!-- OPTIONAL. Unresolved decisions that need human input before implementation can proceed. Each question should block a specific task from section 1. Remove questions as they're resolved and update the relevant sections. -->

<!-- Example:
- [ ] Q1: Should we support "remember me" functionality? (blocks task 3)
- [ ] Q2: Rate limiting strategy for login attempts — server-side only or client-side throttle too? (blocks task 2)
-->

## 5. References

<!-- OPTIONAL. Links to related specs, architecture docs, design mockups, API documentation, or external resources. Keep it to things the agent should read before implementation. -->
