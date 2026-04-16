---
name: hex:pr-fix
description: Address PR review feedback — fetch comments, plan fixes, apply, commit, reply to reviewers
argument-hint: '[PR#]'
---

# Fix PR Review Feedback

Fetch all review comments from a PR, plan fixes, apply them, and reply to each reviewer comment.

## Arguments

<arguments> #$ARGUMENTS </arguments>

**Parse arguments:**
- `PR#` — specific PR number (default: current branch's PR)

## Step 1 — Find the PR

```bash
gh pr view --json number,title,url,headRefName
```

If no PR found for current branch, error and exit.

## Step 2 — Fetch All Comments

Gather every piece of feedback:

```bash
# Top-level review comments
gh pr view <N> --json reviews --jq '.reviews[] | {author: .author.login, state: .state, body: .body}'

# Inline review comments
gh api repos/{owner}/{repo}/pulls/<N>/comments --jq '.[] | {id: .id, author: .user.login, body: .body, path: .path, line: .line, created_at: .created_at}'

# Conversation comments
gh pr view <N> --json comments --jq '.comments[] | {author: .author.login, body: .body}'
```

## Step 3 — Categorize & Plan Fixes

For each comment, classify:

| Category | Action |
|----------|--------|
| `must-fix` | Blocker or explicit change request — fix it |
| `suggestion` | Optional improvement — fix if easy, skip if opinionated |
| `question` | Reviewer asking for context — reply with explanation |
| `resolved` | Already addressed or outdated — reply confirming |

Present the plan to the user:
- List each comment with its category and proposed action
- Ask for confirmation before proceeding

## Step 4 — Apply Fixes

For each `must-fix` and accepted `suggestion`:

1. Read the file at the referenced path/line
2. Understand the reviewer's intent
3. Apply the fix
4. Hooks fire automatically (format, lint, security)

After all fixes:
```bash
# Verify everything still works
pnpm run lint
pnpm build
pnpm run build:registry
```

If any check fails, fix the issue before proceeding.

## Step 5 — Commit & Push

Single commit with all fixes:
```bash
git add <changed files>
git commit -m "fix(review): address PR review feedback

- <summary of fix 1>
- <summary of fix 2>
- ..."

git push
```

## Step 6 — Reply to Comments

For each comment that was addressed:
```bash
gh api repos/{owner}/{repo}/pulls/<N>/comments/<id>/replies -f body="Fixed in <short-sha>. <brief explanation>"
```

For questions:
```bash
gh api repos/{owner}/{repo}/pulls/<N>/comments/<id>/replies -f body="<answer to the question>"
```

## Step 7 — Report

Output:
- Number of comments addressed
- Number of comments skipped (with reason)
- Number of questions answered
- QA status after fixes (lint/build/registry)
- Commit SHA
