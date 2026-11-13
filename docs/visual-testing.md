# Visual Regression Testing

Why we test appearance the way we do: which tier owns it, which stories are worth a screenshot, what makes a screenshot
deterministic, and how baselines are made and reviewed. It extends [testing.md](./testing.md). The
`test-building-blocks` skill (`visual-story` block) says how to tag a story and update baselines. This document gives
the reasoning.

Audience: developers and AI agents adding visual stories or reviewing baseline changes.

## 1. What visual tests own

Visual tests catch regressions that do not throw: a token change, a broken layout, spacing drift, a theme bleeding into
the wrong component. Behaviour tests cannot see these.

They belong to the component tier because a story already renders one state in isolation, with MSW fixtures and real
providers. That is the most deterministic input we have, and a diff points at one component instead of a whole page.

| Tier                         | Proves for appearance                       | Tool                                    |
| ---------------------------- | ------------------------------------------- | --------------------------------------- |
| **Component (`visual` tag)** | Each opted-in story state looks as reviewed | Vitest browser mode `toMatchScreenshot` |

**Pixels are evidence, not assertions.** A screenshot says that something rendered differently, not why, and not
whether it still works. Visual tests complement play-function assertions and never replace them.

**How screenshots are made.** `pnpm test:visual` renders each `visual` story in headless Chromium, without starting
the app, Storybook or the API; MSW supplies the data. After the story's play function, the page is screenshotted and
compared with the PNG committed next to the story. A mismatch fails the test, and the diff images are kept for review
(CI uploads them).

## 2. Is VRT worth it here?

VRT is not a default. It pays off when appearance regressions are likely, costly and invisible to existing tests, and
when screenshots can be kept deterministic and someone reviews the diffs. Otherwise it becomes a noisy suite that
people approve without looking — which is worse than no suite, because it creates false confidence.

| Factor               | Favours VRT                                                   | Argues against VRT                                  |
| -------------------- | ------------------------------------------------------------- | --------------------------------------------------- |
| Shared UI            | A component library or design tokens consumed in many places  | Few shared components; each screen is bespoke       |
| Cost of a visual bug | Customer-facing, brand-critical                               | Internal tools where "slightly off" is acceptable   |
| Change pattern       | CSS, token, theme or UI-library upgrades                      | UI under heavy redesign: every PR changes baselines |
| Isolation            | Stories with fixtures and MSW render states deterministically | Only pages with live data                           |
| Review capacity      | Someone opens and judges image diffs                          | Diffs would be approved blindly                     |
| Content              | Static, fixture-driven                                        | Live data, maps, canvas, video, animation           |

This template has a shared component library, a theme, stories with MSW fixtures and a Linux CI — the strongest
"favours" signals. Verdict: worth it, small and opt-in. A project built from the template re-runs §3 for its own UI
before expanding the set, and may drop the `storybook-visual` project entirely.

## 3. Which stories are visual

Ask, in order. If any answer is "no", leave the story untagged.

1. **Would a plausible regression be invisible to behaviour tests?** Spacing, colour, overflow, z-index, theme: yes. A
   missing button or wrong text: no — assert it with a role query.
2. **Would we fix it if it shipped?** A 4px shift nobody would fix is cost without value.
3. **Can the state be rendered deterministically?** If not, fix the input (fixture, clock, local image) first.
4. **Is the design stable?** Snapshot after a component settles, not during a redesign.
5. **Who reviews the diff?** No owner means rubber-stamped baselines.

Good candidates, in order of priority:

- `lib/components/` primitives and their variants — one regression there affects every page.
- A few compositions whose layout is the risk: a form, a table, an empty or error state, an open dialog.
- Precise output the business relies on, where one wrong character or misplaced line matters: code snippets, rendered
  templates with variables, formatted documents, invoices or price breakdowns.

Not visual:

- Stories whose value is behaviour only, and end states of a play function that only prove an outcome.
- Loading states (spinners, skeletons) and transient UI (toasts).
- Stories with remote images or live data, until the fixture is made local.
- Near-duplicates of a state already captured; extra viewports or themes "for safety".

Cheaper alternatives come first where they work: role and text assertions for content, `toHaveStyle` for one critical
property, accessibility checks for contrast.

## 4. Determinism contract

A visual story renders the same pixels on every run. The `storybook-visual` project guarantees:

- One browser (Chromium) in one environment: the pinned `mcr.microsoft.com/playwright` image whose version equals the
  installed `playwright` package.
- Fixed viewport (1280×800), device scale factor 1, locale and timezone matching the other tiers.
- Motion disabled by a test-only stylesheet. UI-library enter/exit animations often ignore `prefers-reduced-motion`, so
  emulating reduced motion is not enough on its own.
- `Date` frozen to a fixed time; only `Date`, so promises, MSW and TanStack Query still run.
- Fonts loaded (`document.fonts.ready`) before the shot.
- Data only from fixtures and MSW; images local.
- Light theme only.

A story that cannot meet the contract is not a visual story. Fix the source of noise or drop the tag; never add retries
or raise thresholds.

## 5. Baselines

- Committed to git next to their stories, in `__screenshots__/<story file>/<story>-chromium.png`. A baseline is reviewed
  like code.
- Generated only in the pinned container (`pnpm test:visual:update`). Never from a host browser: font rendering differs
  per OS, and a macOS baseline fails on Linux. The config refuses `--update` outside the container.
- Names carry no platform suffix. That is valid only because every comparison runs in the same image.
- The image tag and the `playwright` package are bumped in one commit; a bump usually regenerates every baseline.
- Baselines change in the same PR as the UI change that caused them, and the PR says why.
- Deleted or renamed stories have their PNGs deleted by hand. Vitest does not remove stale files.
- One view, one owning story. The same state is never captured twice.

## 6. Thresholds

Tolerance is tiny and global: pixelmatch `threshold: 0.2`, `allowedMismatchedPixelRatio: 0.001`. Tune the ratio, not
the per-pixel threshold. A per-story override needs a comment naming the source of noise; a global ratio above 0.01 is
a smell. Never raise a threshold to make a red build green.

## 7. Reading a failure

CI uploads the reference, actual and diff images as the `visual-diffs` artifact. A mostly red diff is a real change.
Speckles around text usually mean the environment: check the image version and fonts before touching anything else. A
visual test that passes on retry is a determinism bug.

## 8. Design-smell signals

| Signal                                                     | Likely cause                                 | Fix                                                      |
| ---------------------------------------------------------- | -------------------------------------------- | -------------------------------------------------------- |
| A screenshot is the only assertion on an interactive story | Behaviour untested                           | Add play assertions; keep the screenshot as a complement |
| Threshold raised to pass                                   | Real regression or nondeterminism hidden     | Find and fix the source                                  |
| Baseline differs only on one machine                       | Generated outside the container              | Regenerate with `pnpm test:visual:update`                |
| Story flakes between runs                                  | Motion, clock, async data, images or fonts   | Fix determinism; never add retries                       |
| PR updates dozens of baselines as "update snapshots"       | Update-to-green; reviewers cannot see intent | One intended change per PR, baselines with the code      |
| Same component at many viewports or themes                 | Review cost without new signal               | One viewport; more only where the layout changes         |
| Needs a sleep before the shot                              | No stable rendered state                     | Make the state deterministic, or do not make it visual   |
| Dynamic data masked in a story                             | Fixture is not deterministic                 | Fix the fixture; never mask in a story                   |
| Developers avoid touching shared components                | Baseline churn outweighs the signal          | Shrink the tagged set                                    |

## 9. Review checklist

- [ ] Every added or changed PNG was opened (GitHub image diff: swipe or onion skin); the change is intended and the PR
      says why.
- [ ] Baselines came from the container (no platform suffix; image tag matches the `playwright` version).
- [ ] Interactive visual stories still assert behaviour.
- [ ] No tolerance increase without a comment.
- [ ] No `Math.random`, `Date.now`, remote images, network-dependent content or looping motion in a visual story.
- [ ] Stale PNGs removed; no extra viewports or themes without a reason.
- [ ] On a CI failure, the `visual-diffs` artifact was inspected, not just re-run.

## 10. References

- Vitest: [Visual regression testing](https://vitest.dev/guide/browser/visual-regression-testing.html),
  [Browser assertions](https://vitest.dev/api/browser/assertions).
- Storybook: [Vitest addon](https://storybook.js.org/docs/writing-tests/integrations/vitest-addon).
- Playwright: [Visual comparisons](https://playwright.dev/docs/test-snapshots), [Docker](https://playwright.dev/docs/docker).
