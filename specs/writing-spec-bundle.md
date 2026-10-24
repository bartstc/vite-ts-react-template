# Writing Spec Skill (bundled)

> Collaboratively write a feature spec with the developer. Trigger when a task involves 5+ unconstrained decisions, spans 10+ files, or the developer explicitly asks for a spec. Do NOT trigger for config edits, CSS fixes, helper functions, exploratory prototyping, presentation-only changes, or when the developer explicitly opts out.

---

# SKILL

## Purpose

Guide the developer through writing a feature spec before any code is written. The spec constrains intent and approach so implementation decisions are explicit, reviewed, and traceable. This skill produces three files in `specs/NNN-feature-name/` — `requirements.md`, `design.md`, `tasks.md` — using the templates in `./templates/`.

## Prerequisites

- Read `./templates/requirements-template.md`, `./templates/design-template.md`, `./templates/tasks-template.md`, and `./templates/contract-template.md` before starting — they define the section structure
- Read `@docs/architecture.md` to understand current building block types and project structure
- Determine the next available sequence number by checking both `specs/` directory listings AND `git log` for prior spec-related commits — use the higher of the two

## Workflow: Four Phases with Gates

Each phase ends with a human review gate. Do NOT advance to the next phase without explicit developer approval ("continue", "ok", "next", "looks good", or similar). If something goes wrong, STOP and re-plan — do not push forward.

### Phase 1 — Goal & Scope (Intent)

Collaborate with the developer to fill `requirements.md`.

1. Ask the developer to describe the feature in 2-5 sentences (or accept what they've already provided)
2. Before drafting, ask 3-5 clarifying questions about scope boundaries, error scenarios, and unstated assumptions — only where the answer would change the spec. Skip obvious ones.
   - **If the feature introduces new API calls (queries or mutations):** explicitly ask which server-side error responses each call must handle, and how the UI should react to each.
3. Draft the **Goal & Context** section — focus on the problem, not the solution
4. Draft **Requirements** using EARS notation: `WHEN [condition] THE SYSTEM SHALL [behavior]`. Assign stable IDs (R1, R2, …)
5. Draft **Non-Goals** — ask: "What should this feature explicitly NOT do?"
6. Present `requirements.md` for review

**What to ask if unclear:** "What's the observable user behavior when this works correctly?" Never invent requirements — if the developer hasn't specified a behavior, ask about it.

### Phase 2 — Design (Approach)

Collaborate on `design.md`.

1. Propose a **Building Blocks Diff** — list every block that is ADDED, MODIFIED, or DELETED. Use the project's building block taxonomy from `.agents/skills/building-blocks/SKILL.md`. Reference by **name and type only** — do not define internals. Implementation details belong in coding standards and per-type skills, not specs. For changes that don't map to a typed building block, use the target file path + a short description instead.
2. **Cross-slice concerns** — ask whether any new block needs to interact with another feature or sub-feature slice. If yes, decide the wiring point (parent feature or page) and injection mechanism (callback, render prop, slot) in the design — don't defer to implementation.
3. **Identify contract candidates.** For each block in the diff, check the signal checklist below. For every block hitting ≥1 signal, present an inline proposal — one line each: `` `blockName` (type) — <signal(s) hit>; design problem: <one phrase>``. The developer approves/rejects each. For approved blocks, create `specs/NNN-feature-name/contracts/{block-slug}.md` (slug = block name kebab-cased per `code-style.md`; on a slug collision, suffix the type, e.g. `review-form-store.md`) from `./templates/contract-template.md`, and add a contract link to that block's `design.md` Building Blocks Diff entry. Contracts are **signal-driven, not type-driven** — most blocks hit zero signals and get nothing. If no block hits a signal, skip this step entirely: no `contracts/` directory, no proposals. When a block hits a signal but the developer rejects the proposal (or you judge it trivial), record the skip reason inline in that block's `design.md` entry — e.g. `` `fooStore` (store) — contract skipped: shape is flat``.

   **Signals — a block warrants a contract proposal if ≥1 holds.** Signals describe properties of the design problem, not block types:
   1. **Multiple states & transitions** — the block moves through several discrete states with conditional or guarded transitions.
   2. **Structured internal state** — more than a couple of flat fields: derived values, interdependent fields, or normalized collections.
   3. **Branching domain logic** — conditional rules, invariants, or multi-step computation where the rules themselves are the design.
   4. **Cross-slice coordination** — behavior depends on wiring into another feature or sub-feature slice; the seam (callback, slot, render-prop) needs design.
   5. **No canonical pattern** — the block matches no established pattern the agent can look up, so its shape must be designed from scratch.

4. For non-trivial features, propose **two plausible designs** with tradeoffs. Let the developer choose. Capture the winner and rationale in **Design Decisions**
5. Draft the **Boundaries** section using the three-tier system:
   - ✅ **Always** — proceed without asking (e.g., create files in the feature directory)
   - ⚠️ **Ask first** — needs approval (e.g., modify API contracts, change schema, create shared utilities)
   - 🚫 **Never** — hard stops (e.g., modify core auth, remove tests, commit secrets)
6. Present `design.md` for review

**Critical rule for building blocks:** Reference names and types. Do NOT define contracts, interfaces, or implementation — those live in separate coding-standards skills and existing code. The spec describes a CHANGE to the status quo. The agent reads relevant code to see the current status quo.

### Phase 3 — Spec (Sequencing)

Fill `tasks.md`.

1. Break work into a **Task Breakdown** — ordered, independently testable tasks. Each task:
   - References building blocks from `design.md` if any are involved
   - Traces to requirement IDs (R1, R2, …)
   - Includes target file paths
   - Is marked `[P]` (parallelizable) or `[S]` (sequential)
2. Draft **Error & Edge Cases** using GIVEN/WHEN/THEN — cover failure modes (including fetch errors for data-fetching components), boundary conditions, concurrency
3. Add **Open Questions** for anything unresolved that blocks a specific task
4. Present `tasks.md` for review

### Phase 4 — Review & Finalize

1. Run a **structured self-audit** and present findings to the developer (don't silently verify — show the results):
   - **Coverage matrix**: for each requirement ID, list which task(s) implement it. Flag any requirement with zero tasks
   - **Orphan tasks**: flag any task that doesn't trace back to a requirement ID
   - **EARS compliance**: flag any requirement missing WHEN/THE SYSTEM SHALL or using vague language ("handle properly", "work correctly")
   - **Boundary specificity**: flag any boundary item (✅/⚠️/🚫) that references a vague category instead of a file path or module name
   - **Building block references**: flag any block in `design.md` that doesn't exist in the building-blocks catalog — _acceptable without a catalog match if the block has a contract (signal 5, no canonical pattern); flag it only if it lacks both_
   - **Contract coverage**: every contract file links back from a `design.md` block entry; every `design.md` block that hits a signal either has a contract or an inline skip reason in its entry
   - **Line count**: report each file's count and the combined total. Caps: `requirements.md` ≤50, `design.md` ≤80, `tasks.md` ≤70, combined ≤200. Contracts are excluded from the combined cap — report each contract's count separately, ≤80 each. If any cap is exceeded, identify which section to compress or extract
   - **Contract count**: no hard cap — report the count. A high count (e.g. >3) signals the feature should be split into separate specs; surface it, don't enforce it
2. Fix any issues found in step 1 before proceeding
3. Set status to `review` in each Meta table
4. Present the audit results and the final spec for developer sign-off

## Rules & Constraints

### What the agent MUST do

- ALWAYS read the three template files in `./templates/` before drafting
- ALWAYS use EARS notation for requirements and GIVEN/WHEN/THEN for edge cases
- ALWAYS assign stable IDs to requirements (R1, R2, …) — tasks reference these for traceability
- ALWAYS include the three-tier boundary system (✅ / ⚠️ / 🚫) with specific paths

### What the agent MUST NOT do

- NEVER invent requirements the developer hasn't stated or confirmed — ask instead
- NEVER define building block internals (interfaces, schemas, implementation) in `design.md` — reference name + type only. Internals/pseudocode for complex blocks belong in `contracts/`; contracts are the one sanctioned place for block-shape detail in a spec
- NEVER duplicate a decision across `design.md` and a contract — cross-block decisions go in `design.md` Design Decisions; intra-block shape rationale goes in the contract
- NEVER skip a review gate — each phase needs explicit developer approval
- NEVER conflate spec layers: requirements constrain intent, design constrains approach, tasks constrain sequencing. Keep them separate
- NEVER add boilerplate boundaries — every item in ✅/⚠️/🚫 must be reachable during implementation of this specific feature

### Prefer

- Prefer concise specs (combined ~200 lines: requirements ≤50, design ≤80, tasks ≤70) over exhaustive ones — the curse of instructions means longer specs get followed less reliably. Contracts are excluded from the ~200 combined cap and capped individually at ≤80 lines
- Prefer mechanical enforcement (lint, tests, schemas) over prose rules — if a constraint can be a linter rule, it doesn't belong in the spec
- Prefer two design options with tradeoffs over a single "obvious" choice — this surfaces assumptions
- Prefer specific file paths in boundaries over vague module names

## Anti-Patterns

- **Spec that's actually a task list** — "first create the model, then add the service" constrains sequencing but not intent. The agent follows every step and still builds the wrong thing. Fix: write requirements first, derive tasks from them
- **Over-specification that becomes code** — if the spec includes TypeScript interfaces, database DDL, or code snippets, it has crossed from "what" into "how." Move those to design docs or coding standards
- **Under-specification that forces guessing** — if a requirement says "handle errors gracefully" without specifying which errors and what "gracefully" means, the agent will guess. Fix: use GIVEN/WHEN/THEN for every error scenario
- **Auto-generated specs** — LLM-generated context files have been shown to reduce task success rates. The developer drives content; the agent structures and challenges it
- **Markdown review trap** — if any file exceeds its cap (requirements 50 / design 80 / tasks 70) or the combined spec exceeds ~200 lines, the review cost may exceed the value. Split the feature or compress the spec

## Examples

### ✅ Correct: Building block reference

```markdown
### Added

- `loginMutation` (mutation) — handles POST /auth/login
- `LoginForm` (component) — email/password form with validation
```

### ❌ Wrong: Building block with implementation details

````markdown
### Added

- `loginMutation` (mutation):
  ```typescript
  export const loginMutation = {
    mutationFn: (data: LoginData) => api.post("/auth/login", data),
    onSuccess: (response) => {
      authStore.setToken(response.token);
    },
  };
  ```
````

````
Why wrong: the spec now contains code. The mutation's internals are governed by coding standards, not the feature spec.

### ✅ Correct: EARS requirement
```markdown
- **R3**: WHEN the login form is submitted with an empty email field, THE SYSTEM SHALL display an inline validation error without making an API call.
````

### ❌ Wrong: Vague requirement

```markdown
- **R3**: The form should validate inputs properly.
```

Why wrong: "properly" is undefined — the agent will guess what validations to apply and what "proper" error display looks like.

## Exit Criteria

The spec is ready for implementation when:

- [ ] Every section marked REQUIRED in each template is filled
- [ ] Every requirement has a stable ID and uses EARS notation
- [ ] Every task traces to ≥1 requirement ID
- [ ] Building blocks reference name + type only, no implementation details
- [ ] Boundaries use specific file paths, not vague categories
- [ ] Open questions are either resolved or explicitly block named tasks
- [ ] Developer has approved the final spec (status set to `approved`)
- [ ] Every proposed-and-approved contract is filled and linked from `design.md`
- [ ] File sizes within caps: `requirements.md` ≤50, `design.md` ≤80, `tasks.md` ≤70, combined ≤200 lines; each contract ≤80 lines (excluded from the combined cap)

## References

- `.agents/skills/building-blocks/SKILL.md` — building block type dictionary (names, descriptions, when to use each)
- `./templates/requirements-template.md`, `./templates/design-template.md`, `./templates/tasks-template.md`, `./templates/contract-template.md` — section structure and inline guidance
- `@docs/architecture.md` — project structure, architectural decisions, conventions

---

# Template: requirements-template.md

```markdown
---
schema_version: 1
id: NNN-feature-name
artifact: requirements
status: draft # draft / review / approved / implementing / done / archived
author:
created: YYYY-MM-DD
last_updated: YYYY-MM-DD
---

# [Feature Name] — Requirements

<!-- Replace [Feature Name] with a short, descriptive title. This file is the INTENT layer: what the feature must do, not how. -->

## 1. Goal & Context

<!-- REQUIRED. 2-5 sentences. What problem does this solve and why now? Link to any prior art, issues, or conversations that motivated this work. This section constrains INTENT — not approach. -->

## 2. Requirements

<!-- REQUIRED. Behavioral requirements using EARS notation: "WHEN [condition] THE SYSTEM SHALL [behavior]." Each requirement gets a stable ID (R1, R2, …) for traceability in tasks.md. Focus on observable behavior, not implementation. -->

<!-- Example:
- **R1**: WHEN a user submits the login form with valid credentials, THE SYSTEM SHALL redirect to the dashboard within 2 seconds.
- **R2**: WHEN the API returns a 401, THE SYSTEM SHALL display an inline error message and preserve form input.
-->

## 3. Non-Goals / Out of Scope

<!-- REQUIRED. Explicitly list what this feature will NOT do. Prevents scope creep and stops the agent from "helpfully" adding unrequested capabilities. -->
```

---

# Template: design-template.md

```markdown
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

<!-- A block that hit a complexity signal in Phase 2 either appends a contract link or records why a contract was skipped:
- `checkoutFlow` (custom) — see `contracts/checkout-flow.md`
- `fooStore` (store) — contract skipped: shape is flat
-->

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
```

---

# Template: contract-template.md

```markdown
---
schema_version: 1
id: NNN-feature-name
artifact: contract
block: blockName
block_type: store # building block type from the catalog, or "custom" if none
author:
created: YYYY-MM-DD
last_updated: YYYY-MM-DD
---

# [blockName] — Contract

<!-- A contract captures the design of ONE complex block. It exists only because the block hit ≥1 signal. Pseudocode / structured shape only — NO production code, NO full TypeScript interfaces. A contract's lifecycle is its parent spec's; it has no own status. Cap: ≤80 lines. -->

## 1. Design Problem

<!-- REQUIRED. 2-3 sentences: what is ambiguous or complex about this block, which signal(s) it hit, and why getting the shape right matters. -->

<!-- Example:
The wizard moves through 4 steps with back-navigation and a guarded final submit (signals 1, 3). Getting the transition map wrong silently strands the user mid-flow.
-->

## 2. Shape

<!-- REQUIRED. Structure by the signal(s) the block hit — a block may hit several. Pick the relevant outline(s). Lead with inputs → outputs → key behaviors. Pseudocode / outline only. -->

<!-- stateful — states, events, transitions/guards:
- states: idle, loading, success, error
- events: SUBMIT, RETRY, RESET
- transitions: idle --SUBMIT--> loading; loading --(ok)--> success; loading --(fail)--> error; error --RETRY--> loading

- guards: SUBMIT requires form valid
  -->

<!-- data shape — fields, derived values, invariants:
- fields: items[], selectedId
- derived: selectedItem = items.find(selectedId); total = sum(items.price)
- invariant: selectedId always references an existing item or null
-->

<!-- logic — operations (signatures), rules, edge cases:
- applyDiscount(cart, code) -> cart: stacks percentage codes, rejects expired
- edge: empty cart returns unchanged
-->

<!-- coordination — the seam: who calls what, with what payload:
- parent page passes onComplete(result) callback
- block calls onComplete after success transition only
-->

## 3. Rationale

<!-- REQUIRED. What was chosen and rejected for THIS block's shape, briefly. Block-scoped only — cross-block decisions stay in design.md Design Decisions; do not duplicate. -->

<!-- Example:
Chose a flat state enum over nested states — only one dimension of variation, nesting adds no value.
-->

## 4. Open Questions

<!-- OPTIONAL. Unresolved decisions that block implementation of THIS block. Remove when resolved. -->

<!-- Example:
- [ ] Should RETRY preserve partial form input or reset it?
-->
```

---

# Template: tasks-template.md

```markdown
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

<!-- REQUIRED if design.md lists building blocks. Add these lines verbatim: -->
<!-- Before implementing each building block, read `.agents/skills/building-blocks/rules/{type}.md` for its type. -->
<!-- Before implementing a block that has a contract in `contracts/`, read that contract in addition to its rule file. -->
```
