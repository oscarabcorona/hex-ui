import Link from "next/link";
import type { ComponentType, ReactNode } from "react";
import type { RegistryItem } from "../lib/registry";
import { INSTALL_COMMAND_LABEL, installCommand, slugify, usageCode } from "../lib/registry";
import { CodeBlock } from "./code-block";
import { ComponentPreview } from "./component-preview";
import { OnThisPage } from "./on-this-page";
import { PropsTable } from "./props-table";

/**
 * Render a full component documentation page from a registry item.
 * Consumes the .schema.ts / registry JSON as the single source of truth —
 * no hand-written prop tables, install commands, or usage examples here.
 * @param item - The full registry item for the component
 * @param Demo - The demo component to render in the live preview
 */
export function ComponentPage({
	item,
	Demo,
}: {
	item: RegistryItem;
	Demo: ComponentType | undefined;
}) {
	const sections = [
		{ id: "installation", title: "Installation" },
		{ id: "usage", title: "Usage" },
		...item.examples.map((e) => ({ id: slugify(e.title), title: e.title })),
		{ id: "api-reference", title: "API Reference" },
		{ id: "ai-guidance", title: "AI Guidance" },
	];

	return (
		<div className="flex">
			<article className="flex-1 px-8 py-6">
				<div className="mb-8">
					<h1 className="text-3xl font-bold tracking-tight">{item.displayName}</h1>
					<p className="mt-2 text-lg text-muted-foreground">{item.description}</p>
				</div>

				{Demo ? (
					<ComponentPreview code={item.examples[0]?.code ?? ""}>
						<Demo />
					</ComponentPreview>
				) : null}

				<Section id="installation" title="Installation">
					<CodeBlock label={INSTALL_COMMAND_LABEL} code={installCommand(item.name)} />
				</Section>

				<Section id="usage" title="Usage">
					<CodeBlock code={usageCode(item)} />
				</Section>

				{item.examples.slice(1).map((example) => (
					<Section key={example.title} id={slugify(example.title)} title={example.title}>
						<p className="mb-4 text-sm text-muted-foreground">{example.description}</p>
						<CodeBlock code={example.code} />
					</Section>
				))}

				<Section id="api-reference" title="API Reference">
					<PropsTable props={item.props} />
				</Section>

				<Section id="ai-guidance" title="AI Guidance">
					<AIGuidance ai={item.ai} />
				</Section>
			</article>
			<OnThisPage sections={sections} />
		</div>
	);
}

/** A scroll-targeted section heading + content wrapper. */
function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
	return (
		<section id={id} className="mt-10 scroll-mt-20">
			<h2 className="mb-4 text-xl font-semibold">{title}</h2>
			{children}
		</section>
	);
}

/** Renders the `ai` hint block from a registry item. */
function AIGuidance({ ai }: { ai: RegistryItem["ai"] }) {
	return (
		<div className="space-y-4 text-sm">
			<div>
				<h3 className="mb-1 font-semibold">When to use</h3>
				<p className="text-muted-foreground">{ai.whenToUse}</p>
			</div>
			<div>
				<h3 className="mb-1 font-semibold">When not to use</h3>
				<p className="text-muted-foreground">{ai.whenNotToUse}</p>
			</div>
			{ai.commonMistakes.length > 0 && (
				<div>
					<h3 className="mb-1 font-semibold">Common mistakes</h3>
					<ul className="list-disc space-y-1 pl-5 text-muted-foreground">
						{ai.commonMistakes.map((m) => (
							<li key={m}>{m}</li>
						))}
					</ul>
				</div>
			)}
			<div>
				<h3 className="mb-1 font-semibold">Accessibility</h3>
				<p className="text-muted-foreground">{ai.accessibilityNotes}</p>
			</div>
			{ai.relatedComponents.length > 0 && (
				<div>
					<h3 className="mb-1 font-semibold">Related components</h3>
					<ul className="flex flex-wrap gap-2">
						{ai.relatedComponents.map((name) => (
							<li key={name}>
								<Link
									href={`/docs/components/${name}`}
									className="rounded-md border px-2 py-1 text-xs text-foreground transition-colors hover:bg-accent"
								>
									{name}
								</Link>
							</li>
						))}
					</ul>
				</div>
			)}
			<p className="text-xs text-muted-foreground">
				Token budget: <code className="rounded bg-muted px-1 py-0.5">{ai.tokenBudget}</code>
			</p>
		</div>
	);
}
