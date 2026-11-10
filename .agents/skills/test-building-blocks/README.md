# Test Building Blocks

A structured catalog of typed test-related building blocks, optimized for AI agents.

## Structure

- `rules/` — Individual building block files (one per block)
- `metadata.json` — Catalog metadata (version, categories)
- **`SKILL.md`** — Skill definition with progressive disclosure index

## Building Block Categories

| Category               | Blocks | Description                                                                                |
| ---------------------- | ------ | ------------------------------------------------------------------------------------------ |
| Tests                  | 4      | Storybook play-function tests, Vitest hook tests, lib/api factory tests, Vitest unit tests |
| Support Infrastructure | 2      | MSW handler factories, deterministic test data fixtures                                    |

## How It Works

1. Agent reads `SKILL.md` — gets the catalog index, routing, the mocking boundary rule, and shared conventions (rationale lives in `docs/testing.md`)
2. When implementing a specific block, agent reads `rules/{block-name}.md`

## Creating a New Building Block

1. Create `rules/{block-name}.md`
2. Include: description, constraints, and a canonical code example
3. Update the catalog table in `SKILL.md`
4. Update `metadata.json` with the new block name under its category

## Block File Structure

```markdown
## Block Display Name

Description of what this block does, when to use it, and why.

### Constraints

- Hard rules for this block type (shared conventions stay in `SKILL.md`)

### Example

\`\`\`tsx
// Canonical implementation example
\`\`\`

### Anti-patterns

- ❌ What reviewers should reject, with the reason

### References

- `rules/other-block.md` — related block
```
