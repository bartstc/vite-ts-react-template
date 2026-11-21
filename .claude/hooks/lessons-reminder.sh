#!/usr/bin/env bash
# SessionStart: remind the dev about untriaged lessons. Silent when there are none.
set -euo pipefail
file="${CLAUDE_PROJECT_DIR}/specs/lessons.md"
[[ -f "$file" ]] || exit 0
count=$(awk '/^## Inbox/{f=1} /^## Archive/{f=0} f && /^\*\*Status:\*\* new/{c++} END{print c+0}' "$file")
[[ "$count" -gt 0 ]] || exit 0
msg="${count} untriaged lesson(s) in specs/lessons.md — run /triage-lessons"
jq -n --arg m "$msg" '{systemMessage: $m}'
