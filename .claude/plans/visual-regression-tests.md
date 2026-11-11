# Plan: Visual regression tests

Status: draft, waiting for decisions (see "Decisions").

## Goal

Catch unintended visual changes (layout, spacing, colour, typography, theme) that the existing assertions can't see,
without adding a flaky suite.

## Which tier

**Recommendation: mostly the component tier (stories), with an optional thin E2E layer.**

| Criterion              | Component tier (stories)                            | E2E (Playwright)                                             |
| ---------------------- | --------------------------------------------------- | ------------------------------------------------------------ |
| Determinism            | High: data comes from MSW handlers and fixtures     | Low: real API data, ids, dates, images change                |
| States covered         | Every story state (empty, error, loading, variants) | Only the states the journey passes through                   |
| Cost per snapshot      | Milliseconds, no server                             | Seconds; needs the app and the API running                   |
| Where a diff points    | One component                                       | A whole page; the cause must be hunted down                  |
| What only it can catch | —                                                   | Page composition: layout shell, header plus content, routing |

E2E screenshots run against real data, so they need masking for every dynamic region. They also break on any copy or
seed change and duplicate states the stories already have. Stories already render each state deterministically, which
is exactly what a screenshot baseline needs.

The optional E2E layer is a few full-page screenshots of key pages, taken at the end of existing journeys, with dynamic
regions masked. Add it only if page-level layout regressions turn out to slip past the component snapshots.

## Approach (component tier)

Two ways to take screenshots of stories:

| Option                                                                                                                 | Pros                                                                                        | Cons                                                                                       |
| ---------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| **A. Vitest browser mode `toMatchScreenshot()`**, in the existing Storybook Vitest project (Vitest 4.1 installed)      | Same runner as story tests; one command (`pnpm test`); baselines next to stories            | Unknown how play functions reach `expect.element`; needs a spike                           |
| **B. Playwright `toHaveScreenshot()`** against Storybook `iframe.html?id=<story-id>`, as a separate Playwright project | Mature API (masking, thresholds, `animations: "disabled"`); Playwright is already installed | Needs a built and served Storybook; a second suite; story ids enumerated from `index.json` |
| C. Hosted service (Chromatic, Percy)                                                                                   | Review UI, no baselines in git                                                              | External service, cost, sends UI to a third party                                          |

Recommendation: spike A first. Fall back to B if A can't screenshot from a story cleanly. C only if the team wants a
hosted review UI.

## Steps

1. **Spike (time-boxed):** screenshot one story with option A. Confirm that the screenshot can be taken from a story
   (play function, a test hook, or a per-story opt-in tag), where baselines are written, and how the files are named
   per browser and platform. Record the result in this plan.
2. **Determinism setup:**
   - Fixed viewport, `locale` and timezone (the same as the unit tier).
   - Animations and transitions disabled: a global stylesheet or `prefers-reduced-motion`. Check that Chakra honours it.
   - Web fonts loaded before the shot (`document.fonts.ready`).
   - Light and dark theme: decide whether both are captured (see Decisions).
   - Data only from fixtures and MSW. Dates through the fixed clock.
3. **Opt-in, not blanket:** a story tag (for example `visual`) marks the stories to capture. Start with shared UI in
   `lib/components/` and a few key feature compositions.
4. **Baselines and platform:**
   - Font rendering differs per OS, so baselines are generated on one platform only: the CI Linux runner, or the
     official Playwright Docker image locally.
   - Add a `pnpm test:visual:update` script that regenerates baselines in that image.
   - Commit the baselines. Review them like code.
5. **CI:** run the visual project in the existing test workflow. On failure, upload the diff images as an artifact.
6. **Docs:** add a short "Visual regression" section to `docs/testing.md` (tier, opt-in, how to update baselines, no
   updating baselines to make a red build green without reviewing the diff). Add the pattern to the
   `test-building-blocks` skill as a `visual-story` block or a convention.
7. **Optional E2E layer** (only if step 5 shows a need): `toHaveScreenshot({ fullPage: true, mask: [...] })` at the
   end of 2–3 journeys. Document it in `docs/e2e-testing.md` and the `e2e-testing` skill.

## Decisions

1. Tier: component-first as recommended, or E2E-first?
2. Tooling: spike A, then B as fallback, or go straight to B, or a hosted service (C)?
3. Themes: light only, or light and dark?
4. Baselines: committed to git, or stored as CI artifacts?

## Risks

- Platform drift: baselines from a Mac differ from Linux CI. Generate them in one place only.
- Baseline churn on intentional design changes. Keep the set small and opt-in.
- Anti-aliasing noise. Use a small `maxDiffPixelRatio`; never raise thresholds to hide real diffs.

## Out of scope

Accessibility scans and aria snapshots. These are separate topics.
