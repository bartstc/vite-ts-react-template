# Frontend Building Blocks

A structured catalog of typed frontend building blocks, optimized for AI agents.

## Structure

- `rules/` — Individual building block files (one per block)
- `metadata.json` — Catalog metadata (version, categories)
- **`SKILL.md`** — Skill definition with progressive disclosure index

## Building Block Categories

| Category            | Blocks | Description                                                                           |
| ------------------- | ------ | ------------------------------------------------------------------------------------- |
| Data Fetching       | 4      | Query factories, mutations, keys, DTOs                                                |
| State Management    | 2      | Zustand stores, React Context providers                                               |
| App Orchestration   | 1      | Use case hooks composing mutations + notifications                                    |
| Component Patterns  | 7      | Pure components, compound components, forms, pages, HOCs, facade hooks, named effects |
| Test Infrastructure | 4      | Vitest unit tests, Storybook play-function tests, MSW handlers, test data fixtures    |
| Data Modeling       | 2      | Frontend models, value objects                                                        |

## How It Works

1. Agent reads `SKILL.md` — gets the catalog index with short summaries
2. When implementing a specific block, agent reads `rules/{block-name}.md`

## Creating a New Building Block

1. Create `rules/{block-name}.md`
2. Add frontmatter with `title`, `category`, `layer`, `composedWith`
3. Include: description, constraints, and a canonical code example
4. Update the catalog table in `SKILL.md`

## Block File Structure

```markdown
---
title: Block Display Name
category: Data Fetching | State Management | App Orchestration | Component Patterns | Test Infrastructure | Data Modeling
layer: providers/ | application/ | components/ | models/ | lib/api/ | pages/ | test-lib/handlers/ | test-lib/fixtures/ | co-located
composedWith: other-block-1, other-block-2
---

## Block Display Name

Description of what this block does, when to use it, and why.

### Constraints

- Hard rules for this block type

### Example

\`\`\`tsx
// Canonical implementation example
\`\`\`
```
