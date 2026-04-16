---
name: hex:pr-review
description: Review a PR — GitHub mode (post review), Local mode (terminal), or Fix mode (review + auto-fix)
argument-hint: '[PR#] [--local] [--fix]'
---

# PR Review

Comprehensive code review for Hex UI with severity classification.

## Arguments

<arguments> #$ARGUMENTS </arguments>

**Parse arguments:**
- `PR#` or PR URL — specific PR to review (default: current branch's PR)
- `--local` — review locally, print to terminal, no GitHub interaction
- `--fix` — review + auto-fix Critical/High issues as commits

## Step 0 — Determine Mode

| Signal | Mode |
|--------|------|
| PR number given, no --local/--fix | **GitHub** — post `gh pr review` |
| `--local` or no PR exists | **Local** — print findings to terminal |
| `--fix` | **Fix** — review + apply fixes + commit |

## Step 1 — Gather Diff

**GitHub mode:**
```bash
gh pr view <N> --json number,title,body,baseRefName,headRefName,url
gh pr diff <N>
```

**Local/Fix mode:**
```bash
git diff main...HEAD
git log --oneline main..HEAD
```

## Step 2 — Analyze Changes

Review every changed file against these criteria:

### Hex UI Specific Checks
- [ ] Component has both `.tsx` and `.schema.ts` files
- [ ] Schema has complete `ai` field (whenToUse, whenNotToUse, commonMistakes, relatedComponents, accessibilityNotes, tokenBudget)
- [ ] Props in schema match actual component props
- [ ] All variants in schema match CVA variants
- [ ] Styling follows conventions: `transition-all duration-200`, focus rings, hover shadows, `active:scale-[0.98]`
- [ ] Uses `cn()` for class merging
- [ ] Imports use `.js` extension (ESM)
- [ ] No `console.log` in production code

### General Code Quality
- [ ] TypeScript: no `any`, no type assertions without justification
- [ ] No hardcoded strings that should be tokens
- [ ] Dependencies correctly listed in schema
- [ ] Tags are meaningful for search/discovery

### DRY (Architectural)
- [ ] No N identical page/component files that should be `[slug]/page.tsx` + `generateStaticParams()`
- [ ] No hardcoded prop tables, install commands, or usage examples that could be read from `.schema.ts` or `registry/items/*.json`
- [ ] No duplicated component source code across packages/apps (the docs app must import, not copy)
- [ ] Repeated inline JSX structures (3+ times) extracted into a shared component

### SOLID
- [ ] **SRP**: each component handles one visual concern (no god components >30 props)
- [ ] **OCP**: composition via slots/children preferred over prop branching
- [ ] **LSP**: components with the same interface are swappable (TypeScript enforces)
- [ ] **ISP**: minimal prop surface — no kitchen-sink union types
- [ ] **DIP**: behavior injected via props/context — no hardcoded external API calls

### React 19
- [ ] No `forwardRef` in new components — `ref` is a regular prop
- [ ] `"use client"` pushed as deep as possible — pages stay server unless they need hooks/events
- [ ] Forms use `useActionState` + `useFormStatus`, not manual loading state
- [ ] Async Server Components wrapped in `<Suspense>` where streaming helps

### Next.js 16
- [ ] `params` and `searchParams` awaited (they're async now)
- [ ] No custom webpack config (Turbopack is default)
- [ ] `generateStaticParams` + `generateMetadata` for dynamic docs routes
- [ ] `"use cache"` directive used when static behavior is desired (default is dynamic)
- [ ] `middleware.ts` replaced with `proxy.ts` if applicable

### Security
- [ ] No secrets or credentials
- [ ] No `eval()` or `innerHTML` in components
- [ ] No XSS vectors in component props

## Step 3 — Classify Findings

Each finding gets a severity:

| Severity | Meaning | Merge gate? |
|----------|---------|-------------|
| `[blocker]` | Must fix — broken functionality, security issue, missing schema | Yes |
| `[warning]` | Should fix — style violations, incomplete AI hints | No |
| `[suggestion]` | Optional — naming, simplification, extra examples | No |

Format: `P1 [blocker] — <title>` with file:line reference.

## Step 4 — Publish Review

**GitHub mode:**
```bash
gh pr review <N> --body "<review summary>" --event APPROVE|REQUEST_CHANGES|COMMENT
```

- `REQUEST_CHANGES` if any `[blocker]` findings
- `APPROVE` if no blockers
- `COMMENT` if only suggestions

Post inline comments for each finding:
```bash
gh api repos/{owner}/{repo}/pulls/{N}/comments -f body="<comment>" -f path="<file>" -f line=<line> -f side="RIGHT" -f commit_id="<sha>"
```

**Local mode:**
Print findings grouped by severity to terminal.

**Fix mode:**
1. Print findings
2. Auto-fix all `[blocker]` and `[warning]` issues
3. Run lint + build to verify fixes
4. Commit fixes: `fix(review): address PR review findings`
5. Re-review the diff — if clean, report success

## Step 5 — Report

Output:
- Total findings by severity
- Verdict: APPROVE / REQUEST_CHANGES / COMMENT
- List of unfixed items (if any)
