# @hex-core/mcp

MCP server for Hex UI. Gives any MCP-capable AI agent (Claude Code, Cursor, Continue, …) structured access to the component registry — no prose scraping, no copy-paste.

## Install

Zero install — just run via npx:

```bash
npx @hex-core/mcp
```

## Wire into Claude Code

Add to your `.claude/settings.json` (project or `~/.claude/` global):

```json
{
  "mcpServers": {
    "hex-ui": {
      "command": "npx",
      "args": ["@hex-core/mcp"]
    }
  }
}
```

## Wire into Cursor

Add to `.cursor/mcp.json` at your project root:

```json
{
  "mcpServers": {
    "hex-ui": {
      "command": "npx",
      "args": ["@hex-core/mcp"]
    }
  }
}
```

## Tools exposed

Components & themes:

- `search_components(query)` — fuzzy search across name, description, tags, AI hints
- `get_component(slug)` — full RegistryItem (props, variants, examples, AI metadata)
- `get_component_schema(slug)` — props, variants, slots, AI hints without source
- `list_themes()` — available theme presets
- `get_theme(name, format)` — full token set for a theme (css / json / tailwind)
- `scaffold_project(components, theme)` — init + starter components in one call
- `customize_component(slug, overrides)` — generate a themed variant

Spec-driven build flow:

- `list_recipes()` — catalog of spec-driven blueprints (auth form, settings page, pricing table, …)
- `get_recipe(slug)` — ordered install steps, union of peer deps, post-install checklist
- `resolve_spec(brief)` — deterministic brief → ranked component + recipe shortlist (no LLM call server-side)
- `verify_checklist(components, recipe?)` — cross-check installed components against the internal-dependency graph and the recipe's checklist

## Prompts that "just work"

- "Find a hex-ui component for a confirmation dialog and add it"
- "Resolve this spec into hex-ui components: build a settings page with notifications toggle"
- "Walk me through the hex-ui auth-form recipe and install it"
- "Verify I have all the hex-ui internal deps for combobox"

## Pair with skills

The MCP server returns structured data. For prose reasoning context (when to pick recipe X, how themes compose, React 19 anti-patterns), install the Hex UI skills pack:

```bash
npx @hex-core/cli skills install
```

Skills complement the MCP — one gives Claude Code trigger-keyword-based docs, the other gives it typed tool calls. See [hex-ui.dev/docs/skills](https://hex-ui.dev/docs/skills).

## Docs

[hex-ui.dev/docs/mcp](https://hex-ui.dev/docs/mcp)

## License

MIT
