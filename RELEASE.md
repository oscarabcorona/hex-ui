# Release process

Hex UI is **pre-release**. No npm publishing happens automatically — the release workflow is gated to manual `workflow_dispatch` only. When the API stabilizes, re-enable the `push: main` trigger in `.github/workflows/release.yml` and seed a changeset.

Until then, contributors can still add changesets per PR — they just accumulate in `.changeset/` without triggering anything.

## Tooling

Hex UI uses [Changesets](https://github.com/changesets/changesets) for versioning + a GitHub Action for eventual publishing. As a contributor you never run `npm publish` manually.

## Adding a changeset

Every PR that changes a published-in-future package should include a changeset:

```bash
pnpm changeset
```

The CLI asks:

1. **Which packages** are affected? (space to select, enter to confirm)
2. **Bump type** per package: `patch` / `minor` / `major`.
3. **Summary** — one line that lands in CHANGELOG.md.

It writes `.changeset/<random-name>.md`. Commit it with the rest of your PR.

## Release flow (when we're ready)

When maintainers flip the workflow back on:

1. On every push to `main`, the action checks for pending changesets.
2. **If pending** → opens / updates a "Version Packages" PR rolling changesets into package `version` bumps + CHANGELOG entries.
3. **If none pending** (i.e. the Version PR just merged) → runs `pnpm release` which builds everything and calls `changeset publish`. Each publishable package lands on npm with `--provenance`.

Cadence:

1. Merge feature PRs (each with a changeset) to `main`.
2. Action accumulates a "Version Packages" PR.
3. Merge the Version PR when we want to ship.
4. Action publishes to npm automatically.

## Enabling the workflow

1. Uncomment the `push: branches: [main]` block in `.github/workflows/release.yml`.
2. Remove `workflow_dispatch:` if you want automatic-only (optional).
3. Ensure the secrets below are set.
4. Commit + push to `main`. First run creates the "Version Packages" PR (assuming changesets exist).

## Required secrets

`Settings → Secrets and variables → Actions`:

- **`NPM_TOKEN`** — an npm [automation token](https://docs.npmjs.com/creating-and-viewing-access-tokens) with publish rights on `@hex-ui`. Use **Granular Access Token** → "Packages and scopes" → `@hex-ui` → Read + Write.
- **`GITHUB_TOKEN`** — provided automatically by Actions; no setup needed.

## Provenance

All packages publish with `--provenance`, which attaches a cryptographically signed attestation (who built this, from what commit) that npm verifies. Requires `id-token: write` in the workflow permissions (already wired).

## Troubleshooting

- **403 "You must be a collaborator"** — npm account doesn't own `@hex-ui` scope. Claim the scope or change `publishConfig.access` / package names.
- **Provenance fails** — runner missing `id-token: write` or token lacks provenance support.
- **Version PR doesn't open** — no changeset files in `.changeset/` other than `config.json` and `README.md`. Add one with `pnpm changeset`.
