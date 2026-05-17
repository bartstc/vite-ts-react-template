---
schema_version: 1
id: NNN-feature-name
artifact: design
status: draft # draft / review / approved / implementing / done / archived
author:
created: YYYY-MM-DD
last_updated: YYYY-MM-DD
---

# [Feature Name] — Design

<!-- This file is the APPROACH layer: which building blocks change, key decisions, and the agent's lane. Do NOT define building block internals — reference name + type only. -->

## 1. Building Blocks Diff

<!-- REQUIRED. The core of the design. List every building block that is ADDED, MODIFIED, or DELETED. Reference by name and type — do NOT define implementation internals. Internals live in the building-blocks catalog (`.agents/skills/building-blocks/rules/{name}.md`) and existing code. -->

<!-- Use building block types from the catalog (e.g., queryOptions, mutation, component, store, machine, route, hook, service, type). For changes that don't map to a typed building block, use the target file path + a short description instead. -->

### Added

<!-- Example:
- `loginMutation` (mutation) — handles POST /auth/login
- `LoginForm` (component) — form with email/password fields
- `useAuthRedirect` (hook) — redirects authenticated users away from login
- `src/app/routes/login.tsx` — route entry for /login
-->

### Modified

<!-- Example:
- `AppRouter` (route) — add /login route
- `authStore` (store) — add `isAuthenticated` derived state
- `src/i18n/en/auth.json` — add login form translation keys
-->

### Deleted

<!-- Example:
- `legacyLoginPage` (component) — replaced by LoginForm
- `src/app/redirects.ts` — remove legacy /signin redirect
-->

## 2. Design Decisions

<!-- REQUIRED for non-trivial features. Document key choices with brief rationale. For each decision, state what you chose, what you rejected, and why. If the agent proposed alternatives during the design phase, capture the winner here. -->

<!-- OPINIONATED CALL: Keep this section short — 2-4 decisions max. If you need more, the feature should probably be split. -->

<!-- Example:
- **Auth strategy**: Use httpOnly cookies over localStorage tokens — XSS mitigation outweighs the convenience tradeoff.
- **Form library**: Use native controlled inputs, not react-hook-form — form is simple enough that a dependency isn't justified.
-->

## 3. Boundaries

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
