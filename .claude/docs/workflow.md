# Workflow

## Plan & Review

### Before Starting Work

1. Always start with planning (unless requested not to)
2. Write plan to `.claude/tasks/TASK_NAME.md` - never present in chat
3. Plan should include: detailed implementation steps, reasoning, broken-down tasks
4. Research external knowledge/packages if needed (use Task tool)
5. Think MVP - don't over-plan
6. Ask for review before implementation

### While Implementing

- Update `.claude/tasks/TASK_NAME.md` as you work
- After completing tasks, append detailed change descriptions for handover
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
