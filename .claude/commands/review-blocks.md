# Review changed code against building blocks: $ARGUMENTS

Dev-triggered only. Read-only review — do not edit files.

## Steps

1. Get the diff: `git diff core...HEAD` plus uncommitted changes (`git diff`, untracked files). If `$ARGUMENTS` names files or a path, limit to those.
2. For each changed file, identify which building block it implements (see `.claude/skills/building-blocks/SKILL.md` for the catalogue).
3. Read the matching rule file(s) in `.claude/skills/building-blocks/rules/<block>.md`. Read only the blocks present in the diff.
4. Check each file against its rule file: placement, naming, shape, responsibilities, forbidden patterns. Flag code that should be a block but isn't (e.g. inline query keys, mutation logic in a component, business logic in a pure component).
5. Skip anything lint or typecheck already catches — focus on what they cannot.

## Output

One line per finding, most severe first:

`<file>:<line> — <block> — <violation> → <fix> (rule: rules/<block>.md)`

End with blocks reviewed and a count of findings. If none: "No block violations found." If a rule file is missing or ambiguous for a case, list it as a gap, do not guess.
