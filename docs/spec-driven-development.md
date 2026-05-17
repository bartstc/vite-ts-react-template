# Spec-Driven Development

This document describes how we use spec-driven development (SDD) in this codebase — what it is, why we use it, how the pieces fit together, and how to work within the system as a contributor.

## Why spec-driven development

AI coding agents are effective at writing code but unreliable at making design decisions. Without constraints, an agent will produce working code that doesn't fit the architecture, misses edge cases, or solves a different problem than intended. Spec-driven development addresses this by separating _what to build_ from _how to build it_.

The bottleneck, then, is the spec itself. Most teams write specifications for human developers — documents loose enough that a skilled engineer fills the gaps with judgment, domain knowledge, and intuition. Agents don't fill gaps; they hallucinate across them. Writing machine-readable specs means being explicit about what a human reader would simply infer: boundary conditions, failure modes, architectural constraints, and the reasoning behind decisions. The discipline isn't learning to use agents — it's learning to separate _what you know_ from _what you're assuming_.

The spec is a short document (80–150 lines) that captures intent, constraints, and sequencing _before_ any code is written. It serves three purposes:

1. **Reduces ambiguity** — the agent works from explicit behavioral requirements instead of inferring intent from vague prompts.
2. **Creates traceability** — every requirement has an ID, every task traces to a requirement, so nothing gets lost or invented.
3. **Keeps humans in control** — four review gates ensure the developer approves direction before implementation begins.

---

## When to use a spec

Not every change needs a spec. We use a three-tier complexity model:

| Tier          | Trigger                                                                                   | Process                                                                                                        |
| ------------- | ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| **Quick fix** | Config edits, CSS fixes, helper functions, single-file changes, presentation-only changes | No spec. Just implement.                                                                                       |
| **Plan mode** | 3+ steps or architectural decisions, but < 5 files and < 5 unconstrained decisions        | Agent enters plan mode, outlines the approach, gets developer approval, then implements. No spec file created. |
| **Full spec** | 5+ files, 5+ unconstrained decisions, or developer explicitly requests a spec             | Use the `writing-spec` skill to collaboratively produce a `spec.md` before any code is written.                |

The threshold is intentionally conservative — a spec adds 15–30 minutes of upfront work but prevents hours of rework when the agent builds the wrong thing.

---

## How the pieces fit together

The SDD system consists of six interconnected files:

```
CLAUDE.md                          ← Agent behavior rules (plan mode, verification, self-improvement)
docs/
  architecture.md                  ← Project structure, layers, dependency rules
  spec-template.md                 ← Section structure for spec documents
specs/
  NNN-feature-name/
    spec.md                        ← Individual feature spec (produced by the workflow)
  lessons.md                       ← Accumulated learnings from past implementations
skills/
  writing-spec/SKILL.md            ← Four-phase gated workflow for writing specs
  building-blocks/
    SKILL.md                       ← Catalog index with short summaries
    rules/                         ← One file per building block (full pattern + example)
```

```
CLAUDE.md ──────────────────► when to spec / plan-mode rules
     │
     ▼
writing-spec/SKILL.md ──────► four-phase gated workflow
     │
     ├──► spec-template.md ──► section structure (Meta, R1…Rn, tasks…)
     │
     ├──► building-blocks/
     │       SKILL.md ────────► catalog index (block name + layer)
     │       rules/*.md ───────► full pattern per block (read at impl time)
     │
     ├──► architecture.md ────► layer rules, state mgmt, project structure
     │
     └──► specs/lessons.md ───► accumulated learnings (feedback loop)
```

The flow between these files:

1. **CLAUDE.md** tells the agent _when_ to write a spec (5+ files or 5+ decisions) and establishes the plan-mode-first workflow.
2. **writing-spec/SKILL.md** drives the _how_ — the four-phase collaborative process.
3. **spec-template.md** provides the _structure_ — the section template that the spec fills in.
4. **building-blocks/SKILL.md** provides the _vocabulary_ — typed building block names that the spec references in its Building Blocks Diff section.
5. **architecture.md** provides the _context_ — project structure, layer rules, and state management patterns.
6. **specs/lessons.md** provides _accumulated wisdom_ — patterns learned from past mistakes that feed back into future specs.

---

## The spec template

Every spec follows a fixed section structure defined in `docs/spec-template.md`. Here's what each section does and why:

### Meta (required)

Status tracking table — `draft` → `review` → `approved` → `implementing` → `done` → `archived`. Keeps the spec lifecycle visible.

```
                  ┌─────────────────────────────────────────────────┐
                  │             Session: Spec Writing               │
                  │   (writing-spec skill, four-phase gated flow)   │
                  │                                                 │
                  │   draft ──► review ──► approved                 │
                  │     ▲           │                               │
                  │     └───────────┘  (revisions loop back)        │
                  └───────────────────────────┬─────────────────────┘
                                              │
                                              ▼
                  ┌─────────────────────────────────────────────────┐
                  │           Session: Implementation               │
                  │         (building-blocks skill, task by task)   │
                  │                                                 │
                  │          approved ──► implementing ──► done     │
                  └───────────────────────────┬─────────────────────┘
                                              │
                                              ▼
                  ┌─────────────────────────────────────────────────┐
                  │              Session: Tests                     │
                  │           (test-building-blocks skill)          │
                  │                                                 │
                  │              done ──► testing ──► archived      │
                  └─────────────────────────────────────────────────┘
```

### Section 1: Goal & Context (required)

2–5 sentences answering _what problem does this solve and why now_. Constrains intent, not approach. The agent reads this to understand the purpose — if it can't explain the goal, the feature isn't well enough defined.

### Section 2: Requirements (required)

Behavioral requirements using **EARS notation** (Easy Approach to Requirements Syntax). Each requirement follows the pattern:

```
WHEN [condition] THE SYSTEM SHALL [behavior].
```

Each requirement gets a stable ID (R1, R2, R3, …) used for traceability — tasks in Section 7 reference these IDs.

**Why EARS?** Traditional requirements are often vague ("the form should validate properly"). EARS forces requirements into unambiguous, testable statements that constrain exactly one observable behavior. The agent can't misinterpret "WHEN the login form is submitted with an empty email field, THE SYSTEM SHALL display an inline validation error without making an API call."

EARS was developed by Alistair Mavin at Rolls-Royce and is documented in the paper [_Easy Approach to Requirements Syntax (EARS)_](https://ieeexplore.ieee.org/document/5328509). The five EARS patterns are:

| Pattern           | Template                                        | Use when                            |
| ----------------- | ----------------------------------------------- | ----------------------------------- |
| Ubiquitous        | THE SYSTEM SHALL [behavior]                     | Always-on behavior                  |
| Event-driven      | WHEN [event] THE SYSTEM SHALL [behavior]        | Response to a trigger               |
| State-driven      | WHILE [state] THE SYSTEM SHALL [behavior]       | Ongoing behavior during a condition |
| Unwanted behavior | IF [condition] THEN THE SYSTEM SHALL [behavior] | Error handling, fallbacks           |
| Optional          | WHERE [feature] THE SYSTEM SHALL [behavior]     | Configurable behavior               |

In practice, most frontend requirements use the event-driven pattern (WHEN/SHALL).

### Section 3: Non-Goals (required)

Explicit list of what the feature will NOT do. Prevents scope creep and stops the agent from "helpfully" adding unrequested capabilities.

### Section 4: Building Blocks Diff (required)

The core of the spec. Lists every building block that is **added**, **modified**, or **deleted** — referenced by name and type from the building blocks catalog. No implementation details. The agent reads the relevant building block rule file to understand the pattern.

Example:

```markdown
### Added

- `loginMutation` (mutation) — handles POST /auth/login
- `LoginForm` (component) — form with email/password fields

### Modified

- `AppRouter` (route) — add /login route
- `authStore` (store) — add `isAuthenticated` derived state
```

### Section 5: Design Decisions (required for non-trivial features)

Key choices with brief rationale — what you chose, what you rejected, and why. Kept short (2–4 decisions max). If you need more, the feature should be split.

### Section 6: Boundaries (required)

Three-tier classification controlling what the agent can do autonomously:

- ✅ **Always** — proceed without asking (e.g., create files in `src/features/auth/`)
- ⚠️ **Ask first** — needs human approval (e.g., modify API contracts, add dependencies)
- 🚫 **Never** — hard stops (e.g., modify core auth internals, remove tests, commit secrets)

This pattern comes from [GitHub's analysis of 2,500+ agent configuration files](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/), where "Never commit secrets" was the single most impactful constraint.

### Section 7: Task Breakdown (required)

Ordered list of independently testable tasks. Each task:

- References building blocks from Section 4
- Traces to requirement IDs (R1, R2, …)
- Includes target file paths
- Is marked `[P]` (parallelizable) or `[S]` (sequential)

### Section 8: Error & Edge Cases (optional but recommended)

Uses **GIVEN/WHEN/THEN** format (from BDD) for precision:

```
GIVEN the user is already authenticated,
WHEN they navigate to /login,
THEN redirect to dashboard.
```

If you skip this section, expect the agent to guess — and guess wrong.

### Sections 9–11

- **Acceptance Criteria** (optional) — high-level "done" checklist, often redundant if requirements are precise.
- **Open Questions** (optional) — unresolved decisions blocking specific tasks.
- **References** (optional) — links to related specs, mockups, API docs.

---

## The writing workflow

The `writing-spec` skill guides the developer through a four-phase process. Each phase ends with a human review gate — the agent does not advance without explicit approval.

### Phase 1 — Goal & Scope (Intent)

The developer describes the feature. The agent drafts Goal & Context, Requirements (EARS), and Non-Goals. Before drafting, the agent asks 3–5 clarifying questions about scope boundaries, error scenarios, and unstated assumptions.

**Key principle:** The agent never invents requirements. If the developer hasn't specified a behavior, the agent asks about it.

### Phase 2 — Design (Approach)

The agent proposes a Building Blocks Diff and, for non-trivial features, two plausible designs with tradeoffs. The developer chooses. The winner and rationale go into Design Decisions. Boundaries are drafted.

**Key principle:** Building blocks reference name + type only — no implementation details in the spec. The spec describes a _change to the status quo_, not the code itself.

### Phase 3 — Spec (Sequencing)

Tasks are broken down, traced to requirements, and ordered. Error & edge cases are documented in GIVEN/WHEN/THEN. Open questions are captured.

### Phase 4 — Review & Finalize

The agent runs a structured self-audit and presents findings:

- **Coverage matrix** — each requirement ID mapped to implementing tasks. Flags requirements with zero tasks.
- **Orphan tasks** — tasks that don't trace to any requirement.
- **EARS compliance** — flags requirements missing WHEN/SHALL or using vague language.
- **Boundary specificity** — flags boundary items referencing vague categories instead of file paths.
- **Building block references** — flags blocks not found in the catalog.
- **Line count** — reports total; identifies bloated sections if >150 lines.

Issues are fixed before presenting the final spec for developer sign-off.

---

## Building blocks

Building blocks are typed, named patterns that form the project's architectural vocabulary. When a spec says `loginMutation (mutation)`, that name maps to a specific pattern with defined constraints, layer placement, and a canonical code example.

### The catalog

The building blocks catalog lives in `skills/building-blocks/`. It uses progressive disclosure:

- **SKILL.md** — summary index table with block name, layer, and one-line description. The agent reads this to know _which_ blocks exist.
- **rules/{block-name}.md** — full description, constraints, and canonical example. The agent reads these _only when implementing_ a specific block.

### Block categories

| Category           | Blocks                                                                                                                              | What they cover                                              |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Data Fetching      | `mutation-hook`, `query-options-factory`, `query-keys-factory`, `dto-model`                                                         | Server reads/writes, cache keys, API response types          |
| State Management   | `store`, `provider`                                                                                                                 | Zustand stores, React Context dependency injection           |
| App Orchestration  | `use-case-hook`                                                                                                                     | Feature-level operations composing mutations + notifications |
| Component Patterns | `notification-hook`, `pure-component`, `compound-component`, `form`, `hoc`, `error-boundary`, `page`, `facade-hook`, `named-effect` | UI components, hooks, and composition patterns               |
| Data Modeling      | `frontend-model`, `value-object`                                                                                                    | Domain types, value-based logic grouping                     |

### How specs reference building blocks

In the spec's Section 4 (Building Blocks Diff), each entry references a block by name and type:

```markdown
- `addToCartMutation` (mutation-hook) — handles PUT /carts/:id
```

The agent then reads `rules/mutation-hook.md` to understand the implementation pattern — error handling conventions, cache invalidation approach, return tuple shape, etc.

---

## Architecture integration

The spec system works within the project's feature slice architecture documented in `docs/architecture.md`. Key architectural constraints that affect spec writing:

**Feature layers:** Each feature has four layers — `components/`, `application/`, `providers/`, `models/`. Building blocks map to specific layers (e.g., `mutation-hook` → `providers/`, `use-case-hook` → `application/`).

**Dependency rules:** Components and application import from models and providers. Providers and models have no internal feature dependencies. Library-specific code (React Query, etc.) stays inside providers — never leaks beyond.

**API layer:** All HTTP logic starts in `src/lib/api/` (query options factories, mutations, DTOs by resource), then gets exposed through the relevant feature's `providers/`.

**State management:**

| Tool        | Use case                                                             |
| ----------- | -------------------------------------------------------------------- |
| XState      | State orchestration with explicit states and constrained transitions |
| Zustand     | Complex local state (auth, modals, etc.)                             |
| React Query | Server state and caching                                             |
| React state | Simple component state                                               |

---

## Self-improvement loop

After every implementation, the agent captures lessons learned in `specs/lessons.md` — patterns that caused rework, misunderstandings, or repeated mistakes. This file is reviewed at the start of each session so the same mistake doesn't happen twice.

This creates a feedback loop: specs improve over time as lessons accumulate, and the agent's behavior becomes more aligned with the team's expectations.

---

## Anti-patterns

These are common failure modes the system is designed to prevent:

**Spec that's actually a task list.** "First create the model, then add the service" constrains sequencing but not intent. The agent follows every step and still builds the wrong thing. Fix: write requirements first, derive tasks from them.

**Over-specification that becomes code.** If the spec includes TypeScript interfaces, database DDL, or code snippets, it has crossed from "what" into "how." Implementation details belong in building block patterns and existing code, not the spec.

**Under-specification that forces guessing.** "Handle errors gracefully" without specifying _which_ errors and _what_ "gracefully" means guarantees the agent will guess. Fix: use GIVEN/WHEN/THEN for every error scenario.

**Auto-generated specs without human input.** LLM-generated context files have been shown to reduce task success rates. The developer drives content; the agent structures and challenges it.

**Specs exceeding 150 lines.** If the review cost exceeds the value, the spec fails its purpose. Split the feature or compress the spec. If a section is long, it likely contains content that belongs in architecture docs or coding standards instead.

---

## Quick reference for contributors

**Starting a new feature:**

1. Describe the feature to the agent.
2. If it spans 5+ files or involves 5+ design decisions, the agent will initiate the spec workflow.
3. Collaborate through four phases — review and approve each before moving on.
4. Once the spec is approved, implementation begins task by task.

**Working on an existing spec:**

- Specs live in `specs/NNN-feature-name/spec.md`.
- Check the `Status` field in the Meta table.
- The task breakdown in Section 7 shows what's done and what remains.
- Open questions in Section 10 may block specific tasks.

**Adding a new building block:**

1. Create `skills/building-blocks/rules/{block-name}.md` following the format of existing blocks.
2. Add the block to the catalog table in `skills/building-blocks/SKILL.md`.
3. Use the block name in future specs.

---

## References

### Project files

- `CLAUDE.md` — agent behavior rules and workflow principles
- `docs/architecture.md` — project structure, layers, dependency rules
- `docs/spec-template.md` — spec section structure with inline guidance
- `skills/writing-spec/SKILL.md` — four-phase spec writing workflow
- `skills/building-blocks/SKILL.md` — building block catalog index
- `specs/lessons.md` — accumulated learnings from past implementations

### External references

- [GitHub Spec Kit](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/) — GitHub's open-source SDD toolkit
- [Addy Osmani: How to write a good spec for AI agents](https://addyosmani.com/blog/good-spec/) — five principles for effective AI specs
- [Matt Rickard: The Spec Layer](https://blog.matt-rickard.com/p/the-spec-layer) — specs as a constraint layer between humans and AI
- [Birgitta Böckeler: Understanding Spec-Driven Development](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html) — comparative analysis of SDD tools (Thoughtworks/Martin Fowler)
- [Birgitta Böckeler: Harness Engineering](https://martinfowler.com/articles/harness-engineering.html) — guides vs. sensors framework for AI agent constraints
- [EARS: Easy Approach to Requirements Syntax](https://ieeexplore.ieee.org/document/5328509) — the requirements notation we use (Alistair Mavin, Rolls-Royce)
- [GitHub: Lessons from 2,500+ agent configurations](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/) — data-driven findings on effective agent constraints
- [Eng Leadership: How to Do AI-Assisted Engineering](https://newsletter.eng-leadership.com/p/how-to-do-ai-assisted-engineering) — survey of 15 engineering leaders on SDD practices
