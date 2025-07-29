# Push these changes to GitHub: $ARGUMENTS.

If no topic provided, just document the recent changes.  
If a topic is provided, focus on documenting that topic.

## Follow these steps:

> Note: skip steps 2 & 3 if there is nothing to commit

1. run `git status` to get the current branch name and learn about changes being made
2. run `git add src/*` to stage all files (unless the user says otherwise)
3. run `git commit -m "commit message"` to commit changes (make the message very concise yet complete, do not give yourself credit)
4. run `git push --set-upstream origin <branch_name>` to push changes to GitHub

## # Important Rules:

- FOLLOW THIS EXACT ORDER. EACH STEP IS A SEPARATE TERMINAL.
- commit messages cannot contain newline characters
- never just do `git commit`. always include a commit message
- keep commit messages concise, while still clearly describing the changes
- if the user mentions a specific issue number, include it in the commit message
- NEVER EVER do a force push
- NEVER EVER commit files outside of `src` dir
- Follow Conventional Commits specification:
  - for fixes, prefix with "fix: "
  - for new features, prefix with "feat: "
  - for edits, prefix with "chore: "
  - Example: `fix: add logging to catch block of <query_name> query`, `feat: add client side validation to login form`

## # Commonly used branches:

- `core` – Production branch. Never push (unless the user says otherwise).
- `basic` – Production branch. Never push (unless the user says otherwise).

PS: always run `git status` to get the current branch name.
