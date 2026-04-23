# @hex-ui/cli

Copy Hex UI components into your project with one command. No runtime dependency on the library — you own the source.

## Install & run

No install required:

```bash
pnpm dlx @hex-ui/cli add button
```

Or install globally:

```bash
pnpm add -g @hex-ui/cli
hex add button
```

## Commands

### `hex init`

Creates a `hex.config.json` at your project root with sensible defaults. Run once per project; you can edit the file to point at a custom components directory.

### `hex add <slug> [...more]`

Copies one or more components (and their internal dependencies) into `components/ui/`. The CLI resolves dependency chains automatically — `hex add combobox` also pulls in `popover` and `command`.

```bash
hex add button input dialog
```

### `hex list`

Prints every component in the registry grouped by category.

### `hex recipe list`

Lists every available spec-driven recipe (auth form, settings page, pricing table, data table view, destructive confirm, command palette) with summary and component list.

### `hex recipe add <slug>`

Runs `hex add` for every component in the recipe in order, then prints the post-install checklist as plain markdown — paste it into a PR body or feed it to an agent.

```bash
hex recipe add settings-page
```

### `hex skills install`

Copies the eight bundled Hex UI skills into `.claude/skills/` (or a custom `--target`). Skills are SKILL.md prose packs that Claude Code loads on demand via trigger keywords.

```bash
hex skills install                         # default target: .claude/skills/
hex skills install --target ./my-skills    # custom location
hex skills install --overwrite             # replace existing skill dirs
```

### `hex add <slug>` — transitive deps

By default, `hex add <slug>` installs the slug plus every internal component it depends on (e.g. `hex add combobox` also installs `command`, `popover`, and their dependencies). Pass `--no-deps` to install only the named slug:

```bash
hex add combobox --no-deps   # writes combobox.tsx only; prints missing deps
```

## How it works

The CLI reads the public registry JSON at build time, writes component source into your project, and reports the npm peer-deps you need to install (Radix primitives, `class-variance-authority`, etc.). You get full ownership of the code — future CLI upgrades never overwrite your edits unless you re-run `add`.

## Docs

[hex-ui.dev/docs/installation](https://hex-ui.dev/docs/installation)

## License

MIT
