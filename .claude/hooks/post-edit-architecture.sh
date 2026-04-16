#!/bin/bash
# PostToolUse: Architecture checks after TSX edits
# Flags obvious DRY/SOLID/React19/Next16 violations as warnings

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path')

[ ! -f "$FILE_PATH" ] && exit 0
[[ "$FILE_PATH" != *.tsx && "$FILE_PATH" != *.ts ]] && exit 0

ISSUES=""

# 1. Deprecated React 19: forwardRef in new code
# (Allow in existing components/src/ during migration, flag elsewhere)
if [[ "$FILE_PATH" == *apps/docs/* ]] || [[ "$FILE_PATH" == *apps/*/src/* ]]; then
  if grep -n 'forwardRef' "$FILE_PATH" 2>/dev/null | grep -v '//.*forwardRef' > /dev/null; then
    ISSUES="${ISSUES}⚠ React 19: prefer 'ref' as a regular prop instead of forwardRef.\n"
  fi
fi

# 2. Page files with "use client" that only render known client demos
# (Heuristic: a file under app/**/page.tsx that imports only demos/components)
if [[ "$FILE_PATH" == *apps/*/src/app/*/page.tsx ]]; then
  if head -1 "$FILE_PATH" 2>/dev/null | grep -q '"use client"'; then
    # If the file has no useState/useEffect/onClick/etc, flag it
    if ! grep -qE 'useState|useEffect|useCallback|useMemo|useRef|onClick|onChange|useRouter|useParams|usePathname' "$FILE_PATH" 2>/dev/null; then
      ISSUES="${ISSUES}⚠ Next.js 16: page has 'use client' but no hooks/event handlers. Consider making it a Server Component and marking only children as client.\n"
    fi
  fi
fi

# 3. Synchronous params access in Next.js 16 pages
if [[ "$FILE_PATH" == *apps/*/src/app/*/page.tsx ]]; then
  # Look for `params.xxx` accessed without await
  if grep -nE '\bparams\.[a-zA-Z_]+' "$FILE_PATH" 2>/dev/null | grep -v 'await params\|params: Promise\|params\}: {' > /dev/null; then
    # Only flag if params is destructured without Promise type
    if ! grep -q 'params: Promise' "$FILE_PATH" 2>/dev/null; then
      ISSUES="${ISSUES}⚠ Next.js 16: 'params' and 'searchParams' are async — use 'await params' or type as Promise.\n"
    fi
  fi
fi

# 4. Multiple page.tsx files in app/docs/components/ suggest missing [slug]
# Only check when editing under docs/components/
if [[ "$FILE_PATH" == *apps/docs/src/app/docs/components/*/page.tsx ]]; then
  PARENT_DIR=$(dirname "$(dirname "$FILE_PATH")")
  PAGE_COUNT=$(find "$PARENT_DIR" -name "page.tsx" 2>/dev/null | wc -l | tr -d ' ')
  if [ "$PAGE_COUNT" -gt 5 ]; then
    # Only warn once per session — check for a marker in stderr/stdout pattern
    ISSUES="${ISSUES}ℹ DRY: ${PAGE_COUNT} similar page.tsx files detected. Consider collapsing to a single [slug]/page.tsx with generateStaticParams() reading from the registry.\n"
  fi
fi

if [ -n "$ISSUES" ]; then
  jq -n --arg reason "Architecture check for $(basename "$FILE_PATH"):
$(echo -e "$ISSUES")
See CLAUDE.md Architecture Rules for details." '{
    decision: "block",
    reason: $reason
  }'
  exit 0
fi

exit 0
