# @hex-core/components

[![npm](https://img.shields.io/npm/v/@hex-core/components.svg)](https://www.npmjs.com/package/@hex-core/components)
[![downloads](https://img.shields.io/npm/dm/@hex-core/components.svg)](https://www.npmjs.com/package/@hex-core/components)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/oscarabcorona/hex-core/blob/main/LICENSE)

AI-native React components — Radix UI + Tailwind CSS + CVA, with machine-readable schemas for every component.

## Install

You typically don't install this package directly. Use the CLI to copy components into your project:

```bash
pnpm dlx @hex-core/cli add button
```

If you want to import the built components directly:

```bash
pnpm add @hex-core/components
```

```tsx
import { Button } from "@hex-core/components";

export default function Page() {
  return <Button>Click me</Button>;
}
```

## What's inside

47 components across primitives (Button, Input, Checkbox, …) and compounds (Combobox, DataTable, Command, …). Every component ships with:

- Radix UI headless foundation where applicable
- CVA variants (`default`, `outline`, `ghost`, etc.)
- Canonical `transition-all duration-200 ease-out`
- HSL design tokens — override via CSS vars, no JS config needed
- A matching `.schema.ts` with AI hints (`whenToUse`, `whenNotToUse`, `commonMistakes`, `accessibilityNotes`, `tokenBudget`)

## Peer dependencies

- `react` 18 or 19
- `react-dom` 18 or 19
- `react-hook-form` (only needed by `<Form>` — tree-shaken if unused)
- `@tanstack/react-table` (only needed by `<DataTable>`)

## Docs

Full component catalog, demos, theming, and MCP integration: [hex-core.dev](https://hex-core.dev)

## License

MIT
