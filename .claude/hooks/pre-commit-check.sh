#!/bin/bash
# PreToolUse: Checks before git commit
# Validates: no secrets, no AI attribution, no --no-verify, commit msg format

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command')

ISSUES=""

# 1. Block Co-Authored-By / AI attribution in commit message
if echo "$COMMAND" | grep -qiE 'co-authored-by.*claude|co-authored-by.*anthropic|co-authored-by.*noreply@anthropic|generated with.*claude'; then
  ISSUES="${ISSUES}AI attribution detected in commit message. Remove Co-Authored-By and AI footers.\n"
fi

# 2. Check for .env or credential files in staged changes
STAGED=$(cd "$CLAUDE_PROJECT_DIR" && git diff --cached --name-only 2>/dev/null)
if echo "$STAGED" | grep -qE '\.env$|\.env\.|credentials|\.key$|\.pem$'; then
  ISSUES="${ISSUES}Sensitive file staged for commit: $(echo "$STAGED" | grep -E '\.env$|\.env\.|credentials|\.key$|\.pem$')\n"
fi

# 3. Check commit message format (imperative mood, reasonable length)
MSG=$(echo "$COMMAND" | grep -oP '(?<=-m ["'"'"'])[^"'"'"']+' | head -1)
if [ -n "$MSG" ]; then
  SUBJECT=$(echo "$MSG" | head -1)
  if [ ${#SUBJECT} -gt 72 ]; then
    ISSUES="${ISSUES}Commit subject too long (${#SUBJECT} chars, max 72).\n"
  fi
fi

# 4. Verify no --no-verify flag
if echo "$COMMAND" | grep -q '\-\-no-verify'; then
  ISSUES="${ISSUES}--no-verify flag detected. Hooks must not be skipped.\n"
fi

if [ -n "$ISSUES" ]; then
  jq -n --arg reason "Pre-commit check failed:
$(echo -e "$ISSUES")" '{
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "deny",
      permissionDecisionReason: $reason
    }
  }'
  exit 0
fi

exit 0
