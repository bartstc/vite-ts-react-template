# Coding Harness

The coding harness is everything in this repo that steers an AI coding agent toward code we would write ourselves. It
is separate from product knowledge (domain, requirements, decisions about _what_ to build). This harness only covers
_how_ code is written here.

It has three layers:

| Layer          | Answers | Form               | When the agent uses it                     |
| -------------- | ------- | ------------------ | ------------------------------------------ |
| **Principles** | Why     | `docs/*.md`        | On demand, when a rule needs its reasoning |
| **Playbooks**  | How     | `.claude/skills/*` | When a task touches that kind of code      |
| **Sensors**    | Did it? | ESLint, tsc, tests | After the code exists, at the dev's call   |

Principles and playbooks are _guides_: they steer the agent before it writes code. Sensors are _feedback_: they show
the agent what it got wrong so it can correct itself. Guides alone produce code that follows rules nobody checks.
Sensors alone produce an agent that keeps making the same mistake. We need both.

## 1. Principles — the "why"

Short documents that explain the reasoning behind our practices. With the reasoning, the agent (or a new contributor)
can apply a rule to a case the rule does not mention.

- [architecture.md](./architecture.md) — feature slice layers, dependency direction, API layer
- [spec-driven-development.md](./spec-driven-development.md) — when and how to write a spec before code
- [testing.md](./testing.md) — which test tier owns what, what to mock, what to keep real
- [e2e-testing.md](./e2e-testing.md) — what the E2E tier owns, data setup, waiting
- [visual-testing.md](./visual-testing.md) — which stories get screenshots, baselines

Principles are not loaded into every session. Skills link to them, and path-scoped rules in `.claude/rules/` carry the
few always-relevant constraints.

## 2. Playbooks — the "how"

Skills hold the concrete patterns: one rule file per pattern, with code examples.

- **`building-blocks`** — catalogue of production code patterns (query/mutation factories, mutation hooks, stores,
  machines, use-case and facade hooks, composers, models, forms, pages…). Each block has a rule file in
  `.claude/skills/building-blocks/rules/<block>.md`. Specs reference blocks by name; the agent reads the rule file
  before writing that block.
- **`test-building-blocks`** — the same for tests: unit tests, component stories, visual stories, MSW handlers and
  fixtures.
- **`e2e-testing`** — Playwright patterns: page objects, test data, waiting, what may be mocked.

Keep each rule file focused, and keep the shared patterns here. Repo-specific exceptions go in `.claude/rules/`.

## 3. Sensors — the enforcement

Anything that can be checked mechanically should be. A lint rule is followed every time; prose is followed when the
agent remembers it.

**Static checks**

- `tsc --noEmit` (strict) — `pnpm typecheck`
- ESLint ([eslint.config.mjs](../eslint.config.mjs)), including our custom rules:
  - feature-slice layer boundaries via `eslint-plugin-boundaries` ([eslint.feature-slices.mjs](../eslint.feature-slices.mjs))
  - React Query hooks only in `providers/`, never in `components/` or `application/`
  - named exports only (`import-x/no-default-export`; off for stories and tool configs)
  - named `useEffect` callbacks; `react-you-might-not-need-an-effect` for derived state
  - no `__tests__/` directories (tests sit next to the source)
  - no `react-router` imports (use the typed routing layer), no default `ramda` import
- `madge` — circular dependency check (`pnpm madge:circular`)

**Tests** — Vitest (unit), Storybook (component), visual regression, Playwright (E2E). See [testing.md](./testing.md).

**Dev-triggered commands** — sensors run when _you_ decide the work is done, not on every edit:

| Command           | Runs                                                          |
| ----------------- | ------------------------------------------------------------- |
| `/check`          | typecheck + lint on changed files; agent fixes and reruns     |
| `/check-tests`    | Vitest tests related to changed files; E2E/visual on request  |
| `/review-blocks`  | read-only LLM review of the diff against building-block rules |
| `/triage-lessons` | promote or discard inbox lessons (see Learning loop)          |

`/review-blocks` covers what lint cannot express, such as choosing the wrong block or putting logic in the wrong layer.

**Writing a good sensor:** the error message tells the agent what to do instead and names the rule file, e.g.
`"React Query hooks belong in providers/, not here."` Then the lint output points back to the playbook.

## Changing the harness

1. Before writing prose, ask whether the rule can be a type, a lint rule, an import boundary or a test. If it can, make
   it a sensor and keep the prose to one line pointing at it.
2. Otherwise add or update the playbook rule file, and put the reasoning in a principles doc.
3. Corrections go through the learning loop below. They are never written straight into the harness.

## Learning loop

The learning loop is not a fourth layer. It is how the three layers change over time: each correction becomes a change
to a sensor, a playbook or a principle. Agent-written rules are the riskiest input to a harness, because agents follow
them reliably even when they are wrong. So a human decides every promotion.

1. **Capture.** After a correction, the agent appends a lesson with `Status: new` to the `## Inbox` of
   [`specs/lessons.md`](../specs/lessons.md). It ends its reply with `Lesson captured: L<NNN> — <title> (untriaged)`.
2. **Remind.** A `SessionStart` hook ([`.claude/hooks/lessons-reminder.sh`](../.claude/hooks/lessons-reminder.sh))
   prints the number of untriaged lessons. It prints nothing when the inbox is empty.
3. **Triage.** The dev runs `/triage-lessons`. The agent proposes one target per lesson, strongest first:
   **sensor** > playbook > principle > workflow rule > discard. The dev approves, retargets or discards each one.
4. **Promote.** The agent makes the approved change and collapses the lesson to one line in `## Archive`.

`lessons.md` is not loaded at session start. Once a lesson is promoted, the knowledge lives where the agent already
looks, and the inbox holds only unprocessed items.
