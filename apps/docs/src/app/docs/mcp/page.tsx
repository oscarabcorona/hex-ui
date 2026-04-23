import Link from "next/link";
import { CodeBlock } from "../../../components/code-block";
import { DocSection, InlineCode } from "../../../components/doc-section";
import { DocsPage } from "../../../components/docs-page";

export const metadata = {
	title: "MCP Server",
	description: "Wire the Hex UI MCP server into Claude Code for natural-language component discovery.",
};

const CLAUDE_CONFIG = `// .claude/settings.json
{
  "mcpServers": {
    "hex-ui": {
      "command": "npx",
      "args": ["@hex-core/mcp"]
    }
  }
}`;

const CURSOR_CONFIG = `// .cursor/mcp.json
{
  "mcpServers": {
    "hex-ui": {
      "command": "npx",
      "args": ["@hex-core/mcp"]
    }
  }
}`;

const SECTIONS = [
	{ id: "why", title: "Why MCP?" },
	{ id: "claude-code", title: "Claude Code" },
	{ id: "cursor", title: "Cursor" },
	{ id: "tools", title: "Available tools" },
	{ id: "prompts", title: "Example prompts" },
];

/** MCP integration guide — client configs, available tools, prompt recipes. */
export default function McpPage() {
	return (
		<DocsPage
			pathname="/docs/mcp"
			title="MCP Server"
			description="The Hex UI MCP server exposes the component registry as structured tool calls. Install once and let your AI agent pick the right primitive."
			sections={SECTIONS}
			editPath="apps/docs/src/app/docs/mcp/page.tsx"
		>
			<DocSection id="why" title="Why MCP?">
				<p className="text-sm leading-6">
					Traditional docs are text — the agent reads hundreds of tokens to find a
					component. MCP gives the agent a <em>structured</em> catalog: search by
					behavior, read typed schemas, and install components as a tool call. The
					<InlineCode>.schema.ts</InlineCode> metadata is the contract.
				</p>
			</DocSection>

			<DocSection id="claude-code" title="Claude Code">
				<p className="text-sm leading-6">
					Add this to the Claude Code settings for your project (or the global settings
					under <InlineCode>~/.claude/</InlineCode>).
				</p>
				<CodeBlock label="json" code={CLAUDE_CONFIG} />
			</DocSection>

			<DocSection id="cursor" title="Cursor">
				<p className="text-sm leading-6">
					Cursor reads a <InlineCode>.cursor/mcp.json</InlineCode> at the project root.
				</p>
				<CodeBlock label="json" code={CURSOR_CONFIG} />
			</DocSection>

			<DocSection id="tools" title="Available tools">
				<ul className="list-disc space-y-2 pl-6 text-sm text-muted-foreground">
					<li>
						<strong>search_components</strong> — fuzzy search over name, description,
						tags, and AI hints
					</li>
					<li>
						<strong>get_component</strong> — full registry item (props, variants, AI
						hints, examples, source) for a slug
					</li>
					<li>
						<strong>get_component_schema</strong> — schema only, no source — for agents
						reasoning about an already-installed component
					</li>
					<li>
						<strong>list_themes</strong> — available theme presets
					</li>
					<li>
						<strong>get_theme</strong> — full token set for a theme (css / json /
						tailwind)
					</li>
					<li>
						<strong>scaffold_project</strong> — init + starter components in one call
					</li>
					<li>
						<strong>customize_component</strong> — generate a themed variant
					</li>
					<li>
						<strong>list_recipes</strong> — catalog of spec-driven blueprints (auth
						form, settings page, …)
					</li>
					<li>
						<strong>get_recipe</strong> — ordered install steps, union of peer deps,
						post-install checklist
					</li>
					<li>
						<strong>resolve_spec</strong> — deterministic brief → ranked component +
						recipe shortlist
					</li>
					<li>
						<strong>verify_checklist</strong> — cross-check installed components
						against the registry&rsquo;s internal-dependency graph
					</li>
				</ul>
				<p className="text-sm leading-6">
					See{" "}
					<Link className="underline underline-offset-2 hover:text-foreground" href="/docs/spec-driven">
						Spec-driven development
					</Link>{" "}
					for how the last four compose.
				</p>
			</DocSection>

			<DocSection id="prompts" title="Example prompts">
				<ul className="list-disc space-y-1 pl-6 text-sm text-muted-foreground">
					<li>&ldquo;Find a hex-ui component for a confirmation dialog and add it.&rdquo;</li>
					<li>
						&ldquo;Search hex-ui for a data table primitive and wire it to my users
						list.&rdquo;
					</li>
					<li>&ldquo;What hex-ui components should I use for a settings page?&rdquo;</li>
				</ul>
			</DocSection>
		</DocsPage>
	);
}
