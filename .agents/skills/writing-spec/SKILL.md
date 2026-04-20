---
name: writing-spec
description: Collaboratively write a feature spec with the developer. Trigger when a task involves 5+ unconstrained decisions, spans 5+ files, or the developer explicitly asks for a spec. Do NOT trigger for config edits, CSS fixes, helper functions, exploratory prototyping, presentation-only changes, or when the developer explicitly opts out.
---

## Purpose

Guide the developer through writing a feature spec before any code is written. The spec constrains intent and approach so implementation decisions are explicit, reviewed, and traceable. This skill produces a single `spec.md` file in `specs/NNN-feature-name/` using the project template at `@docs/spec-template.md`.

## Prerequisites

- Read `@docs/spec-template.md` before starting — it defines the section structure
- Read `@docs/architecture.md` to understand current building block types and project structure
- Determine the next available sequence number by checking both `specs/` directory listings AND `git log` for prior spec-related commits — use the higher of the two

## Workflow: Four Phases with Gates

Each phase ends with a human review gate. Do NOT advance to the next phase without explicit developer approval ("continue", "ok", "next", "looks good", or similar). If something goes wrong, STOP and re-plan — do not push forward.

### Phase 1 — Goal & Scope (Intent)

Collaborate with the developer to fill sections 1-3 of the template.

1. Ask the developer to describe the feature in 2-5 sentences (or accept what they've already provided)
2. Before drafting, ask 3-5 clarifying questions about scope boundaries, error scenarios, and unstated assumptions — only where the answer would change the spec. Skip obvious ones.
3. Draft the **Goal & Context** section — focus on the problem, not the solution
4. Draft **Requirements** using EARS notation: `WHEN [condition] THE SYSTEM SHALL [behavior]`. Assign stable IDs (R1, R2, …)
5. Draft **Non-Goals** — ask: "What should this feature explicitly NOT do?"
6. Present all three sections for review

**What to ask if unclear:** "What's the observable user behavior when this works correctly?" Never invent requirements — if the developer hasn't specified a behavior, ask about it.

### Phase 2 — Design (Approach)

Collaborate on sections 4-6 of the template.

1. Propose a **Building Blocks Diff** — list every block that is ADDED, MODIFIED, or DELETED. Use the project's building block taxonomy from `.agents/skills/building-blocks/SKILL.md`. Reference by **name and type only** — do not define internals. Implementation details belong in coding standards and per-type skills, not specs. For changes that don't map to a typed building block, use the target file path + a short description instead. Test building blocks `unit-test` and `component-story-test` are NOT listed here — they are implied by the Test Plan in section 9. `msw-handler` and `fixture` ARE listed here when added or modified.
2. For non-trivial features, propose **two plausible designs** with tradeoffs. Let the developer choose. Capture the winner and rationale in **Design Decisions**
3. Draft the **Boundaries** section using the three-tier system:
   - ✅ **Always** — proceed without asking (e.g., create files in the feature directory)
   - ⚠️ **Ask first** — needs approval (e.g., modify API contracts, add dependencies, change schema)
   - 🚫 **Never** — hard stops (e.g., modify core auth, remove tests, commit secrets)
4. Present for review

**Critical rule for building blocks:** Reference names and types. Do NOT define contracts, interfaces, or implementation — those live in separate coding-standards skills and existing code. The spec describes a CHANGE to the status quo. The agent reads relevant code to see the current status quo.

### Phase 3 — Spec (Sequencing)

Fill sections 7-11 of the template.

1. Break work into a **Task Breakdown** — ordered, independently testable tasks. Each task:
   - References building blocks from section 4 if any are involved
   - Traces to requirement IDs (R1, R2, …), or marks support infrastructure tasks as "support task for R#, R#" when producing `msw-handler` or `fixture` blocks
   - Includes target file paths
   - Is marked `[P]` (parallelizable) or `[S]` (sequential)
2. Draft **Error & Edge Cases** using GIVEN/WHEN/THEN — cover failure modes (including fetch errors for data-fetching components), boundary conditions, concurrency
3. Draft the **Test Plan** (section 9 of the template) — but only if the spec introduces new testable behavior. Skip with a one-line notice when the changes are presentation-only, pure refactors, renames, or any change that leaves observable behavior identical. Map every R# to a layer (`storybook` or `vitest`) and a test — use the bare file name of the tested module or component (e.g., `CheckoutForm`, `priceFormatter`), not a full file path. Multiple R#s may point at the same test — that's fine and self-documenting.
4. Add **Open Questions** for anything unresolved that blocks a specific task
5. Present for review

### Phase 4 — Review & Finalize

1. Run a **structured self-audit** and present findings to the developer (don't silently verify — show the results):
   - **Coverage matrix**: for each requirement ID, list which task(s) implement it. Flag any requirement with zero tasks
   - **Test coverage completeness**: when Section 9 (Test Plan) is present, verify every R# from section 2 appears in the table with a layer (`storybook` / `vitest`) and a test. Flag any missing R#. When Section 9 is skipped, verify the skip notice is present and accurately reflects the change (presentation-only, pure refactor, rename, or other change with no new testable behavior)
   - **Orphan tasks**: flag any task that doesn't trace back to a requirement ID
   - **EARS compliance**: flag any requirement missing WHEN/THE SYSTEM SHALL or using vague language ("handle properly", "work correctly")
   - **Test infrastructure traceability**: tasks that produce `msw-handler` or `fixture` blocks are exempt from R# traceability. They must instead trace to at least one other task that uses them. Flag any `msw-handler`/`fixture` task with no consumer task
   - **Boundary specificity**: flag any boundary item (✅/⚠️/🚫) that references a vague category instead of a file path or module name
   - **Building block references**: flag any block in Section 4 that doesn't exist in the building-blocks catalog. Flag any `unit-test` or `component-story-test` incorrectly listed in Section 4 (these belong in the Test Plan, not the Building Blocks Diff)
   - **Line count**: report total. If >130 and ≤150, surface to the developer: "This spec is at N lines (approaching the 150 ceiling). Before we finalize, is there a natural seam where this could split into two specs?" If >150, identify which section to compress or extract, or split the feature
2. Fix any issues found in step 1 before proceeding
3. Set status to `review` in the Meta table
4. Present the audit results and the final spec for developer sign-off

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
- NEVER add boilerplate boundaries — every item in ✅/⚠️/🚫 must be reachable during implementation of this specific feature
- NEVER invent Layer values in the Test Plan outside `storybook` and `vitest`. If a requirement genuinely doesn't fit either, stop and ask the developer — it may mean the requirement is ill-formed
- NEVER map edge cases (GIVEN/WHEN/THEN bullets in section 8) as separate rows in the Test Plan. They are facets of their parent R# and are covered transitively
- NEVER list `unit-test` or `component-story-test` blocks in the Building Blocks Diff (section 4). They are implied by the Test Plan (section 9) and ride along with the component/module they verify. `msw-handler` and `fixture` ARE listed in section 4 when added or modified

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

- `loginMutation` (mutation-hook) — handles POST /auth/login
- `LoginForm` (pure-component) — email/password form with validation
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
- [ ] Every task traces to ≥1 requirement ID (or is marked as support infrastructure tracing to a consumer task)
- [ ] Building blocks reference name + type only, no implementation details
- [ ] Boundaries use specific file paths, not vague categories
- [ ] Open questions are either resolved or explicitly block named tasks
- [ ] Developer has approved the final spec (status set to `approved`)
- [ ] Spec is under 150 lines

## References

- `.agents/skills/building-blocks/SKILL.md` — building block type dictionary (names, descriptions, when to use each)
- `@docs/spec-template.md` — section structure and inline guidance
- `@docs/architecture.md` — project structure, architectural decisions, conventions
