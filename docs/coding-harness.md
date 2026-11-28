# Coding Harness

The coding harness is all the parts of this repo that guide an AI coding agent toward code that we write ourselves. It
is separate from product knowledge (domain, requirements, decisions about _what_ to build). This harness covers only
_how_ we write code here.

The harness has three layers:

| Layer          | Answers | Form               | When the agent uses it                   |
| -------------- | ------- | ------------------ | ---------------------------------------- |
| **Principles** | Why     | `docs/*.md`        | On demand, when a rule needs its reason  |
| **Playbooks**  | How     | `.claude/skills/*` | When a task touches that type of code    |
| **Sensors**    | Did it? | ESLint, tsc, tests | After the code exists, when the dev says |

Principles and playbooks are _guides_. They guide the agent before it writes code. Sensors are _feedback_. They show
the agent its errors, so that it can correct them. Guides without sensors give code that follows rules nobody checks.
Sensors without guides give an agent that makes the same error again and again. We need both.

## 1. Principles — the "why"

Principles are short documents that give the reasons for our practices. With the reasons, the agent (or a new
contributor) can apply a rule to a case that the rule does not mention.

- [architecture.md](./architecture.md) — feature slice layers, dependency direction, API layer
- [spec-driven-development.md](./spec-driven-development.md) — when and how to write a spec before code
- [tests/README.md](./tests/README.md) — which test tier owns what, what to mock, what to keep real
- [tests/e2e-testing.md](./tests/e2e-testing.md) — what the E2E tier owns, data setup, waiting
- [tests/visual-testing.md](./tests/visual-testing.md) — which stories get screenshots, baselines

The agent does not load the principles into every session. Skills link to them. Path-scoped rules in `.claude/rules/`
contain the few constraints that always apply.

## 2. Playbooks — the "how"

Skills contain the concrete patterns: one rule file for each pattern, with code examples.

- **`building-blocks`** — a catalog of patterns for production code (query and mutation factories, mutation hooks,
  stores, machines, use-case and facade hooks, composers, models, forms, pages, and more). Each block has a rule file in
  `.claude/skills/building-blocks/rules/<block>.md`. Specs refer to blocks by name. The agent reads the rule file before
  it writes that block.
- **`test-building-blocks`** — the same catalog for tests: unit tests, component stories, visual stories, MSW handlers
  and fixtures.
- **`e2e-testing`** — Playwright patterns: page objects, test data, waiting, what you can mock.

Keep each rule file on one topic. Keep the shared patterns here. Put exceptions that apply only to this repo in
`.claude/rules/`.

## 3. Sensors — the enforcement

If a tool can check a rule, use the tool. The agent follows a lint rule every time. The agent follows prose only when
it remembers the prose.

**Static checks**

- `tsc --noEmit` (strict) — `pnpm typecheck`
- ESLint ([eslint.config.mjs](../eslint.config.mjs)), with our custom rules:
  - layer boundaries of feature slices through `eslint-plugin-boundaries` ([eslint.feature-slices.mjs](../eslint.feature-slices.mjs))
  - React Query hooks only in `providers/`, never in `components/` or `application/`
  - only named exports (`import-x/no-default-export`, off for stories and tool configs)
  - named `useEffect` callbacks, and `react-you-might-not-need-an-effect` for derived state
  - no `__tests__/` directories (tests are next to the source)
  - no `react-router` imports (use the typed routing layer), no default `ramda` import
- `madge` — check for circular dependencies (`pnpm madge:circular`)

**Tests** — Vitest (unit), Storybook (component), visual regression, Playwright (E2E). Refer to
[tests/README.md](./tests/README.md).

**Commands that the dev starts** — sensors run when _you_ decide that the work is complete, not after each edit:

| Command           | Runs                                                                     |
| ----------------- | ------------------------------------------------------------------------ |
| `/check`          | typecheck and lint on changed files, then the agent fixes and runs again |
| `/check-tests`    | Vitest tests related to changed files, E2E and visual on request         |
| `/review-blocks`  | a read-only LLM review of the diff against the building-block rules      |
| `/triage-lessons` | promote or discard inbox lessons (refer to Learning loop)                |

`/review-blocks` covers what lint cannot express. Examples are the wrong block, logic in the wrong layer, or a copy of
a helper or component that already exists in `src/lib/`.

**Reuse before you create.** Agents often make a copy of code instead of a search for the code that exists. `src/lib/`
has no index written by hand, because an index becomes old and the file names describe the files. Instead,
`.claude/rules/architecture.md` tells the agent to list `src/lib/` before it writes generic code. Then `/review-blocks`
flags copies after the agent writes the code.

**How to write a good sensor:** the error message tells the agent what to do instead and names the rule file, for
example `"React Query hooks belong in providers/, not here."`. Then the lint output points back to the playbook.

## How to change the harness

1. Before you write prose, ask if the rule can be a type, a lint rule, an import boundary or a test. If it can, make it
   a sensor. Then keep the prose to one line that points to the sensor.
2. If it cannot, add or update the rule file of the playbook. Put the reason in a principles doc.
3. Send corrections through the learning loop below. Never write corrections directly into the harness.

## Learning loop — a codebase that improves itself

The harness is in the codebase. Principles, playbooks, sensors and commands are files in this repo. Thus, an
improvement to the harness is a usual code change. We make and review it in the same way as product code. This is how
the codebase improves itself: an error that the agent made one time becomes a change that prevents it in all future
code.

The learning loop is not a fourth layer. It is how the three layers change over time: each correction becomes a change
to a sensor, a playbook or a principle. The value of an improvement grows most when it becomes a sensor, because a
sensor checks each future change, not only the next one.

The loop improves itself, but a human controls it. Rules that an agent writes are the most dangerous input to a
harness, because agents follow them reliably, also when the rules are wrong. Thus, the agent proposes and applies
changes, and the dev decides each promotion.

1. **Capture.** A correction can show an error that will probably occur again (the agent made it again, or made it
   although a rule, doc or warning exists). Then the agent adds a lesson with `Status: new` to the end of the `## Inbox`
   in [`specs/lessons.md`](../specs/lessons.md). It ends its reply with `Lesson captured: L<NNN> — <title> (untriaged)`.
   If the agent is not sure, it asks `Record as lesson? <one-line summary>`. The agent does not record corrections
   that occur only one time.
2. **Remind.** A `SessionStart` hook ([`.claude/hooks/lessons-reminder.sh`](../.claude/hooks/lessons-reminder.sh))
   shows the number of untriaged lessons. It shows nothing when the inbox is empty.
3. **Triage.** The dev runs `/triage-lessons`. The agent proposes one target for each lesson, strongest first:
   **sensor** > playbook > principle > workflow rule > discard. The dev approves, changes the target of, or discards
   each lesson.
4. **Promote.** The agent makes the approved change. Then it reduces the lesson to one line in `## Archive`.

The agent does not load `lessons.md` at session start. After the dev promotes a lesson, the knowledge is where the
agent already looks. The inbox contains only lessons that nobody has processed.

**Next steps.** These things can make the loop stronger:

- **Evals:** a small set of past tasks that we run again after a harness change. They show if the change helped.
- **Signals from real use:** in product repos, error tracking or analytics as a second source of lessons, in addition
  to dev corrections.
- **More sensors:** many rules in the principles docs are still prose, but a lint rule can check them. Each candidate
  below points to the rule that it enforces:

  | Candidate rule                                                                                             | Enforces                                                             |
  | ---------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
  | `eslint-plugin-playwright` (`no-wait-for-timeout`, `no-networkidle`, `no-wait-for-selector`)               | No sleeps or network waits in E2E ([§2.4](./tests/e2e-testing.md))   |
  | `playwright/no-force-option`, `playwright/prefer-web-first-assertions`                                     | No `force`, no one-shot assertions in E2E                            |
  | `playwright/no-skipped-test`, `playwright/no-focused-test`, `playwright/no-page-pause`                     | No `.only`, `pause` or silent skips (quarantine uses `test.fixme()`) |
  | `no-restricted-syntax` on `page.route` with a URL of our API in `e2e/`                                     | No routes on our own API ([§2.3](./tests/e2e-testing.md))            |
  | `no-restricted-imports` in `e2e/` for components, hooks and stores                                         | E2E imports only types, pure constants and `src/test-lib/`           |
  | `testing-library/prefer-user-event`, `no-wait-for-multiple-assertions`, `no-wait-for-side-effects`         | `userEvent` instead of `fireEvent`, one assertion in each `waitFor`  |
  | `testing-library/prefer-find-by`, `prefer-screen-queries`                                                  | `findBy*` for elements, queries that the user can see                |
  | `no-restricted-syntax` on `getByTestId` (warning, so that a comment must give the reason)                  | Role selectors first                                                 |
  | `no-restricted-syntax` on `vi.mock` with an `@/` path of an app hook or a `lib/api/` export                | Mocks only at the network seam ([§2](./tests/README.md))             |
  | `no-restricted-syntax` on `Date.now`, `Math.random` and remote image URLs in stories with the tag `visual` | The determinism contract ([§4](./tests/visual-testing.md))           |
  | `@typescript-eslint/consistent-type-assertions` (`assertionStyle: "never"`)                                | No `as Type`, use type guards                                        |
  | `i18next/no-literal-string` in `components/` and `pages/`                                                  | No text without translation in the UI                                |

  Before you add a rule, run it on the codebase. A rule with many false positives teaches the agent to add
  `eslint-disable` comments, and that is worse than prose.
