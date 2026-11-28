---
paths:
  - "src/**"
  - "e2e/**"
---

# Workflow

## Repository Scan

- For analysis, use only the files that the prompt names or that are directly related to the task.
- Before a broad scan, look for `AIDEV-*` anchors in the related subdirectories.

## Anchor Comments

Use `AIDEV-NOTE:`, `AIDEV-TODO:` or `AIDEV-QUESTION:` for inline knowledge (120 characters at most, easy to find with `grep`).

- Search for existing anchors with `grep` before you scan files.
- When you change the related code, update its anchors.
- When an anchor is old, update it. Do not remove it. If you are not sure, tell the dev.
- Add anchors when code is complex, critical, confusing, or possibly has bugs.

## Implementation

- Stay in the context of the current task. If a fresh start is necessary, tell the dev.
- Typecheck, lint and tests run only when the dev asks. Refer to "Verification On Demand" in CLAUDE.md.
