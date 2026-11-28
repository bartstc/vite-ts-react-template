# Visual Regression Testing

This document gives the reasons for how we test appearance. It covers which tier owns it, which stories have
sufficient value for a screenshot, what makes a screenshot deterministic, and how we make and review baselines. It
extends [README.md](./README.md). The `test-building-blocks` skill (block `visual-story`) tells you how to tag a story
and update baselines. This document gives the reasons.

Audience: developers and AI agents who add visual stories or review changes to baselines.

## 1. What visual tests own

Visual tests find regressions that do not throw an error. Examples are a token change, a broken layout, spacing drift,
or a theme that shows in the wrong component. Behavior tests cannot see these regressions.

Visual tests belong to the component tier, because a story already shows one state in isolation, with MSW fixtures and
real providers. That is the most deterministic input that we have. Also, a diff points to one component instead of a
full page.

| Tier                         | Proves for appearance                               | Tool                                    |
| ---------------------------- | --------------------------------------------------- | --------------------------------------- |
| **Component (`visual` tag)** | Each opted-in story state looks as it did in review | Vitest browser mode `toMatchScreenshot` |

**Pixels are evidence, not assertions.** A screenshot shows that something rendered differently. It does not show why,
and it does not show if the component still works. Visual tests add to the assertions of the play function and never
replace them.

**How we make screenshots.** `pnpm test:visual` renders each `visual` story in headless Chromium. It does not start the
app, Storybook or the API. MSW gives the data. After the play function of the story, the test takes a screenshot of the
page. Then it compares the screenshot with the PNG committed next to the story. A mismatch makes the test fail. The
test keeps the diff images for review, and CI uploads them.

## 2. Is VRT worth it here?

VRT is not a default. VRT has value when all of these conditions are true:

- Regressions of appearance are probable, costly and invisible to the tests that exist.
- We can keep screenshots deterministic.
- Somebody reviews the diffs.

If not, VRT becomes a noisy suite that people approve without a look. That is worse than no suite, because it gives
false confidence.

| Factor               | Supports VRT                                                  | Argues against VRT                                |
| -------------------- | ------------------------------------------------------------- | ------------------------------------------------- |
| Shared UI            | A component library or design tokens that many places use     | Few shared components, each screen is custom      |
| Cost of a visual bug | Customer-facing, critical for the brand                       | Internal tools where "slightly off" is acceptable |
| Change pattern       | CSS, token, theme or UI-library upgrades                      | UI in a large redesign: each PR changes baselines |
| Isolation            | Stories with fixtures and MSW render states deterministically | Only pages with live data                         |
| Review capacity      | Somebody opens and judges image diffs                         | People approve diffs without a look               |
| Content              | Static, from fixtures                                         | Live data, maps, canvas, video, animation         |

This template has a shared component library, a theme, stories with MSW fixtures and a Linux CI. These are the
strongest signals that support VRT. Verdict: VRT has value here, in a small set that you must opt into. A project that
starts from the template does §3 again for its own UI before it makes the set larger. It can also remove the
`storybook-visual` project completely.

## 3. Which stories are visual

Ask these questions in this order. If the answer to one question is "no", do not tag the story.

1. **Is a probable regression invisible to behavior tests?** Spacing, color, overflow, z-index, theme: yes. A missing
   button or wrong text: no. Assert it with a role query.
2. **Will we fix it if it ships?** A 4px shift that nobody will fix is cost without value.
3. **Can the story render the state deterministically?** If not, first fix the input (fixture, clock, local image).
4. **Is the design stable?** Take the snapshot after a component is stable, not during a redesign.
5. **Who reviews the diff?** If nobody owns the diff, people approve the baselines without a check.

Good candidates, in order of priority:

- `lib/components/` primitives and their variants. One regression there has an effect on each page.
- A few compositions where the layout is the risk: a form, a table, an empty or error state, an open dialog.
- Precise output that the business relies on, where one wrong character or a line in the wrong place is important:
  code snippets, rendered templates with variables, formatted documents, invoices or price breakdowns.

Not visual:

- Stories that only have value for behavior, and end states of a play function that only prove a result.
- Loading states (spinners, skeletons) and transient UI (toasts).
- Stories with remote images or live data, until the fixture is local.
- Near-duplicates of a state that a story already captures. Extra viewports or themes "for safety".

Cheaper alternatives come first where they work: role and text assertions for content, `toHaveStyle` for one critical
property, accessibility checks for contrast.

## 4. Determinism contract

A visual story renders the same pixels on each run. The `storybook-visual` project guarantees these conditions:

- One browser (Chromium) in one environment: the pinned `mcr.microsoft.com/playwright` image. Its version is the same
  as the installed `playwright` package.
- A fixed viewport (1280×800), device scale factor 1, and locale and timezone that are the same as in the other tiers.
- A stylesheet only for tests disables motion. UI-library enter and exit animations often ignore
  `prefers-reduced-motion`, so emulation of reduced motion alone is not sufficient.
- `Date` is frozen to a fixed time. Only `Date` is frozen, so promises, MSW and TanStack Query still run.
- Fonts are loaded (`document.fonts.ready`) before the screenshot.
- Data comes only from fixtures and MSW. Images are local.
- Only the light theme.

If a story cannot meet the contract, it is not a visual story. Fix the source of noise or remove the tag. Never add
retries or increase thresholds.

## 5. Baselines

- Baselines are committed to git next to their stories, in `__screenshots__/<story file>/<story>-chromium.png`. Review
  a baseline in the same way as code.
- Make baselines only in the pinned container (`pnpm test:visual:update`). Never make them from a host browser,
  because font rendering is different on each OS. A macOS baseline fails on Linux. The config refuses `--update` outside
  the container.
- Names have no platform suffix. This is correct only because each comparison runs in the same image.
- Change the image tag and the `playwright` package in one commit. A version change usually makes all baselines again.
- Baselines change in the same PR as the UI change that caused them. The PR says why.
- When you delete or rename a story, delete its PNGs manually. Vitest does not remove old files.
- One view has one owner story. Never capture the same state two times.

## 6. Thresholds

The tolerance is very small and global: pixelmatch `threshold: 0.2`, `allowedMismatchedPixelRatio: 0.001`. Tune the
ratio, not the threshold for each pixel. An override for one story needs a comment that names the source of noise. A
global ratio above 0.01 is a smell. Never increase a threshold to make a red build green.

## 7. How to read a failure

CI uploads the reference, actual and diff images as the `visual-diffs` artifact. A diff that is mostly red is a real
change. Small spots around text usually come from the environment. First check the image version and the fonts, before
you change anything else. A visual test that passes on retry is a determinism bug.

## 8. Design-smell signals

| Signal                                                     | Probable cause                                            | Fix                                                      |
| ---------------------------------------------------------- | --------------------------------------------------------- | -------------------------------------------------------- |
| A screenshot is the only assertion on an interactive story | No test of the behavior                                   | Add play assertions, keep the screenshot as an addition  |
| A threshold went up to pass                                | It hides a real regression or nondeterminism              | Find and fix the source                                  |
| A baseline is different on only one machine                | Made outside the container                                | Make it again with `pnpm test:visual:update`             |
| A story flakes between runs                                | Motion, clock, async data, images or fonts                | Fix the determinism, never add retries                   |
| A PR updates many baselines as "update snapshots"          | Updates to get green, and reviewers cannot see the intent | One intended change for each PR, baselines with the code |
| The same component at many viewports or themes             | Review cost without a new signal                          | One viewport, more only where the layout changes         |
| Needs a sleep before the screenshot                        | No stable rendered state                                  | Make the state deterministic, or do not make it visual   |
| A story masks dynamic data                                 | The fixture is not deterministic                          | Fix the fixture, never mask in a story                   |
| Developers do not want to touch shared components          | Baseline churn is larger than the signal                  | Make the tagged set smaller                              |

## 9. Review checklist

- [ ] You opened each added or changed PNG (GitHub image diff: swipe or onion skin). The change is intended, and the PR
      says why.
- [ ] Baselines came from the container (no platform suffix, and the image tag is the same as the `playwright`
      version).
- [ ] Interactive visual stories still assert behavior.
- [ ] No increase of tolerance without a comment.
- [ ] No `Math.random`, `Date.now`, remote images, content that depends on the network, or motion that loops in a
      visual story.
- [ ] Old PNGs are removed. No extra viewports or themes without a reason.
- [ ] On a CI failure, you examined the `visual-diffs` artifact. You did not only run the test again.

## 10. References

- Vitest: [Visual regression testing](https://vitest.dev/guide/browser/visual-regression-testing.html),
  [Browser assertions](https://vitest.dev/api/browser/assertions).
- Storybook: [Vitest addon](https://storybook.js.org/docs/writing-tests/integrations/vitest-addon).
- Playwright: [Visual comparisons](https://playwright.dev/docs/test-snapshots), [Docker](https://playwright.dev/docs/docker).
