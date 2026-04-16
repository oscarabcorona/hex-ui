# Hex UI

**AI-native component library for LLMs and humans.**

Hex UI is a component registry designed for AI coding assistants (Claude Code, Cursor, v0) via MCP, with a CLI for human developers. Built on Radix UI + Tailwind CSS with a refined modern aesthetic.

## Why Hex UI?

shadcn/ui is built for humans browsing docs. Hex UI is built for **AI agents** that need:

- **Machine-readable component specs** — Zod schemas with props, variants, slots, and constraints
- **AI hints** — whenToUse, whenNotToUse, commonMistakes, accessibility notes per component
- **MCP server** — 7 tools for component discovery, installation, theming, and scaffolding
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

## Themes

- **Default** — Refined, neutral. Professional and versatile.
- **Midnight** — Dark-first with deep blues. Built for developer tools.
- **Ember** — Warm terracotta and amber. For creative applications.

## Components

### Primitives
- Button — Multiple variants, sizes, loading state, asChild composition
- Input — Smooth focus transitions, shadow effects
- Label — Accessible label with Radix UI primitive

*More components coming: textarea, select, checkbox, radio-group, switch, slider, toggle, badge, separator, form, dialog, dropdown-menu, popover, tooltip, tabs, accordion, card, hero-section, nav-bar, footer, pricing-table.*

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

MIT
