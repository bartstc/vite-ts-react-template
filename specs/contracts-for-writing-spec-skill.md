# Add Contract Files to the writing-spec Skill

## Context

The `writing-spec` skill deliberately keeps `design.md` thin: the **Building Blocks Diff** references blocks by **name + type only**, with a hard rule against defining internals (interfaces, schemas, code). This works for _cataloged_ blocks — at implementation time the agent reads `.agents/skills/building-blocks/rules/{type}.md` for the canonical pattern.

But it breaks down for **complex blocks**. When a feature needs a block that moves through several states, holds structured internal state, encodes branching domain rules, coordinates across slices, or has no canonical pattern to look up, real design thinking surfaces _during_ spec generation. Today that thinking has nowhere to go: it either gets lost, or it gets crammed into `design.md` — blowing the 80-line cap and violating the "no internals" rule.

This change adds an optional **`contracts/` subdirectory** inside each spec folder. When a block is genuinely complex, the agent proposes a contract file that captures its design (pseudocode / structured shape + rationale + open questions). The proposal is **signal-driven and justified**, never boilerplate — pure components and pages don't get contracts unless complexity signals are actually present, and the developer approves each one.

This keeps `design.md` thin (still name + type, now with a link to the contract), keeps the spec's combined ~200-line cap intact (contracts are excluded), and gives complex blocks a home for design that the rule-file catalog cannot provide.

## Decisions (confirmed with developer)

- **Trigger** — Agent proposes contract candidates in Phase 2; **developer approves each**. Proposals are signal-driven, not blind.
- **Heuristic** — Signal-based checklist. Agent proposes a block only when ≥1 concrete signal is present (see Signals below).
- **Skip rule** — If no block in the diff hits a signal, the contract step is skipped entirely — no `contracts/` directory, no proposals. Simple updates incur zero contract overhead.
- **Location** — `specs/NNN-feature-name/contracts/`. `design.md` links each contract (Building Blocks Diff entry).
- **Line caps** — Contracts are **excluded** from the combined ~200-line spec cap. Each contract has its **own cap: ≤80 lines** (matching `design.md`).
- **Contents** — Structured-per-block-kind (pseudocode / shape) **plus** a short rationale (design problem, why it matters) and open questions.
- **Proposal form** — Inline list in Phase 2, one line per candidate: block name + signal(s) hit + the design problem it addresses. Developer approves/rejects each. Proposals are ephemeral agent→developer output, never embedded in any template.
- **Contract frontmatter** — No `status` lifecycle. A contract is a design fragment of its parent spec, not an independently-tracked artifact — its lifecycle is the spec's. Frontmatter carries only identity fields (`schema_version`, `id`, `artifact: contract`, `block`, `block_type`, `author`, dates).

## Signals — when to propose a contract

Signals describe **properties of the design problem**, not block types. They are deliberately decoupled from the building-blocks catalog so they survive the catalog changing. A block warrants a contract proposal if **≥1** signal holds:

1. **Multiple states & transitions** — the block moves through several discrete states with conditional or guarded transitions between them.
2. **Structured internal state** — more than a couple of flat fields: derived values, interdependent fields, or normalized collections.
3. **Branching domain logic** — conditional rules, invariants, or multi-step computation where the rules themselves are the design.
4. **Cross-slice coordination** — behavior depends on wiring into another feature or sub-feature slice; the seam (callback, slot, render-prop) needs design.
5. **No canonical pattern** — the block matches no established pattern the agent can look up, so its shape must be designed from scratch.

Cross-field form validation and staged submission are intentionally **not** a separate signal — they fall under signal 3 when the logic is genuinely complex.

Contracts are **signal-driven, not type-driven**: a block gets a contract because a signal genuinely holds, never because of what kind of block it is. Most blocks — a simple props-in/JSX-out component, a route-level page, a thin context wrapper, a straight pass-through data type — hit zero signals and get nothing. If no block in the diff hits a signal, skip the contract step entirely — no `contracts/` directory, no proposals.

## Implementation Constraint — Conciseness Is Non-Negotiable

This change adds prose to a skill whose entire premise is that **longer instructions get followed less reliably** (the curse of instructions). Every line added here is a line the agent must obey at spec-writing time. So:

- **Dense, not verbose.** Every sentence added to `SKILL.md`, the templates, or the doc must change what the reader does. If it doesn't, cut it. No restating, no hedging, no "note that…".
- **Precise, not vague.** Concise must not mean lossy — keep exact paths, exact caps, exact rule wording. Trim words, never specifics.
- **Match the existing register.** The skill and templates are terse and imperative. New text must be indistinguishable in density from what's already there — do not pad to look thorough.
- **Net additions are small.** SKILL.md should grow by a handful of lines, not a section. The contract template is ≤80 lines including frontmatter and examples; trim examples before guidance if it overflows.
- **Self-check before done:** re-read every added passage and delete any clause that doesn't earn its place.

## Files to Modify / Create

### 1. `.agents/skills/writing-spec/SKILL.md` (MODIFY)

- **Prerequisites** — add: read `./templates/contract-template.md`.
- **Phase 2 — Design** — insert a new step **after step 2 (Cross-slice concerns)**, before Design Decisions. It must run after Cross-slice concerns because signal 4 depends on the cross-slice wiring decision being made first:
  - _"Identify contract candidates."_ For each block in the diff, check the signal checklist. For every block hitting ≥1 signal, present an inline proposal — one line each: `` `blockName` (type) — <signal(s) hit>; design problem: <one phrase>``. Developer approves/rejects each. For approved blocks, create `specs/NNN-feature-name/contracts/{block-slug}.md` (slug = block name kebab-cased, per `code-style.md`) from the contract template and add a link in the `design.md` Building Blocks Diff entry. For a block whose name slugifies to a collision, suffix the type (e.g. `review-form-store.md`).
  - State the negative rule inline: contracts are signal-driven, not type-driven — most blocks hit zero signals and get nothing. If no block hits a signal, skip the step entirely — no `contracts/` directory, no proposals.
  - When a block hits a signal but the developer rejects the proposal (or the agent judges it trivial), record the skip reason inline in that block's `design.md` entry — e.g. `` `fooStore` (store) — contract skipped: shape is flat ``. This is what the Phase 4 audit checks against.
- **Phase 4 — Review & Finalize / self-audit** — add audit checks:
  - **Contract coverage**: every contract file links back from a `design.md` block entry; every `design.md` block that hits a signal either has a contract or an inline skip reason in its entry.
  - **Contract line count**: each contract ≤80 lines; contracts excluded from the combined ≤200 cap (report separately).
  - **Contract count**: no hard cap. Report the count. A high count (e.g. >3) is a signal to the developer that the feature should be split into separate specs — surface it, don't enforce it.
- **Existing audit check reconciliation** — the current "Building block references" check flags any block not in the catalog. Amend it: a block with no catalog match is **acceptable if it has a contract** (signal 5 — no canonical pattern); without one it is still flagged.
- **Rules & Constraints** — clarify: `design.md` still references name + type only; _internals/pseudocode for complex blocks belong in `contracts/`, never in `design.md`_. Contracts are the one sanctioned place for block-shape detail in a spec. Also state the rationale-boundary rule: **cross-block decisions go in `design.md` Design Decisions; intra-block shape rationale goes in the contract — never duplicate the same decision in both.**
- **Line-count caps text** — note contracts are excluded from the ~200 combined cap and capped individually at 80 lines.
- **Exit Criteria** — add: every proposed-and-approved contract is filled and linked from `design.md`; contracts within the 80-line cap.
- **References** — add `./templates/contract-template.md`.

### 2. `.agents/skills/writing-spec/templates/contract-template.md` (CREATE)

New template, ≤80 lines, with YAML frontmatter consistent with the other templates **minus `status`** (`schema_version`, `id`, `artifact: contract`, `block`, `block_type`, `author`, `created`, `last_updated`). No `status` field — a contract's lifecycle is its parent spec's. Sections:

- **Design Problem** (REQUIRED) — 2–3 sentences: what's ambiguous/complex about this block and why it matters.
- **Shape** (REQUIRED) — structured by the signal(s) the block hit, expressed as **pseudocode or a structured outline, not real implementation**. Pick the relevant shape(s); a block may hit several:
  - _stateful_ — states, events, transitions/guards
  - _data shape_ — fields, derived values, invariants
  - _logic_ — operations (signatures), rules, edge cases
  - _coordination_ — the seam: who calls what, with what payload
  - In all cases lead with inputs → outputs → key behaviors.
- **Rationale** (REQUIRED) — what was chosen and what was rejected for _this block's shape_, briefly. Block-scoped only — cross-block decisions stay in `design.md` Design Decisions; do not duplicate.
- **Open Questions** (OPTIONAL) — unresolved decisions that block implementation of this block.

Template includes inline `<!-- -->` guidance and per-block-kind examples, matching the style of the existing three templates. Reinforce inline: pseudocode/shape only — no production code, no full TypeScript interfaces. **Verify the template is ≤80 lines after writing — per-block-kind examples plus four sections is tight; trim examples before the cap, not the guidance.**

### 3. `.agents/skills/writing-spec/templates/design-template.md` (MODIFY)

- In the Building Blocks Diff comment block, add guidance + two examples: a block with an approved contract appends a link — e.g. `` - `checkoutFlow` (custom) — see `contracts/checkout-flow.md` ``; a signal-hitting block that was skipped records the reason — e.g. ``- `fooStore` (store) — contract skipped: shape is flat``.

### 4. `.agents/skills/writing-spec/templates/tasks-template.md` (MODIFY)

- In **Section 5 — References**, extend the verbatim instruction so implementation reads contracts too: _"Before implementing a block that has a contract in `contracts/`, read that contract in addition to its rule file."_
- **Also fix the pre-existing path bug** on the existing References line: it currently says `.claude/skills/building-blocks/rules/{type}.md` but the skills live under `.agents/skills/`. Correct it to `.agents/skills/building-blocks/rules/{type}.md`. Use `.agents/` consistently in the new contract instruction too.

### 5. `docs/spec-driven-development.md` (MODIFY)

- Add a short subsection describing the `contracts/` directory: what it's for, when it appears, that it's signal-driven and developer-approved, and that it's excluded from spec line caps. Keep it concise — consistent with the existing doc's density.

## Out of Scope

- No changes to the `building-blocks` or `test-building-blocks` skills or their rule files. Contracts are per-spec design artifacts; rule files remain the catalog of canonical patterns.
- No retrofit of existing specs (`001-remove-cart-product`, `002-product-reviews`) — contracts apply to new specs going forward.
- No automation/tooling (no lint rule, no generator) — contract creation stays a collaborative step in the skill workflow.
- The simplified two-file spec format (`spec.md` + `tests.md`, used by 001) is left untouched.

## Verification

This is a skill/documentation change — verification is by inspection and a dry-run, not a test suite:

1. **Consistency check** — re-read `SKILL.md` end-to-end: the Phase 2 contract step, Phase 4 audit additions, Rules, Exit Criteria, and References all reference `contract-template.md` and `contracts/` consistently. Frontmatter of `contract-template.md` matches the field style of the other three templates **except `status`, which is intentionally absent**. No `.claude/` path remains anywhere in the skill or templates.
2. **Cross-reference check** — `design-template.md` shows both the contract-link and the skip-reason example; `tasks-template.md` Section 5 instruction names `contracts/` and uses the corrected `.agents/` path; `docs/spec-driven-development.md` subsection agrees with `SKILL.md`.
3. **Signal decoupling check** — re-read the Signals section: confirm no signal names a building-block catalog type. Signals describe design-problem properties only; the sole architectural reference allowed is "feature / sub-feature slice" in signal 4.
4. **Dry-run the heuristic — negative case** — mentally apply the signal checklist against the existing `002-product-reviews` `design.md` Building Blocks Diff: confirm simple components, pages, data types, and forms produce **no** proposal. (002 has no signal-positive block — it only validates the negative path.)
5. **Dry-run the heuristic — positive case** — apply the checklist to a constructed signal-positive block (e.g. a block with branching domain rules, or one with multiple states and guarded transitions): confirm it produces exactly one sane one-line proposal. This validates the positive path, which the negative dry-run cannot.
6. **Cap pressure-test** — hand-write one realistic contract for the hardest case (a block with multiple states + events + transitions + guards + all four sections) and confirm it fits ≤80 lines. If it does not, the cap or the section set is wrong — resolve before shipping. Also confirm `contract-template.md` itself is ≤80 lines and `SKILL.md` line-cap text states contracts are excluded from the ~200 combined cap.
