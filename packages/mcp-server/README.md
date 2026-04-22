# @hex-ui/mcp

MCP server for Hex UI. Gives any MCP-capable AI agent (Claude Code, Cursor, Continue, …) structured access to the component registry — no prose scraping, no copy-paste.

## Install

Zero install — just run via npx:

```bash
npx @hex-ui/mcp
```

## Wire into Claude Code

Add to your `.claude/settings.json` (project or `~/.claude/` global):

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

## Wire into Cursor

Add to `.cursor/mcp.json` at your project root:

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

## Tools exposed

- `search_components(query)` — fuzzy search across name, description, tags, AI hints
- `get_component(slug)` — full RegistryItem (props, variants, examples, AI metadata)
- `get_component_schema(slug)` — props, variants, slots, AI hints without source
- `list_themes()` — available theme presets
- `get_theme(name, format)` — full token set for a theme (css / json / tailwind)
- `scaffold_project(components, theme)` — init + starter components in one call
- `customize_component(slug, overrides)` — generate a themed variant

## Prompts that "just work"

- "Find a hex-ui component for a confirmation dialog and add it"
- "Search hex-ui for a data table primitive"
- "What hex-ui components should I use for a settings page?"

## Docs

[hex-ui.dev/docs/mcp](https://hex-ui.dev/docs/mcp)

## License

MIT
