#!/bin/bash
# PostToolUse: Documentation & type safety check after TS/TSX edits
# Ensures exported functions/components have JSDoc and strong types

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path')

[ ! -f "$FILE_PATH" ] && exit 0

ISSUES=""

# 1. Check exported functions/components have JSDoc
# Find lines with 'export' followed by function/const/interface without a preceding JSDoc
MISSING_DOCS=$(awk '
  /^\/\*\*/ { has_doc=1 }
  /^\*\// { next }
  /^export (function|const|interface|type|class)/ {
    if (!has_doc) print NR": "$0
    has_doc=0
    next
  }
  /^export default/ {
    if (!has_doc) print NR": "$0
    has_doc=0
    next
  }
  { if (!/^\s*\*/ && !/^\/\*\*/) has_doc=0 }
' "$FILE_PATH" 2>/dev/null)

if [ -n "$MISSING_DOCS" ]; then
  ISSUES="${ISSUES}Exported symbols missing JSDoc documentation:\n${MISSING_DOCS}\n\n"
fi

# 2. Check for 'any' type usage
ANY_USAGE=$(grep -n '\bany\b' "$FILE_PATH" 2>/dev/null | grep -v '//.*any\|/\*.*any\|\.d\.ts' | grep -vE 'eslint-disable|@ts-ignore')
if [ -n "$ANY_USAGE" ]; then
  ISSUES="${ISSUES}Found 'any' type usage (use specific types instead):\n${ANY_USAGE}\n\n"
fi

# 3. Check for untyped function parameters
UNTYPED_PARAMS=$(grep -nE '\(([a-zA-Z_]+)\s*[,)]' "$FILE_PATH" 2>/dev/null | grep -v ': ' | grep -vE 'import|require|console|\.json|catch|=>')
if [ -n "$UNTYPED_PARAMS" ]; then
  # Only flag if it looks like a function definition
  FUNC_UNTYPED=$(echo "$UNTYPED_PARAMS" | grep -E '(function |=> |async )')
  if [ -n "$FUNC_UNTYPED" ]; then
    ISSUES="${ISSUES}Possible untyped function parameters:\n${FUNC_UNTYPED}\n\n"
  fi
fi

if [ -n "$ISSUES" ]; then
  jq -n --arg reason "Documentation & type check for $(basename "$FILE_PATH"):
$(echo -e "$ISSUES")Add JSDoc with @param/@returns for exported symbols. Use explicit types instead of 'any'." '{
    decision: "block",
    reason: $reason
  }'
  exit 0
fi

exit 0
