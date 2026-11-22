# Lessons

Inbox of corrections waiting for triage. Not loaded at session start — promoted lessons live in the harness
(sensors, playbooks, principles, workflow rules). See `docs/coding-harness.md` → Learning loop.

- **Agent:** after a correction, append an entry with `Status: new`. Never edit rules, skills or docs from a lesson.
- **Dev:** run `/triage-lessons` to promote or discard. Promoted entries collapse to one line in the archive.

## Template

```markdown
## L<NNN> — <short title>

**Status:** new

**Rule:** <the rule to follow going forward>

**Why it failed:** <what caused the mistake>

**Evidence:** <file, diff, PR or correction date>
```

---

## Inbox

## L001 — Translation keys ship with user-facing values

**Status:** new

**Rule:** New user-facing value (enum, status, domain constant) → add its key to `public/locales/en-GB/translation.json` in the same task. Remove stale keys when values go away.

**Why it failed:** A new domain value shipped without a translation key; the label hook silently fell back to the raw string.

**How to apply:** Namespace mirrors the feature path — `features.products.categories.<key>` maps to `translation.json` → `features → products → categories → <key>`. Verify against the locale file and the feature's label hook or `messageKeys` map before finishing.

**Source:** Correction 2026-04-12 — `Category.Clothing` had no translation key; stale keys were left behind.

---

## Archive

- L002 — Never import DTO types outside `providers/` and `models/` → discarded: covered by `lib-api` boundary rules in `eslint.feature-slices.mjs`; Dto-named re-export gap not seen in practice
- L003 — Verification runs on demand only → promoted: `CLAUDE.md` Workflow §3
- L004 — Skills and docs stay portable → promoted: auto-memory `feedback_portable_skill_rules.md` (AIDEV-TODO: move into a skill-authoring playbook so it is shared)
