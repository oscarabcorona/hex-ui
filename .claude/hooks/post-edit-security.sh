#!/bin/bash
# PostToolUse: Security check after code edits
# Scans for secrets, console.log in prod code, and dangerous patterns

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path')

[ ! -f "$FILE_PATH" ] && exit 0

ISSUES=""

# Check for hardcoded secrets
if grep -nE '(password|secret|api_key|token|apikey)\s*[:=]\s*["\x27][^"\x27]{8,}' "$FILE_PATH" 2>/dev/null | grep -v '//.*password\|//.*secret\|\.schema\.' > /dev/null; then
  ISSUES="${ISSUES}Possible hardcoded secret detected.\n"
fi

# Check for console.log in production code (not test/script files)
if [[ "$FILE_PATH" != *test* && "$FILE_PATH" != *script* && "$FILE_PATH" != *spec* ]]; then
  CONSOLE_HITS=$(grep -n 'console\.log' "$FILE_PATH" 2>/dev/null)
  if [ -n "$CONSOLE_HITS" ]; then
    ISSUES="${ISSUES}console.log found in production code:\n${CONSOLE_HITS}\n"
  fi
fi

# Check for eval() usage
if grep -n '\beval\s*(' "$FILE_PATH" 2>/dev/null | grep -v '//.*eval\|build-registry' > /dev/null; then
  ISSUES="${ISSUES}eval() usage detected — potential security risk.\n"
fi

if [ -n "$ISSUES" ]; then
  jq -n --arg reason "Security check for $FILE_PATH:
$(echo -e "$ISSUES")" '{
    decision: "block",
    reason: $reason
  }'
  exit 0
fi

exit 0
