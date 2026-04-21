import { CodeBlock } from "../../../components/code-block";
import { DocsBreadcrumb } from "../../../components/docs-breadcrumb";
import { DocsFooter } from "../../../components/docs-footer";
import { OnThisPage } from "../../../components/on-this-page";

const MCP_SETTINGS = `// .claude/settings.json
{
  "mcpServers": {
    "hex-ui": {
      "command": "npx",
      "args": ["@hex-ui/mcp"]
    }
  }
}`;

export const metadata = {
	title: "Introduction",
	description: "Hex UI is an AI-native component library with MCP distribution.",
};

/** Docs intro page — overview, MCP wiring, and tech stack. */
export default function GettingStarted() {
	return (
		<div className="flex">
			<main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8">
				<DocsBreadcrumb
					trail={[{ label: "Docs", href: "/docs" }, { label: "Introduction" }]}
				/>

				<div className="mb-8">
					<h1 className="text-3xl font-bold tracking-tight">Introduction</h1>
					<p className="mt-2 text-lg text-muted-foreground">
						Beautifully designed components with AI-native metadata. Accessible.
						Customizable. Open Source.
					</p>
				</div>

				<div className="max-w-none space-y-6">
					<p className="text-base leading-7">
						Hex UI is a component library designed for both{" "}
						<strong>AI coding assistants</strong> and <strong>human developers</strong>.
						Every component ships with machine-readable schemas, usage hints, and
						accessibility metadata that LLMs can consume via MCP.
					</p>

					<h2 id="what" className="mt-8 scroll-mt-20 text-xl font-semibold">
						What is Hex UI?
					</h2>
					<p className="text-base leading-7">
						Unlike traditional component libraries, Hex UI is <strong>not</strong> a package
						you install as a dependency. Instead, you pick the components you need and copy
						them into your project. This gives you full ownership and control over the code
						— no vendor lock-in, no version conflicts.
					</p>

					<h2 id="ai-native" className="mt-8 scroll-mt-20 text-xl font-semibold">
						AI-Native
					</h2>
					<p className="text-base leading-7">
						Every component includes a{" "}
						<code className="rounded bg-muted px-1.5 py-0.5 text-sm">.schema.ts</code> file
						with structured metadata:
					</p>
					<ul className="list-disc space-y-2 pl-6 text-base">
						<li>
							<strong>Props, variants, slots</strong> — machine-readable interface
						</li>
						<li>
							<strong>AI hints</strong> — when to use, when not to use, common mistakes
						</li>
						<li>
							<strong>Accessibility notes</strong> — what ARIA attributes to include
						</li>
						<li>
							<strong>Token budget</strong> — estimated LLM token cost
						</li>
						<li>
							<strong>Examples</strong> — code snippets for common patterns
						</li>
					</ul>

					<h2 id="mcp" className="mt-8 scroll-mt-20 text-xl font-semibold">
						MCP Server
					</h2>
					<p className="text-base leading-7">
						Add the Hex UI MCP server to your Claude Code settings and discover components
						with natural language:
					</p>
					<CodeBlock label="json" code={MCP_SETTINGS} />
					<p className="text-base leading-7">
						Then ask:{" "}
						<em>&quot;Search hex-ui for a button component and add it to my project.&quot;</em>
					</p>

					<h2 id="tech" className="mt-8 scroll-mt-20 text-xl font-semibold">
						Tech Stack
					</h2>
					<ul className="list-disc space-y-2 pl-6 text-base">
						<li>
							<strong>Radix UI</strong> — accessible headless primitives
						</li>
						<li>
							<strong>Tailwind CSS</strong> — utility-first styling
						</li>
						<li>
							<strong>CVA</strong> — class-variance-authority for variant management
						</li>
						<li>
							<strong>TypeScript</strong> — strict types throughout
						</li>
					</ul>
				</div>

				<DocsFooter pathname="/docs/getting-started" />
			</main>
			<OnThisPage
				sections={[
					{ id: "what", title: "What is Hex UI?" },
					{ id: "ai-native", title: "AI-Native" },
					{ id: "mcp", title: "MCP Server" },
					{ id: "tech", title: "Tech Stack" },
				]}
			/>
		</div>
	);
}
