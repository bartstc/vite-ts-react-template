# Spec-Driven Development

This document describes how we use spec-driven development (SDD) in this codebase. It tells you what SDD is, why we
use it, how the parts connect, and how to work in the system as a contributor.

## Why spec-driven development

AI coding agents write code well, but they are not reliable when they make design decisions. Without constraints, an
agent writes code that works but does not fit the architecture, misses edge cases, or solves a different problem.
Spec-driven development prevents this, because it separates _what to build_ from _how to build it_.

Thus, the spec itself is the bottleneck. Most teams write specifications for human developers. These documents are not
exact, because a skilled engineer fills the gaps with judgment, domain knowledge, and intuition. Agents do not fill
gaps. They hallucinate across them. A machine-readable spec must be explicit about all that a human reader infers:

- boundary conditions
- failure modes
- architectural constraints
- the reasons for decisions.

The discipline is not how to use agents. It is how to separate _what you know_ from _what you assume_.

The spec is a short set of documents (approximately 200 lines in total, split across `requirements.md`, `design.md`,
and `tasks.md`). It records intent, constraints, and sequence _before_ anybody writes code. It has three purposes:

1. **It reduces ambiguity.** The agent works from explicit behavioral requirements. It does not infer intent from vague
   prompts.
2. **It gives traceability.** Each requirement has an ID, and each task traces to a requirement. Thus, nothing gets
   lost and the agent invents nothing.
3. **It keeps humans in control.** Four review gates make sure that the developer approves the direction before the
   implementation starts.

---

## When to use a spec

Not every change needs a spec. We use a complexity model with three tiers:

| Tier          | Trigger                                                                                      | Process                                                                                                                              |
| ------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| **Quick fix** | Config edits, CSS fixes, helper functions, changes to one file, changes only to presentation | No spec. Write the code.                                                                                                             |
| **Plan mode** | 3+ steps or architectural decisions, but < 10 files and < 5 unconstrained decisions          | The agent enters plan mode, writes the approach, gets the approval of the developer, then writes the code. It creates no spec files. |
| **Full spec** | 10+ files, 5+ unconstrained decisions, or the developer asks for a spec                      | Use the `writing-spec` skill to write `requirements.md`, `design.md`, and `tasks.md` together before anybody writes code.            |

The threshold is conservative on purpose. A spec adds 15–30 minutes of work at the start, but it prevents hours of
rework when the agent builds the wrong thing.

---

## How the parts connect

The SDD system has many connected files:

```
CLAUDE.md                          ← Agent behavior rules (plan mode, verification, self-improvement)
docs/
  architecture.md                  ← Project structure, layers, dependency rules
specs/
  NNN-feature-name/
    requirements.md                ← Intent layer (Goal, Requirements, Non-Goals)
    design.md                      ← Approach layer (Building Blocks Diff, Decisions, Boundaries)
    tasks.md                       ← Sequencing layer (Tasks, Edge Cases, Open Questions)
    contracts/                     ← Optional — design fragments for complex blocks (signal-driven)
  lessons.md                       ← Accumulated learnings from past implementations
.agents/skills/
  writing-spec/
    SKILL.md                       ← Four-phase gated workflow for writing specs
    templates/
      requirements-template.md     ← Section structure for requirements
      design-template.md           ← Section structure for design
      tasks-template.md            ← Section structure for tasks
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
     ├──► templates/
     │      requirements-template.md ──► intent section structure
     │      design-template.md       ──► approach section structure
     │      tasks-template.md        ──► sequencing section structure
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

1. **CLAUDE.md** tells the agent _when_ to write a spec (10+ files or 5+ decisions). It also makes plan mode the first
   step of the workflow.
2. **writing-spec/SKILL.md** controls the _how_: the collaborative process in four phases.
3. **writing-spec/templates/** gives the _structure_: three section templates, one for each spec file (requirements,
   design, tasks).
4. **building-blocks/SKILL.md** gives the _vocabulary_: typed names of building blocks. The Building Blocks Diff section
   of `design.md` refers to these names.
5. **architecture.md** gives the _context_: project structure, layer rules, and state management patterns.
6. **specs/lessons.md** gives _accumulated wisdom_: patterns from past errors that go back into future specs.

---

## The spec templates

Each spec uses a fixed section structure, split across three files. Each template is in
`.agents/skills/writing-spec/templates/` and agrees with one of the three layers: intent, approach, sequencing.

### Meta (required, in each file)

Each file has its own Meta block in the front matter. The block records the status: `draft` → `review` → `approved` →
`implementing` → `done` → `archived`. Thus, you can see the lifecycle of each artifact separately.

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

### `requirements.md` — Intent layer

The intent layer records what the feature must do, not how. It is the smallest and most stable file (cap: ≤50 lines).

#### Section 1: Goal & Context (required)

This section has 2–5 sentences. They answer the question: _what problem does this solve, and why now_? The section
constrains intent, not approach. The agent reads it to understand the purpose. If the agent cannot explain the goal,
the definition of the feature is not sufficient.

#### Section 2: Requirements (required)

This section contains behavioral requirements in **EARS notation** (Easy Approach to Requirements Syntax). Each
requirement uses this pattern:

```
WHEN [condition] THE SYSTEM SHALL [behavior].
```

Each requirement gets a stable ID (R1, R2, R3, …) for traceability. Tasks in `tasks.md` (Section 1) refer to these IDs.

**Why EARS?** Traditional requirements are often vague ("the form should validate properly"). EARS makes each
requirement a clear statement that you can test, and that constrains exactly one behavior that you can observe. The
agent cannot misinterpret "WHEN the login form is submitted with an empty email field, THE SYSTEM SHALL display an
inline validation error without making an API call."

Alistair Mavin developed EARS at Rolls-Royce. The paper
[_Easy Approach to Requirements Syntax (EARS)_](https://ieeexplore.ieee.org/document/5328509) documents it. EARS has
five patterns:

| Pattern           | Template                                        | Use when                                     |
| ----------------- | ----------------------------------------------- | -------------------------------------------- |
| Ubiquitous        | THE SYSTEM SHALL [behavior]                     | The behavior always applies                  |
| Event-driven      | WHEN [event] THE SYSTEM SHALL [behavior]        | A response to a trigger                      |
| State-driven      | WHILE [state] THE SYSTEM SHALL [behavior]       | A behavior that continues during a condition |
| Unwanted behavior | IF [condition] THEN THE SYSTEM SHALL [behavior] | Error handling, fallbacks                    |
| Optional          | WHERE [feature] THE SYSTEM SHALL [behavior]     | A behavior that you can configure            |

In practice, most frontend requirements use the event-driven pattern (WHEN/SHALL).

#### Section 3: Non-Goals (required)

This section is an explicit list of what the feature will NOT do. It prevents scope creep. It also stops the agent when
it wants to "helpfully" add capabilities that nobody asked for.

### `design.md` — Approach layer

The approach layer describes which building blocks change and the lane of the agent. It is the file with the most
architecture (cap: ≤80 lines).

#### Section 1: Building Blocks Diff (required)

This section is the core of the spec. It lists each building block that is **added**, **modified**, or **deleted**,
with its name and type from the building blocks catalog. It contains no implementation details. The agent reads the
rule file of the related building block to understand the pattern.

Example:

```markdown
### Added

- `loginMutation` (mutation) — handles POST /auth/login
- `LoginForm` (component) — form with email/password fields

### Modified

- `AppRouter` (route) — add /login route
- `authStore` (store) — add `isAuthenticated` derived state
```

#### Section 2: Design Decisions (required for non-trivial features)

This section lists the key choices with a short reason: what you selected, what you rejected, and why. Keep it short
(2–4 decisions at most). If you need more, split the feature.

#### Section 3: Boundaries (required)

This section has three tiers. They control what the agent can do without a human:

- ✅ **Always** — continue without a question (for example, create files in `src/features/auth/`)
- ⚠️ **Ask first** — needs human approval (for example, change API contracts, add dependencies)
- 🚫 **Never** — hard stops (for example, change core auth internals, remove tests, commit secrets)

This pattern comes from
[the GitHub analysis of 2,500+ agent configuration files](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/).
In that analysis, "Never commit secrets" was the constraint with the most effect.

### `tasks.md` — Sequencing layer

The sequencing layer divides the design into ordered work units that you can trace. Here, requirements meet execution
(cap: ≤70 lines).

#### Section 1: Task Breakdown (required)

This section is an ordered list of tasks that you can test independently. Each task:

- Refers to building blocks from `design.md` (section 1)
- Traces to requirement IDs (R1, R2, …) from `requirements.md`
- Includes the target file paths
- Has the mark `[P]` (can run in parallel) or `[S]` (sequential)

#### Section 2: Error & Edge Cases (optional but recommended)

This section uses the **GIVEN/WHEN/THEN** format (from BDD) for precision:

```
GIVEN the user is already authenticated,
WHEN they navigate to /login,
THEN redirect to dashboard.
```

If you skip this section, the agent will guess, and the guess will be wrong.

#### Sections 3–5

- **Acceptance Criteria** (optional) — a high-level checklist for "done". It often repeats the requirements, if the
  requirements are precise.
- **Open Questions** (optional) — decisions without an answer that block specific tasks.
- **References** (optional) — links to related specs, mockups, API docs.

### `contracts/` — Design fragments for complex blocks (optional)

`design.md` refers to building blocks only by name and type. The building-blocks catalog contains their internals. This
does not work for **complex blocks**. A complex block has one or more of these signals:

- It moves through many states.
- It contains structured internal state.
- It encodes branching domain rules.
- It coordinates across slices.
- It matches no canonical pattern.

Their design becomes clear during spec writing, but it has no location unless `design.md` becomes too large.

When a block has one of these complexity signals, the agent proposes a contract in Phase 2. The **developer approves
each contract**. The agent proposes a contract only because of a signal, never as boilerplate. An approved contract
becomes `contracts/{block-slug}.md`. This is a design fragment of ≤80 lines (problem, structured shape as pseudocode,
reason, open questions). The entry of the block in `design.md` links to it. Most specs need no contracts. If no block
has a signal, the directory does not exist. Contracts are **not included in the total cap of ~200 lines**. Instead, a
high number of contracts shows that you must split the feature.

---

## The writing workflow

The `writing-spec` skill guides the developer through a process in four phases. Each phase ends with a human review
gate. The agent does not go to the next phase without explicit approval.

### Phase 1 — Goal & Scope (Intent)

The developer describes the feature. The agent writes a draft of `requirements.md`: Goal & Context, Requirements
(EARS), and Non-Goals. Before the draft, the agent asks 3–5 questions about scope boundaries, error scenarios, and
assumptions that nobody stated.

**Key principle:** The agent never invents requirements. If the developer did not specify a behavior, the agent asks
about it.

### Phase 2 — Design (Approach)

The agent writes a draft of `design.md`. It proposes a Building Blocks Diff. For non-trivial features, it also proposes
two possible designs with their tradeoffs. The developer selects one. The selected design and the reason go into Design
Decisions. The agent writes a draft of the Boundaries.

**Key principle:** Building blocks have only a name and type. The spec contains no implementation details. The spec
describes a _change to the status quo_, not the code itself.

### Phase 3 — Spec (Sequencing)

The agent writes a draft of `tasks.md`. It divides the work into tasks, traces them to requirement IDs from
`requirements.md`, and puts them in order. It documents error and edge cases in GIVEN/WHEN/THEN. It records open
questions.

### Phase 4 — Review & Finalize

The agent does a structured self-audit and shows the findings:

- **Coverage matrix** — each requirement ID mapped to the tasks that implement it. It flags requirements with zero
  tasks.
- **Orphan tasks** — tasks that do not trace to a requirement.
- **EARS compliance** — it flags requirements without WHEN/SHALL or with vague language.
- **Boundary specificity** — it flags boundary items that refer to vague categories instead of file paths.
- **Building block references** — it flags blocks that are not in the catalog.
- **Line count** — it reports the count of each file and the total. Caps: `requirements.md` ≤50, `design.md` ≤80,
  `tasks.md` ≤70, total ≤200. If a file is above its cap, it identifies the large sections to compress or extract.

The agent fixes the issues before it shows the final spec for the approval of the developer.

---

## Building blocks

Building blocks are typed, named patterns. They are the architectural vocabulary of the project. When a spec says
`loginMutation (mutation)`, that name maps to a specific pattern with defined constraints, a layer, and a canonical code
example.

### The catalog

The building blocks catalog is in `skills/building-blocks/`. It uses progressive disclosure:

- **SKILL.md** — a summary index table with the block name, layer, and a description of one line. The agent reads it to
  know _which_ blocks exist.
- **rules/{block-name}.md** — the full description, constraints, and canonical example. The agent reads these files
  _only when it implements_ a specific block.

### Block categories

| Category           | Blocks                                                                                                                              | What they cover                                                      |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Data Fetching      | `mutation-hook`, `query-options-factory`, `query-keys-factory`, `dto-model`                                                         | Server reads and writes, cache keys, API response types              |
| State Management   | `store`, `provider`                                                                                                                 | Zustand stores, dependency injection with React Context              |
| App Orchestration  | `use-case-hook`                                                                                                                     | Operations at feature level that compose mutations and notifications |
| Component Patterns | `notification-hook`, `pure-component`, `compound-component`, `form`, `hoc`, `error-boundary`, `page`, `facade-hook`, `named-effect` | UI components, hooks, and composition patterns                       |
| Data Modeling      | `frontend-model`, `value-object`                                                                                                    | Domain types, groups of logic based on values                        |

### How specs refer to building blocks

In `design.md` (Building Blocks Diff), each entry refers to a block by name and type:

```markdown
- `addToCartMutation` (mutation-hook) — handles PUT /carts/:id
```

Then the agent reads `rules/mutation-hook.md` to understand the implementation pattern: the conventions for error
handling, the approach to cache invalidation, the shape of the return tuple, and more.

---

## Architecture integration

The spec system works in the feature slice architecture of the project, which `docs/architecture.md` documents. These
key architectural constraints have an effect on spec writing:

**Feature layers:** Each feature has four layers: `components/`, `application/`, `providers/`, `models/`. Building
blocks map to specific layers (for example, `mutation-hook` → `providers/`, `use-case-hook` → `application/`).

**Dependency rules:** Components and application import from models and providers. Providers and models have no
internal feature dependencies. Code that is specific to a library (React Query, and more) stays in providers and never
goes outside.

**API layer:** All HTTP logic starts in `src/lib/api/` (query options factories, mutations, DTOs by resource). Then the
`providers/` of the related feature expose it.

**State management:**

| Tool        | Use case                                                             |
| ----------- | -------------------------------------------------------------------- |
| XState      | State orchestration with explicit states and constrained transitions |
| Zustand     | Complex local state (auth, modals, and more)                         |
| React Query | Server state and caching                                             |
| React state | Simple component state                                               |

---

## Self-improvement loop

After a correction, the agent records a lesson in the inbox in `specs/lessons.md`. The dev triages lessons with
`/triage-lessons` and promotes each one into a sensor, playbook or principle. Thus, specs and implementations improve
over time. Refer to
[coding-harness.md → Learning loop](./coding-harness.md#learning-loop--a-codebase-that-improves-itself).

---

## Anti-patterns

The system prevents these usual failure modes:

**A spec that is really a task list.** "First create the model, then add the service" constrains the sequence but not
the intent. The agent follows each step and still builds the wrong thing. Fix: write the requirements first, and then
get the tasks from them.

**Over-specification that becomes code.** If the spec includes TypeScript interfaces, database DDL, or code snippets,
it went from "what" into "how". Implementation details belong in building block patterns and the code that exists, not
in the spec.

**Under-specification that makes the agent guess.** "Handle errors gracefully" without _which_ errors and _what_
"gracefully" means makes sure that the agent will guess. Fix: use GIVEN/WHEN/THEN for each error scenario.

**Specs that an LLM generates without human input.** Research shows that context files that an LLM generates can
decrease the rate of task success. The developer controls the content. The agent gives it structure and challenges it.

**Specs above their caps.** Each file has its own cap (`requirements.md` ≤50, `design.md` ≤80, `tasks.md` ≤70), and
the total spec should stay at ≤200 lines. If the cost of the review is more than the value, the spec does not do its
purpose. Split the feature or compress the spec. If a section is long, it probably contains content that belongs in
architecture docs or coding standards.

---

## Quick reference for contributors

**How to start a new feature:**

1. Describe the feature to the agent.
2. If the feature has 10+ files or 5+ design decisions, the agent starts the spec workflow.
3. Work together through the four phases. Review and approve each phase before you go to the next.
4. After the approval of the spec, the implementation starts, task by task.

**How to work on a spec that exists:**

- Specs are in `specs/NNN-feature-name/`. Each spec has three files: `requirements.md`, `design.md`, `tasks.md`.
- Check the `status` field in the Meta block of the front matter of each file.
- The task breakdown in `tasks.md` (Section 1) shows what is done and what remains.
- Open questions in `tasks.md` (Section 4) can block specific tasks.

**How to add a new building block:**

1. Create `skills/building-blocks/rules/{block-name}.md` in the format of the blocks that exist.
2. Add the block to the catalog table in `skills/building-blocks/SKILL.md`.
3. Use the block name in future specs.

---

## References

### Project files

- `CLAUDE.md` — agent behavior rules and workflow principles
- `docs/architecture.md` — project structure, layers, dependency rules
- `.agents/skills/writing-spec/SKILL.md` — workflow in four phases to write specs
- `.agents/skills/writing-spec/templates/{requirements,design,tasks}-template.md` — section structure with inline
  guidance
- `.agents/skills/building-blocks/SKILL.md` — index of the building block catalog
- `specs/lessons.md` — accumulated learnings from past implementations

### External references

- [GitHub Spec Kit](https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/) — the open-source SDD toolkit of GitHub
- [Addy Osmani: How to write a good spec for AI agents](https://addyosmani.com/blog/good-spec/) — five principles for effective AI specs
- [Matt Rickard: The Spec Layer](https://blog.matt-rickard.com/p/the-spec-layer) — specs as a constraint layer between humans and AI
- [Birgitta Böckeler: Understanding Spec-Driven Development](https://martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html) — comparative analysis of SDD tools (Thoughtworks/Martin Fowler)
- [Birgitta Böckeler: Harness Engineering](https://martinfowler.com/articles/harness-engineering.html) — the guides vs. sensors framework for AI agent constraints
- [EARS: Easy Approach to Requirements Syntax](https://ieeexplore.ieee.org/document/5328509) — the requirements notation that we use (Alistair Mavin, Rolls-Royce)
- [GitHub: Lessons from 2,500+ agent configurations](https://github.blog/ai-and-ml/github-copilot/how-to-write-a-great-agents-md-lessons-from-over-2500-repositories/) — findings from data about effective agent constraints
- [Eng Leadership: How to Do AI-Assisted Engineering](https://newsletter.eng-leadership.com/p/how-to-do-ai-assisted-engineering) — a survey of 15 engineering leaders about SDD practices
