# Triage lessons: $ARGUMENTS

Dev-triggered only. Turn inbox lessons in `specs/lessons.md` into harness changes.

## Steps

1. Read the `## Inbox` section of `specs/lessons.md`. If `$ARGUMENTS` names lesson IDs, limit to those.
2. For each `Status: new` lesson, propose the strongest target, in this order:
   - **Sensor** — lint rule, type, import boundary or test (`eslint.config.mjs`, `eslint.feature-slices.mjs`, a `*.test.ts`)
   - **Playbook** — edit a skill rule file (`.claude/skills/*/rules/*.md`)
   - **Principle** — short "because X, therefore Y" paragraph in `docs/*.md`
   - **Workflow rule** — `CLAUDE.md` or `.claude/rules/*.md`, only for agent behaviour
   - **Discard** — one-off, or already covered (name where)
3. Present one line per lesson and wait for the dev's answer:
   `L<NNN> → <target>: <file> — <change in one sentence>`
4. For each approved lesson: make the change, then delete the full entry from the inbox and add one line to `## Archive`:
   `- L<NNN> — <title> → promoted: <file>` (or `→ discarded: <reason>`).
5. Report: changes made, files touched, lessons left in the inbox.

## Rules

- Never promote without the dev's explicit approval per lesson.
- Lint messages from a promoted sensor say what to do instead and name the playbook rule file.
- Keep promoted text generic and short — specifics only in code examples.
- Do not run checks unless the dev asks; suggest `/check` or `/check-tests` when a sensor was added.
