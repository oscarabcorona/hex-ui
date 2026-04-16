#!/bin/bash
# PreToolUse: Checks before git push
# Ensures build passes and lint is clean before pushing

INPUT=$(cat)
COMMAND=$(echo "$INPUT" | jq -r '.tool_input.command')

ISSUES=""

# 1. Block force push to main/master
if echo "$COMMAND" | grep -qE 'push.*--force|push.*-f'; then
  BRANCH=$(echo "$COMMAND" | grep -oE '(main|master)' || true)
  if [ -n "$BRANCH" ]; then
    ISSUES="${ISSUES}Force push to $BRANCH is blocked.\n"
  fi
fi

# 2. Verify lint passes
LINT_OUTPUT=$(cd "$CLAUDE_PROJECT_DIR" && npx eslint . 2>&1)
if [ $? -ne 0 ]; then
  ISSUES="${ISSUES}Lint check failed. Fix before pushing:\n$(echo "$LINT_OUTPUT" | head -10)\n"
fi

# 3. Verify build succeeds
BUILD_OUTPUT=$(cd "$CLAUDE_PROJECT_DIR" && pnpm build 2>&1)
if [ $? -ne 0 ]; then
  ISSUES="${ISSUES}Build failed. Fix before pushing:\n$(echo "$BUILD_OUTPUT" | tail -10)\n"
fi

# 4. Verify gh auth
GH_USER=$(gh auth status 2>&1 | grep 'Active account' -B1 | head -1 | grep -oP 'account \K\w+')
if [ -z "$GH_USER" ]; then
  ISSUES="${ISSUES}No active GitHub account. Run: gh auth switch --user <username>\n"
fi

if [ -n "$ISSUES" ]; then
  jq -n --arg reason "Pre-push check failed:
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
