#!/usr/bin/env bash
set -euo pipefail
[[ "${EXPLORE_HAIKU:-0}" == "1" ]] || exit 0
jq 'if .tool_input.subagent_type == "Explore" then {
  hookSpecificOutput: { hookEventName: "PreToolUse", permissionDecision: "allow",
    updatedInput: (.tool_input + {model: "haiku"}) }
} else empty end'