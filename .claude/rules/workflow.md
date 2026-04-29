---
paths:
  - "src/**"
  - "e2e/**"
---

# Workflow

## Scanning Repository

- Analyze using only files mentioned in the prompt or directly relevant to the task
- Check for `AIDEV-*` anchors in relevant subdirectories before scanning broadly

## Anchor Comments

Use `AIDEV-NOTE:`, `AIDEV-TODO:`, or `AIDEV-QUESTION:` for inline knowledge (≤ 120 chars, greppable).

- Grep for existing anchors before scanning files
- Update anchors when modifying associated code
- When an anchor is stale, update it instead of removing it; flag if unsure
- Add anchors when code is complex, critical, confusing, or potentially buggy

## Implementation

- Run `pnpm lint --fix` after making changes
- Stay within current task context — inform dev if a fresh start is needed
- When a task is done, verify it works before reporting completion
