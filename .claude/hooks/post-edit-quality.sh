#!/bin/bash
# PostToolUse: Code quality check after TS/TSX edits
# Runs biome lint on the edited file and reports issues

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path')

# Skip if file doesn't exist (might have been a new file path)
[ ! -f "$FILE_PATH" ] && exit 0

# Run biome lint (not format — format hook handles that)
OUTPUT=$(cd "$CLAUDE_PROJECT_DIR" && npx @biomejs/biome lint "$FILE_PATH" 2>&1)
EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ]; then
  # Report lint issues back to Claude
  jq -n --arg reason "Lint issues in $FILE_PATH:
$OUTPUT" '{
    decision: "block",
    reason: $reason
  }'
  exit 0
fi

exit 0
