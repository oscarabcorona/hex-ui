# Hex UI

[![CI](https://github.com/oscarabcorona/hex-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/oscarabcorona/hex-ui/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> **Pre-release.** Hex UI is not yet published to npm. We're stabilizing the API before the first public cut — install paths below will go live alongside v0.1.0.

**The component layer for spec-driven UI development.**

Hex UI turns a brief (or a `spec.md` / `plan.md` section) into a ranked component checklist over MCP. No server, no runtime — just static JSON and 11 MCP tools over a catalog of 47 components.

## Why Hex UI?

shadcn/ui is built for humans browsing docs. Hex UI is built for **AI agents** that need:

- **Machine-readable component specs** — Zod schemas with props, variants, slots, and constraints
- **AI hints** — `whenToUse`, `whenNotToUse`, `commonMistakes`, `accessibilityNotes` per component
- **Recipes** — six spec-driven blueprints (auth form, settings page, pricing table, data table, confirm-destructive, command palette) with ordered install steps and post-install checklists
- **MCP server** — 11 tools for component discovery, installation, theming, scaffolding, and spec resolution
- **Token budgets** — each component declares its token cost for efficient LLM context usage

## Quick Start

### For AI (MCP)

Add to your Claude Code settings (`.claude/settings.json`):

```json
{
  "mcpServers": {
    "hex-ui": {
      "command": "npx",
      "args": ["@hex-ui/mcp"]
    }
  }
}
```

Then ask Claude: *"Search hex-ui for a button component and add it to my project"*

### For Humans (CLI)

```bash
npx @hex-ui/cli init
npx @hex-ui/cli add button input label
```

## Packages

| Package | Description |
|---------|-------------|
| `@hex-ui/registry` | Zod schemas and types for the component registry |
| `@hex-ui/tokens` | Design token engine with 3 themes |
| `@hex-ui/components` | Component source code (React + Tailwind) |
| `@hex-ui/mcp` | MCP server for AI-native distribution |
| `@hex-ui/cli` | CLI for human developers |

## MCP Tools

| Tool | Purpose |
|------|---------|
| `search_components` | Discover components by query, category, or tags |
| `get_component` | Get full source code + metadata for installation |
| `get_component_schema` | Get props/variants/AI hints (token-efficient) |
| `get_theme` | Get theme in CSS, JSON, or Tailwind format |
| `list_themes` | List available themes |
| `scaffold_project` | Generate complete project setup |
| `customize_component` | Apply CSS overrides to components |
| `list_recipes` | Catalog of spec-driven blueprints |
| `get_recipe` | Ordered install steps + post-install checklist |
| `resolve_spec` | Deterministic brief → ranked component + recipe shortlist |
| `verify_checklist` | Cross-check installed components against the internal-dep graph |

See **[hex-ui.dev/docs/spec-driven](https://hex-ui.dev/docs/spec-driven)** for the full spec-driven workflow.

## Spec-driven example

```bash
# 1. Discover recipes
npx @hex-ui/cli recipe list

# 2. Install every component in a recipe + print its checklist
npx @hex-ui/cli recipe add settings-page
```

Or from an MCP client: ask *"Resolve this spec into hex-ui components: build a settings page with notifications toggle"* — `resolve_spec` returns the `settings-page` recipe and a ranked component shortlist.

## Skills (for Claude Code)

Hex UI ships eight prose context packs in `SKILL.md` format — overview, MCP tools decision tree, recipes workflow, theming, CLI, a11y, anti-patterns, registry authoring. Install in one command:

```bash
npx @hex-ui/cli skills install
```

This copies the skills into `.claude/skills/` so any agent working in your repo loads them via trigger keywords on demand. See **[hex-ui.dev/docs/skills](https://hex-ui.dev/docs/skills)**.

## Themes

- **Default** — Refined, neutral. Professional and versatile.
- **Midnight** — Dark-first with deep blues. Built for developer tools.
- **Ember** — Warm terracotta and amber. For creative applications.

## Components

**47 components** across primitives (Button, Input, Checkbox, Switch, Slider, …) and compounds (Combobox, DataTable, Command, Calendar, Date Picker, …). Every component ships with a machine-readable `.schema.ts` containing props, variants, AI hints (`whenToUse`, `whenNotToUse`, `commonMistakes`, `accessibilityNotes`), and a token budget.

Full catalog + live demos: **[hex-ui.dev/docs](https://hex-ui.dev/docs)**

## Development

```bash
pnpm install
pnpm build
pnpm run build:registry
```

## Architecture

```
hex-ui/
├── packages/
│   ├── registry/       # Zod schemas + types
│   ├── tokens/         # Design token engine
│   ├── components/     # React component source
│   ├── mcp-server/     # MCP server
│   └── cli/            # CLI tool
├── registry/           # Built registry JSON
└── scripts/            # Build scripts
```

Each component has two files:
- `{name}.tsx` — React component (Radix UI + Tailwind + CVA)
- `{name}.schema.ts` — Machine-readable spec with props, variants, AI hints

## License

[MIT](LICENSE)
