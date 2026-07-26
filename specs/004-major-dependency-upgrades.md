# Spec 004 — Major Dependency Upgrades

**Date:** 2026-07-25
**Status:** In progress — groups 1–3 landed 2026-07-26; next up group 4 (test harness)
**Scope:** 26 packages with major version bumps available (root + `server/`)

Patch/minor updates are handled separately by a single command (see README of this spec, bottom). This document covers only **major** bumps, each with a codebase impact estimate.

---

## Impact Summary

| Tier                      | Packages                                                                                                                                                                                                                                     | Codebase changes             |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| **A — Drop-in**           | `@types/ramda`, `ramda`, `next-themes`, `@storybook/addon-mcp`, `@fontsource/inter`, `vite-plugin-checker`, `@fastify/swagger-ui`                                                                                                            | 0 files                      |
| **B — Small, contained**  | `zustand`, `query-string`, `husky`, `jsdom`, `@testing-library/jest-dom` + `@types/testing-library__jest-dom`, `concurrently`, `eslint-plugin-react-refresh`, `eslint-plugin-react-you-might-not-need-an-effect`, `eslint-plugin-boundaries` | 1–3 files each               |
| **C — Medium**            | `ky`, `lucide-react`, `react-router`, `i18next` family, `eslint` 10 + `@eslint/js` + `eslint-plugin-react-hooks`, `msw-storybook-addon`, `@types/node`                                                                                       | 3–25 files each              |
| **D — High risk / defer** | `typescript` 5→7                                                                                                                                                                                                                             | Whole codebase, tooling-wide |

---

## Tier A — Drop-in (no code changes)

✅ **Done** — split across group 1 (`ramda`, `@types/ramda`, `next-themes`, `@storybook/addon-mcp`), group 2 (`@fontsource/inter`, `vite-plugin-checker`) and group 3 (`@fastify/swagger-ui`).

Bump version, run `pnpm typecheck && pnpm lint && pnpm test`. Nothing else expected.

| Package                | From → To       | Notes                                                                                                                                              |
| ---------------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ramda`                | 0.31.3 → 0.32.0 | Pre-1.0 minor-as-major. Used in 7 files, all named imports (`clone`, `curry`, `omit`, `lensPath`…). No signature changes to those.                 |
| `@types/ramda`         | 0.30.2 → 0.32.0 | Aligns with runtime; currently mismatched (0.30 types vs 0.31 runtime). Fix regardless.                                                            |
| `next-themes`          | 0.4.4 → 0.4.6   | Pre-1.0; actually a patch.                                                                                                                         |
| `@storybook/addon-mcp` | 0.5.0 → 0.7.0   | Dev-only Storybook addon, no app code.                                                                                                             |
| `@fontsource/inter`    | 4.5.15 → 5.3.0  | v5 keeps the `@fontsource/inter/400.css` import path. Only 3 imports, all in [App.tsx:5-7](src/app/App.tsx#L5-L7). Verify fonts render after bump. |
| `vite-plugin-checker`  | 0.12.0 → 0.14.5 | Pre-1.0. Config lives in [vite.config.ts](vite.config.ts) — confirm the `typescript` option shape is unchanged.                                    |
| `@fastify/swagger-ui`  | 5.2.5 → 6.1.0   | `server/` only, dev-facing docs UI. Requires Fastify 5 (already on 5.8.5).                                                                         |

---

## Tier B — Small, contained

### B1. `zustand` 4.5.4 → 5.0.14

**Files:** 2 — [auth-store.ts](src/features/auth/application/auth-store.ts), [create-modal-store.ts](src/lib/components/Modal/create-modal-store.ts)

v5 breaking changes and whether they hit us:

- Default export removed → **not used**, both files use named `create` / `createStore` / `useStore`. ✅
- `createContext` from `zustand/context` removed → **not used**; `auth-store` already uses React's own `createContext` + `useStore(store, selector)`, which is the v5-recommended pattern. ✅
- React 18+ required → on React 19. ✅
- Selectors returning new object/array references now warn (uses `useSyncExternalStore` strictly) → audit every `useAuthStore(...)` call site for selectors that construct new objects. Grep `useAuthStore(` and confirm each returns a primitive or stable reference.
- `setState` replace-flag typing tightened → our `set({...})` partial calls are fine. ✅

**Estimated work:** version bump + audit of `useAuthStore` selector call sites. Likely zero edits.

### B2. `query-string` 8.2.0 → 9.4.1

**Files:** 1 — [build-url.ts](src/lib/build-url.ts)

v9 drops CJS and raises the Node floor; the `stringify(params, { arrayFormat: "comma" })` API is unchanged. Only risk is Vitest/Node resolution of the ESM-only build. Verify by running the unit tests that cover `buildUrl`.

**Estimated work:** version bump, no source edits expected.

### B3. `husky` 8.0.3 → 9.1.7 — ✅ done (group 3, `c87a7c8`)

**Files:** 2 — [package.json](package.json) (`prepare` script), [.husky/pre-commit](.husky/pre-commit)

v9 removes the shebang + `husky.sh` sourcing convention and changes `husky install` → `husky`.

- `package.json`: `"prepare": "husky install"` → `"prepare": "husky"`
- `.husky/pre-commit`: delete the first two lines (`#!/bin/sh` and the `. "$(dirname ...)/_/husky.sh"` line), leaving only `npx pretty-quick --staged`

**Estimated work:** 2 small edits. Verify with a test commit.

### B4. `jsdom` 21.1.2 → 29.1.1

**Files:** 0 — referenced only as `environment: "jsdom"` in [vitest.config.ts:26](vitest.config.ts#L26)

An 8-major jump, but the surface is Vitest's environment adapter, not our code. Newer jsdom implements more DOM APIs, which usually _fixes_ tests rather than breaking them. Risk: a test currently relying on a jsdom gap (e.g. a `matchMedia` or `ResizeObserver` polyfill in test setup) could behave differently.

**Estimated work:** bump + full `pnpm test:unit` run; fix fallout only if it appears.

### B5. `@testing-library/jest-dom` 6.9.1 → 7.0.0 (+ remove `@types/testing-library__jest-dom`)

**Files:** 1 — [test-setup.ts:1](test-setup.ts#L1), plus package.json

v7 drops the legacy standalone `@types/testing-library__jest-dom` package (currently pinned at 5.14.9 — badly stale and referenced nowhere in the codebase besides package.json). The `@testing-library/jest-dom/vitest` import path is retained.

- Bump `@testing-library/jest-dom` to 7.0.0
- **Delete** `@types/testing-library__jest-dom` from devDependencies entirely — types ship with the package
- v7 tightens some matcher behavior (`toBeVisible`, `toHaveStyle`); check for failures across unit + storybook suites

**Estimated work:** 1 dependency removal + fix any matcher assertion fallout.

### B6. `concurrently` 10.0.4, `eslint-plugin-react-refresh` 0.5.3, `eslint-plugin-react-you-might-not-need-an-effect` 1.0.1, `eslint-plugin-boundaries` 7.1.0

**Files:** [package.json](package.json), [eslint.config.mjs](eslint.config.mjs), [eslint.feature-slices.mjs](eslint.feature-slices.mjs)

**Partially done:** `concurrently` landed in group 3 (`c87a7c8`). The three eslint plugins remain — they move to **group 11c**.

- ~~`concurrently` 10: Node floor raised; our usage is the plain `concurrently "pnpm dev" "pnpm dev:server"` form — unaffected.~~ ✅ Confirmed: `pnpm dev:all` starts both processes with `[0]`/`[1]` prefixing intact.
- `eslint-plugin-react-refresh` 0.5: `only-export-components` gained stricter detection. Set to `"error"` in [eslint.config.mjs](eslint.config.mjs) — expect new violations in files exporting both a component and a helper.
- `eslint-plugin-react-you-might-not-need-an-effect` 1.0: `configs.recommended` is consumed directly. New rules in 1.0 may flag existing effects.
- `eslint-plugin-boundaries` 7: config lives in [eslint.feature-slices.mjs](eslint.feature-slices.mjs). v7 changed some settings key names — re-verify the feature-slice rules still fire (deliberately break an import boundary and confirm the error appears).

**Estimated work:** config verification + fixing whatever new lint errors surface. Bundle these with the eslint 10 upgrade below (C5).

---

## Tier C — Medium

### C1. `ky` 0.33.3 → 2.0.2

**Files:** ~7 — [ky-client.ts](src/lib/http/ky-client.ts), [ajax-error.ts](src/lib/http/ajax-error.ts), [internal-server-exception.ts](src/lib/http/exceptions/internal-server-exception.ts), [resource-not-found-exception.ts](src/lib/http/exceptions/resource-not-found-exception.ts), [index.ts](src/lib/http/index.ts), plus consumers

The single highest-value upgrade here — 0.33 → 2.x spans two majors and years of changes. Concentrated in `src/lib/http/`, which is exactly the abstraction boundary that exists to absorb this.

Points to verify against the v2 API:

- `ky.create(options)` and the per-method `Options` type — the `KyClientOptions extends Options` re-export in [ky-client.ts:9](src/lib/http/ky-client.ts#L9)
- `hooks.beforeError` signature and the `HTTPError` shape (`error.response`, `error.request`, `error.options`) — our custom exception classes extend `HTTPError` and pass `(response, request, options)` to `super()`. The constructor signature is the most likely breakage.
- `hooks.beforeRequest` returning a `Request` to override — still supported, used for auth header injection
- `retry: 0` option shape
- `.json()` on the response promise
- ESM-only; Node floor raised (affects MSW/Vitest, not the browser build)

Also note per project memory: error detection in `src/lib/api/` uses `httpService.isError(e) && e.message === "..."`, never `AjaxError`/`e.status` — confirm `isError` in [index.ts](src/lib/http/index.ts) still narrows correctly after the bump.

**Estimated work:** rewrite of the exception class constructors + `KyClient` if `HTTPError`'s signature moved. Full MSW-backed unit suite is the safety net.

### C2. `lucide-react` 0.511.0 → 1.26.0

**Files:** 24

v1 is the first stable release. Breaking changes are mostly renamed/removed icons and the deprecated-alias cleanup. Every one of the 24 files imports named icons, so a missing export is a hard build error — cheap to detect, tedious to fix.

**Approach:** bump, run `pnpm typecheck`, resolve each unresolved icon name against the v1 icon list. No behavioral risk.

**Estimated work:** mechanical; count of edits = number of renamed icons in use (likely 0–5).

### C3. `react-router` 7.12.0 → 8.3.0

**Files:** 8 (grep shows 8 import sites, plus 22 files matching `react-router` overall including e2e/stories)

**Actual API surface used is tiny:** `createBrowserRouter`, `createMemoryRouter`, `RouterProvider`, `ScrollRestoration`, `useRouteError`. All are v8-stable data-router APIs.

Relevant v8 changes:

- Node/React floors raised — we're on React 19 ✅
- Several v7 future-flags became default behavior; check `.storybook` and app router setup for any `future: {...}` config that's now redundant
- `storybook-addon-remix-react-router` 6.1.0 must declare v8 compatibility — **this is the blocker to check first.** If it doesn't support react-router 8, the whole upgrade waits.
- `no-restricted-imports` in [eslint.config.mjs](eslint.config.mjs) already bans bare `react-router` patterns in some scopes; confirm the rule still matches.

**Estimated work:** small if the Storybook addon is compatible; blocked if not. Check addon peer deps before starting.

### C4. i18next family — `i18next` 26.3.6, `react-i18next` 17.0.11, `i18next-chained-backend` 5.0.5, `i18next-http-backend` 4.0.0

**Files:** 3 — [i18n.ts](src/lib/i18n/i18n.ts), [init-i18n.ts](src/test-lib/init-i18n.ts), [with-i18next.tsx](src/test-lib/storybook/with-i18next.tsx)

Upgrade all four together — they are version-locked peers.

Areas to verify in [i18n.ts](src/lib/i18n/i18n.ts):

- `InitOptions` shape — the file uses `satisfies InitOptions` so type errors will surface immediately at `pnpm typecheck` ✅
- `ChainedBackendOptions` / `HttpBackendOptions` types, also under `satisfies` ✅
- `i18n.reloadResources(lng, ns)` and `i18n.changeLanguage()` in the HMR block ([i18n.ts:66-79](src/lib/i18n/i18n.ts#L66-L79))
- i18next v25→v26 changed default interpolation/plural handling in places; run the full suite and check translated strings in Storybook
- `react-i18next` v17: `initReactI18next` and `useTranslation` are stable; the `Trans` component's prop handling changed — grep for `<Trans` usage

The `satisfies` operators make this largely typecheck-driven, which is why it's C not D.

**Estimated work:** config adjustments in 1–3 files + visual verification of rendered copy.

### C5. `eslint` 9.39.2 → 10.8.0 (+ `@eslint/js` 10.0.1, `eslint-plugin-react-hooks` 7.1.1)

**Files:** [eslint.config.mjs](eslint.config.mjs), [eslint.feature-slices.mjs](eslint.feature-slices.mjs), plus every file with new violations

Do this as **one batch** with the Tier B6 plugin bumps — mixing eslint majors with stale plugins produces confusing peer-dep errors.

- ESLint 10 removes long-deprecated APIs and formatters; flat config (already in use ✅) is now the only config format
- `defineConfig` from `eslint/config` is already used ✅
- `eslint-plugin-react-hooks` 5→7 is the big one: v7 ships the **React Compiler-powered lint rules** and `recommended-latest` now includes substantially more rules. Expect a wave of new errors across components. This is genuinely useful signal, but budget time for it.
- Verify each plugin declares an eslint 10 peer range: `typescript-eslint` (also bump to 8.65.0, minor), `eslint-plugin-import`, `eslint-plugin-prettier`, `eslint-plugin-react`, `eslint-plugin-storybook`, `eslint-plugin-vitest` (0.5.4 — stale, may be the blocker), `eslint-config-prettier`
- ⚠️ `eslint-plugin-vitest` 0.5.4 is deprecated upstream in favor of `@vitest/eslint-plugin`. It may not support eslint 10. Migrating means changing the import and rule prefixes in the `**/*.test.ts?(x)` block of [eslint.config.mjs](eslint.config.mjs).

**Estimated work:** the largest of the medium tier. Config edits are small; fixing new `react-hooks` v7 violations across the component tree is the real cost.

### C6. `msw-storybook-addon` 2.0.7 → 3.0.0

**Files:** [.storybook/preview.tsx](.storybook/preview.tsx) (or equivalent)

v3 aligns with Storybook 10 and MSW 2.x (already on msw 2.12.7). Check the `initialize()` / `mswLoader` export names and whether `mswDecorator` was removed in favor of the loader.

**Estimated work:** 1 file.

### C7. `@types/node` 25 → 26 (root + `server/`) — ✅ done (group 2, `f48d1f8`; both at 26.1.1)

**Files:** 0 expected

Bump both workspaces together to keep them aligned. Type-only; new Node 26 typings occasionally tighten `process.env` / stream signatures. Detected entirely by `pnpm typecheck`.

---

## Tier D — Defer

### `typescript` 5.9.3 → 7.0.2

**Files:** potentially all of `src/`, `e2e/`, `server/`, plus every tooling config

TypeScript 7 is the native (Go) compiler rewrite. It is a major behavioral and ecosystem event, not a routine bump:

- Every type-aware tool must support it: `typescript-eslint` (parser + `projectService`, which we rely on heavily — see [eslint.config.mjs](eslint.config.mjs) `parserOptions.projectService: true`), `vite-plugin-checker`, `@storybook/react-vite`, `tsx` in `server/`
- Stricter/changed inference will surface real errors in a codebase this type-heavy (branded types, `satisfies` blocks, generic building-block patterns)
- The `pnpm build` script is `tsc && vite build` — a compiler swap sits directly on the build path

**Recommendation:** do not upgrade in this pass. Revisit once `typescript-eslint` ships stable TS7 support and the Storybook/Vite toolchain confirms compatibility. Track as a separate spec.

---

## Recommended Execution Order

Grouped by **dominant verification signal** rather than by risk tier — each group has one gate that does the real proving, so a red build points at one cause instead of a mixed bag. Each group is one commit. The full gate (`pnpm typecheck && pnpm lint && pnpm test && pnpm test:e2e`) still runs on every group; the "primary gate" column is what actually catches breakage for that group, and what to run first when iterating.

| #   | Group                      | Packages                                                                                               | Primary gate                          | Rollback unit            |
| --- | -------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------- | ------------------------ |
| 0   | ~~**Baseline**~~ ✅        | all patch + minor (appendix command) — already landed before this spec                                 | full suite                            | one revert               |
| 1   | ~~**Silent deps**~~ ✅     | `ramda` + `@types/ramda`, `next-themes`, `@storybook/addon-mcp` — `2984391`                            | `pnpm typecheck`                      | one revert               |
| 2   | ~~**Build & tooling**~~ ✅ | `@fontsource/inter`, `vite-plugin-checker`, `@types/node` (root + `server/`) — `f48d1f8`               | `pnpm build` + dev server boot        | per package              |
| 3   | ~~**Repo infra**~~ ✅      | `husky`, `concurrently`, `@fastify/swagger-ui` — `c87a7c8`                                             | test commit + `pnpm dev:all`          | per package              |
| 4   | **Test harness** ← next    | `jsdom`, `@testing-library/jest-dom` (− `@types/testing-library__jest-dom`)                            | `pnpm test:unit` + storybook suite    | per package              |
| 5   | **App state & utils**      | `zustand`, `query-string`                                                                              | unit suite (store + `buildUrl` tests) | per package              |
| 6   | **Icons**                  | `lucide-react`                                                                                         | `pnpm typecheck`                      | one revert               |
| 7   | **HTTP layer**             | `ky`                                                                                                   | MSW-backed `src/lib/http` unit suite  | one revert               |
| 8   | **i18n**                   | `i18next`, `react-i18next`, `i18next-chained-backend`, `i18next-http-backend`                          | `pnpm typecheck` + Storybook visual   | all four (locked peers)  |
| 9   | **Routing**                | `react-router`, `storybook-addon-remix-react-router`                                                   | `pnpm test:e2e` + Storybook           | both (gated on OQ1)      |
| 10  | **Storybook mocking**      | `msw-storybook-addon`                                                                                  | storybook suite                       | one revert               |
| 11  | **Lint stack**             | `eslint` 10, `@eslint/js`, `eslint-plugin-react-hooks` 7, B6 plugins, `eslint-plugin-vitest` migration | `pnpm lint`                           | config revert; see below |
| 12  | **Deferred**               | `typescript` 5→7                                                                                       | —                                     | separate spec            |

### Execution log

**Groups 1–3 — landed 2026-07-26.** Baseline before starting was green (typecheck, lint, build). No source-file edits were needed in any of the three; the only code changes were husky's v9 convention (`"prepare": "husky"` + shebang/`husky.sh` lines dropped from `.husky/pre-commit`).

Two findings that carry forward:

- ⚠️ **New unmet peer:** `vite-plugin-checker@0.14.5` requires `eslint >=9.39.4`; repo is on 9.39.2. Non-fatal — the checker runs and reports `Found 0 errors` in both build and dev. **Group 11 resolves it.** Do not chase it before then.
- ⚠️ **`pnpm test` (both projects together) is unreliable locally.** The combined run ends with a `[birpc] rpc is closed` browser-teardown error and ~7 of 45 files marked failed, while every individual test passes (132/132). This is a local concurrency flake, not a regression — storybook tests may need isolation to pass. **Consequence: `pnpm test:unit` was the trustworthy gate for groups 1–3, and the storybook suite is unverified for them.** Confirm in CI. This matters most for groups 4, 9 and 10, whose primary gate _is_ the storybook suite — run those isolated or lean on CI.

Also worth noting: pulling `@fontsource/inter` and `vite-plugin-checker` out of Tier A was load-bearing. Neither is provable by typecheck — fonts needed a served-asset check (woff2 200 in dev, 42 font files emitted to `dist/`) and the checker needed a real build to confirm its config shape. In the original tier ordering both would have ridden along in a typecheck-only commit.

### Why these groupings are more testable than the tier order

- **One failure mode per group.** Group 6 can only fail as an unresolved icon export; group 7 can only fail as an HTTP/exception-shape change. If group 5 goes red, it is zustand or query-string — not a jsdom interaction.
- **Groups 1–5 are independent of each other** and can be done in any order, or in parallel branches. Groups 6–11 are ordered because each widens the blast radius of the previous gate.
- **Every group is revertable without unwinding a later one.** Only groups 8 and 9 have a multi-package atomic unit (version-locked peers); everywhere else a single package can be dropped from the group and the rest still ship.
- **Test infra moves before the code it tests.** Group 4 lands ahead of groups 5–10 so any later failure is attributable to the library, not to a changed test environment. That is the main reordering versus the tier list.
- **Lint is last on purpose.** Group 11 is the only group expected to touch a large number of source files (react-hooks v7 wave). Running it last means those edits sit on top of an otherwise-green tree.

### Splitting group 11 if it gets noisy

Group 11 is the one group likely to exceed the >300 LOC / >3 file threshold. If the react-hooks v7 violation wave is large, split it:

- **11a** — `eslint` 10 + `@eslint/js` + peer-range verification + `eslint-plugin-vitest` → `@vitest/eslint-plugin` migration, with `eslint-plugin-react-hooks` **pinned at 5**. Gate: `pnpm lint` clean with no source edits.
- **11b** — `eslint-plugin-react-hooks` 5→7 alone. Gate: `pnpm lint`, then fix violations. This isolates the source-file churn into a commit that contains nothing else.
- **11c** — B6 plugins (`react-refresh`, `you-might-not-need-an-effect`, `boundaries`). Gate: `pnpm lint` + the deliberate boundary-break check from B6.

This resolves Open Question 3: take the violations, but in their own commit.

## Open Questions

1. Does `storybook-addon-remix-react-router@6.1.0` support react-router 8? Gates C3.
2. Migrate `eslint-plugin-vitest` → `@vitest/eslint-plugin` as part of C5? The old package is deprecated regardless.
3. Accept the `eslint-plugin-react-hooks` v7 violation wave now, or pin at v5 and split it into its own task?

---

## Appendix — Patch/Minor Command

```bash
pnpm up @chakra-ui/react@3.36.1 @emotion/react@11.14.0 @tanstack/react-query@5.101.4 \
  @xstate/react@6.1.0 react@19.2.8 react-dom@19.2.8 react-error-boundary@6.1.2 \
  react-hook-form@7.83.0 xstate@5.32.5 \
  @playwright/test@1.62.0 @storybook/addon-docs@10.5.4 @storybook/addon-links@10.5.4 \
  @storybook/addon-vitest@10.5.4 @storybook/react-vite@10.5.4 storybook@10.5.4 \
  eslint-plugin-storybook@10.5.4 @testing-library/react@16.3.2 @types/react@19.2.17 \
  @vitejs/plugin-react@6.0.4 @vitest/browser-playwright@4.1.10 \
  @vitest/coverage-istanbul@4.1.10 vitest@4.1.10 dotenv@17.4.2 \
  eslint-import-resolver-typescript@4.4.5 eslint-plugin-prettier@5.5.6 msw@2.15.0 \
  playwright@1.62.0 prettier@3.9.6 typescript-eslint@8.65.0 vite@8.1.5 &&
pnpm --filter server up @fastify/cors@11.3.0 @fastify/jwt@10.2.0 @fastify/swagger@9.8.1 \
  fastify@5.10.0 tsx@4.23.1 &&
pnpm exec playwright install
```

Notes:

- `playwright` and `@playwright/test` move together to 1.62.0 — mismatched versions break the runner. The trailing `playwright install` refreshes the browser binaries for the new version.
- Per project convention, versions are pinned without `^`. `@playwright/test` and `@types/node` currently carry carets in [package.json](package.json) — strip them while editing.
