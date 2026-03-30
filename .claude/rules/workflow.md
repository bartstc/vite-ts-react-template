---
paths:
  - "src/**"
  - "e2e/**"
---

# Workflow

## While Implementing

- Use `pnpm lint --fix` for lint errors/warnings

## Scanning Repository

- **Use Only Referenced Files**: Analyze using only files mentioned in the prompt
- **Locate Anchors First**: Check for `AIDEV-*` anchors in relevant subdirectories before scanning
- **No Broad Scans**: Avoid scanning unreferenced files unless explicitly permitted
- **Handle Insufficient Information**: State "Insufficient information in provided files" and suggest specific files needed

## Anchor Comments

Use `AIDEV-NOTE:`, `AIDEV-TODO:`, or `AIDEV-QUESTION:` for inline knowledge that can be grep'd.

**Rules:**

- Keep concise (≤ 120 chars)
- Grep for existing anchors before scanning files
- Update anchors when modifying associated code
- Never remove without explicit human instruction

**Add anchors when code is:**

- Too complex
- Very important
- Confusing
- Could have a bug

**Note:** Anchor comments are an explicit exception to the "no comments unless requested" rule.
