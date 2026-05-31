---
name: building-blocks
description: Frontend building block catalog — typed patterns for components, hooks, queries, mutations, stores, and models. ALWAYS read the relevant rule file before creating or modifying any building block in src/features/ or src/lib/. This includes spec implementation (read rule files for every block in the Building Blocks Diff), new feature work, refactoring, and architectural decisions.
---

# Frontend Building Blocks

Typed catalog of building blocks used in this project. Each block has a fixed name, layer, composition rules, and canonical example.

## How to Use

Read the rule file for each block you are about to implement. The summaries below are for routing — the rule files contain the full pattern.

## Block Catalog

### Data Fetching

| Block                      | Layer        | Summary                                                                                                                           | File                                |
| -------------------------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| `mutation-options-factory` | `lib/api/`   | Reusable `mutationOptions()` factories with domain error translation. Composed by `mutation-hook` in `providers/`.                | `rules/mutation-options-factory.md` |
| `mutation-hook`            | `providers/` | Server write via `useMutation` composed from `mutation-options-factory`, with cache invalidation. Returns `[handler, isPending]`. | `rules/mutation-hook.md`            |
| `query-options-factory`    | `lib/api/`   | Reusable `queryOptions()` factories — no hooks, no `useQuery`. Hook composition belongs in `providers/`.                          | `rules/query-options-factory.md`    |
| `query-keys-factory`       | `lib/api/`   | Hierarchical `as const` key tuples per resource. Single source of truth for cache invalidation.                                   | `rules/query-keys-factory.md`       |
| `dto-model`                | `lib/api/`   | TypeScript interfaces mirroring the raw API wire format. No transformations.                                                      | `rules/dto-model.md`                |

### State Management

| Block      | Layer          | Summary                                                                                                                                                                  | File                |
| ---------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------- |
| `store`    | `application/` | Zustand store — small, focused, selector-only subscriptions. Actions live inside the store.                                                                              | `rules/store.md`    |
| `machine`  | `application/` | XState machine for multi-step async flows. Discriminated-union context; actors wrap the slice's own providers; typed `ErrorActorEvent` rejections; emits events outward. | `rules/machine.md`  |
| `provider` | `providers/`   | Thin React Context wrapper for dependency injection. No logic — delivers state, doesn't manage it.                                                                       | `rules/provider.md` |

### App Orchestration

| Block           | Layer          | Summary                                                                | File                     |
| --------------- | -------------- | ---------------------------------------------------------------------- | ------------------------ |
| `use-case-hook` | `application/` | Orchestrates mutation + notification into one feature-level operation. | `rules/use-case-hook.md` |

### Component Patterns

| Block                | Layer          | Summary                                                                                            | File                          |
| -------------------- | -------------- | -------------------------------------------------------------------------------------------------- | ----------------------------- |
| `notification-hook`  | `application/` | Maps operation outcomes to toast notifications. One hook per use case.                             | `rules/notification-hook.md`  |
| `pure-component`     | `components/`  | Props in, JSX out. No side effects, no internal state beyond `useMemo`.                            | `rules/pure-component.md`     |
| `compound-component` | `components/`  | Dot-notation sub-components. Composition over configuration — no boolean prop toggles.             | `rules/compound-component.md` |
| `form`               | `components/`  | Context-driven form via `useForm` + `FormProvider` + field components.                             | `rules/form.md`               |
| `hoc`                | `components/`  | Component in → enhanced component out. For render-level decisions (auth gates, suspense wrappers). | `rules/hoc.md`                |
| `error-boundary`     | `components/`  | Scoped error handling for a feature component with its own query.                                  | `rules/error-boundary.md`     |
| `page`               | `pages/`       | Route-level orchestrator. Only place where router coupling is acceptable.                          | `rules/page.md`               |
| `facade-hook`        | `components/`  | Private logic extraction for a single component. Defined below the component, not exported.        | `rules/facade-hook.md`        |
| `named-effect`       | `components/`  | Named function expressions in `useEffect`. Intent visible at a glance.                             | `rules/named-effect.md`       |

### Data Modeling

| Block            | Layer          | Summary                                                                                    | File                      |
| ---------------- | -------------- | ------------------------------------------------------------------------------------------ | ------------------------- |
| `frontend-model` | `models/`      | UI-friendly domain objects mapped from DTOs. Skip if DTO shape is identical.               | `rules/frontend-model.md` |
| `value-object`   | `application/` | Static-method classes grouping domain logic for a single concept. Namespace, not instance. | `rules/value-object.md`   |

## Rules

- Block files live in `rules/` — one file per block.
- Each file contains: description, constraints, and a canonical code example.
- Block names are stable identifiers referenced in specs and task breakdowns.
