---
name: hex:pr
description: Open a PR with full QA — lint, typecheck, build, registry validation, visual QA, structured PR body
argument-hint: '[--draft]'
---

# Open PR with QA Pipeline

Create a pull request with automated quality checks, structured description, and QA status.

## Arguments

<arguments> #$ARGUMENTS </arguments>

**Parse arguments:**
- `--draft` — create as draft PR

## Step 1 — Gather Context

Run in parallel:
```bash
git status
git log --oneline main..HEAD
git diff --stat main..HEAD
git branch --show-current
```

Determine:
- Branch name → infer type (feat/fix/refactor/chore) and scope
- Commits since main → understand the change set
- Files changed → identify affected packages

## Step 2 — Read Full Diff & Categorize

```bash
git diff main...HEAD
```

- Read the full diff to understand all changes
- Categorize: `feat`, `fix`, `refactor`, `chore`, `docs`
- Identify scope from affected packages (registry, tokens, components, mcp, cli)
- Draft PR title: `<type>(<scope>): <description>` (max 70 chars)

## Step 3 — Run QA Checks

Run these checks and capture results:

```bash
# Lint
pnpm run lint 2>&1

# Build (includes type checking)
pnpm build 2>&1

# Registry build + validation
pnpm run build:registry 2>&1
```

Record pass/fail for each. If any fail, report the errors and ask whether to proceed or fix first.

## Step 4 — Verify Registry (if components changed)

If any files in `packages/components/` changed:
```bash
# Verify registry items are valid JSON
node -e "const fs = require('fs'); const items = fs.readdirSync('registry/items'); items.forEach(f => JSON.parse(fs.readFileSync('registry/items/' + f, 'utf-8'))); console.log('Registry valid:', items.length, 'items')"
```

## Step 5 — Push Branch

```bash
git push -u origin <branch-name>
```

## Step 6 — Create PR

Use `gh pr create` with a structured body:

```bash
gh pr create --title "<type>(<scope>): <title>" --body "$(cat <<'EOF'
## Summary
<2-4 bullet points describing what changed and why>

## Changes
<list of key changes by package>

## QA Status
| Check | Status |
|-------|--------|
| Lint (Biome) | ✅ Pass / ❌ Fail |
| Build (tsup) | ✅ Pass / ❌ Fail |
| Registry | ✅ Valid / ❌ Invalid |

## Type
- [ ] feat — new component or feature
- [ ] fix — bug fix
- [ ] refactor — code restructuring
- [ ] chore — tooling, config, deps
- [ ] docs — documentation only

## Test Plan
<bulleted checklist of how to verify the changes>

---
EOF
)"
```

If `--draft` argument was provided, add `--draft` flag.

## Step 7 — Report

Output:
- PR URL
- QA verdict (all pass / has failures)
- Summary of changes
