#!/bin/bash
# PostToolUse: Code quality check after TS/TSX edits
# Runs eslint on the edited file and reports issues

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path')

# Skip if file doesn't exist
[ ! -f "$FILE_PATH" ] && exit 0

# Run eslint (format hook handles prettier)
OUTPUT=$(cd "$CLAUDE_PROJECT_DIR" && npx eslint "$FILE_PATH" 2>&1)
EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ]; then
  jq -n --arg reason "Lint issues in $FILE_PATH:
$OUTPUT" '{
    decision: "block",
    reason: $reason
  }'
  exit 0
fi

exit 0
