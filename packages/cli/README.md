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

## How it works

The CLI reads the public registry JSON at build time, writes component source into your project, and reports the npm peer-deps you need to install (Radix primitives, `class-variance-authority`, etc.). You get full ownership of the code — future CLI upgrades never overwrite your edits unless you re-run `add`.

## Docs

[hex-ui.dev/docs/installation](https://hex-ui.dev/docs/installation)

## License

MIT
