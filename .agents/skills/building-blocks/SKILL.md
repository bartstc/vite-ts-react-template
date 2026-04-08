---
name: building-blocks
description: Frontend building block catalog — typed patterns for components, hooks, queries, mutations, stores, and models used across the project. Use this skill whenever implementing, reviewing, or planning feature code, API integrations, state management, component patterns, or data modeling within src/features/ or src/lib/. Also triggers for architectural decisions about where code should live or which pattern to apply.
---

# Frontend Building Blocks

Typed catalog of building blocks used in this project. Each block has a fixed name, layer, composition rules, and canonical example.

## How to Use

Read the rule file for each block you are about to implement. The summaries below are for routing — the rule files contain the full pattern.

## Block Catalog

### Data Fetching

| Block                   | Layer        | Summary                                                                                                              | File                             |
| ----------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| `mutation-hook`         | `providers/` | Server write via `useMutation` with domain error translation and cache invalidation. Returns `[handler, isPending]`. | `rules/mutation-hook.md`         |
| `query-options-factory` | `lib/api/`   | Reusable `queryOptions()` factories — no hooks, no `useQuery`. Hook composition belongs in `providers/`.             | `rules/query-options-factory.md` |
| `query-keys-factory`    | `lib/api/`   | Hierarchical `as const` key tuples per resource. Single source of truth for cache invalidation.                      | `rules/query-keys-factory.md`    |
| `dto-model`             | `lib/api/`   | TypeScript interfaces mirroring the raw API wire format. No transformations.                                         | `rules/dto-model.md`             |

### State Management

| Block      | Layer          | Summary                                                                                            | File                |
| ---------- | -------------- | -------------------------------------------------------------------------------------------------- | ------------------- |
| `store`    | `application/` | Zustand store — small, focused, selector-only subscriptions. Actions live inside the store.        | `rules/store.md`    |
| `provider` | `providers/`   | Thin React Context wrapper for dependency injection. No logic — delivers state, doesn't manage it. | `rules/provider.md` |

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
| `hoc`                | `components/`  | Component in → enhanced component out. For render-level decisions (auth gates, suspense wrappers). | `rules/hoc.md`                |
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
