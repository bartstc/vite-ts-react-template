---
name: writing-spec
description: Collaboratively write a feature spec with the developer. Trigger when a task involves 5+ unconstrained decisions, spans 5+ files, or the developer explicitly asks for a spec. Do NOT trigger for config edits, CSS fixes, helper functions, exploratory prototyping, presentation-only changes, or when the developer explicitly opts out.
---

## Purpose

Guide the developer through writing a feature spec before any code is written. The spec constrains intent and approach so implementation decisions are explicit, reviewed, and traceable. This skill produces a single `spec.md` file in `specs/NNN-feature-name/` using the project template at `@docs/spec-template.md`.

## Prerequisites

- Read `@docs/spec-template.md` before starting — it defines the section structure
- Read `@docs/architecture.md` to understand current building block types and project structure
- Check `specs/` for the next available sequence number

## Workflow: Four Phases with Gates

Each phase ends with a human review gate. Do NOT advance to the next phase without explicit developer approval ("continue", "ok", "next", "looks good", or similar). If something goes wrong, STOP and re-plan — do not push forward.

### Phase 1 — Goal & Scope (Intent)

Collaborate with the developer to fill sections 1-3 of the template.

1. Ask the developer to describe the feature in 2-5 sentences (or accept what they've already provided)
2. Draft the **Goal & Context** section — focus on the problem, not the solution
3. Draft **Requirements** using EARS notation: `WHEN [condition] THE SYSTEM SHALL [behavior]`. Assign stable IDs (R1, R2, …)
4. Draft **Non-Goals** — ask: "What should this feature explicitly NOT do?"
5. Present all three sections for review

**What to ask if unclear:** "What's the observable user behavior when this works correctly?" Never invent requirements — if the developer hasn't specified a behavior, ask about it.

### Phase 2 — Design (Approach)

Collaborate on sections 4-6 of the template.

1. Propose a **Building Blocks Diff** — list every block that is ADDED, MODIFIED, or DELETED. Use the project's building block taxonomy from `@docs/building-blocks.md` (queryOptions, component, store, machine, route, hook, service, type). Reference by **name and type only** — do not define internals. Implementation details belong in coding standards and per-type skills, not specs. For changes that don't map to a typed building block, use the target file path + a short description instead.
2. For non-trivial features, propose **two plausible designs** with tradeoffs. Let the developer choose. Capture the winner and rationale in **Design Decisions**
3. Draft the **Boundaries** section using the three-tier system:
   - ✅ **Always** — proceed without asking (e.g., create files in the feature directory)
   - ⚠️ **Ask first** — needs approval (e.g., modify API contracts, add dependencies, change schema)
   - 🚫 **Never** — hard stops (e.g., modify core auth, remove tests, commit secrets)
4. Present for review

**Critical rule for building blocks:** Reference names and types. Do NOT define contracts, interfaces, or implementation — those live in separate coding-standards skills and existing code. The spec describes a CHANGE to the status quo. The agent reads relevant code to see the current status quo.

### Phase 3 — Spec (Sequencing)

Fill sections 7-10 of the template.

1. Break work into a **Task Breakdown** — ordered, independently testable tasks. Each task:
   - References building blocks from section 4
   - Traces to requirement IDs (R1, R2, …)
   - Includes target file paths
   - Is marked `[P]` (parallelizable) or `[S]` (sequential)
2. Draft **Error & Edge Cases** using GIVEN/WHEN/THEN — cover failure modes, boundary conditions, concurrency
3. Add **Open Questions** for anything unresolved that blocks a specific task
4. Present for review

### Phase 4 — Review & Finalize

1. Re-read the complete spec end-to-end
2. Verify: every requirement has ≥1 task, every task traces to ≥1 requirement, boundaries are specific (file paths, not vague categories)
3. Check spec length — target under 150 lines. If longer, look for content that belongs in coding standards or architecture docs instead
4. Ask: "Would a staff engineer approve this spec as-is?"
5. Set status to `review` in the Meta table
6. Present final spec for developer sign-off

## Rules & Constraints

### What the agent MUST do

- ALWAYS read `@docs/spec-template.md` before drafting
- ALWAYS use EARS notation for requirements and GIVEN/WHEN/THEN for edge cases
- ALWAYS assign stable IDs to requirements (R1, R2, …) — tasks reference these for traceability
- ALWAYS include the three-tier boundary system (✅ / ⚠️ / 🚫) with specific paths

### What the agent MUST NOT do

- NEVER invent requirements the developer hasn't stated or confirmed — ask instead
- NEVER define building block internals (interfaces, schemas, implementation) in the spec — reference name + type only
- NEVER skip a review gate — each phase needs explicit developer approval
- NEVER conflate spec layers: requirements constrain intent, design constrains approach, tasks constrain sequencing. Keep them separate

### Prefer

- Prefer concise specs (~80-120 lines) over exhaustive ones — the curse of instructions means longer specs get followed less reliably
- Prefer mechanical enforcement (lint, tests, schemas) over prose rules — if a constraint can be a linter rule, it doesn't belong in the spec
- Prefer two design options with tradeoffs over a single "obvious" choice — this surfaces assumptions
- Prefer specific file paths in boundaries over vague module names

## Anti-Patterns

- **Spec that's actually a task list** — "first create the model, then add the service" constrains sequencing but not intent. The agent follows every step and still builds the wrong thing. Fix: write requirements first, derive tasks from them
- **Over-specification that becomes code** — if the spec includes TypeScript interfaces, database DDL, or code snippets, it has crossed from "what" into "how." Move those to design docs or coding standards
- **Under-specification that forces guessing** — if a requirement says "handle errors gracefully" without specifying which errors and what "gracefully" means, the agent will guess. Fix: use GIVEN/WHEN/THEN for every error scenario
- **Auto-generated specs** — LLM-generated context files have been shown to reduce task success rates. The developer drives content; the agent structures and challenges it
- **Markdown review trap** — if the spec exceeds ~150 lines or spans multiple files, the review cost may exceed the value. Split the feature or compress the spec

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

- [ ] Every section marked REQUIRED in the template is filled
- [ ] Every requirement has a stable ID and uses EARS notation
- [ ] Every task traces to ≥1 requirement ID
- [ ] Building blocks reference name + type only, no implementation details
- [ ] Boundaries use specific file paths, not vague categories
- [ ] Open questions are either resolved or explicitly block named tasks
- [ ] Developer has approved the final spec (status set to `approved`)
- [ ] Spec is under 150 lines

## References

- `@docs/spec-template.md` — section structure and inline guidance
- `@docs/building-blocks.md` — building block type dictionary (names, descriptions, when to use each)
- `@docs/architecture.md` — project structure, architectural decisions, conventions
