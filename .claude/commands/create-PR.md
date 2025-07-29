# Create a PR against this branch: $ARGUMENTS.

## Follow these steps:

1. ALWAYS start by running `git status` to check what branch you're on
2. Use this template: `gh pr create --base basic --head <branch_name> --title "very clear & concise title" --body "clear, detailed description of changes"`
3. Always create Pull Requests against the branch the user specifics.
4. If you run into issues, STOP and explain the error to the user.

## Remember:

- DO NOT CREDIT YOURSELF in the PR's description
  - Especially do not add this at the end: 🤖 Generated with [Claude Code](https://claude.ai/code)
- Use the GitHub CLI (`gh`) for all GitHub-related tasks
- Make titles clear & concise; make descriptions detailed yet focused, without testing plan; never credit yourself
- Define titles following Conventional Commits specification:
  - for fixes, prefix with "fix: "
  - for new features, prefix with "feat: "
  - for edits, prefix with "chore: "
  - Example: `fix: resolve logout bug`, `feat: add login form`
