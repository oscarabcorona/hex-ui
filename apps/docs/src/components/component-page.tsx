"use client";

import { ComponentPreview } from "./component-preview";
import { OnThisPage } from "./on-this-page";

interface PropDef {
	name: string;
	type: string;
	default?: string;
	description: string;
}

export function ComponentPage({
	name,
	description,
	preview,
	previewCode,
	installCommand,
	usageCode,
	props,
	examples,
}: {
	name: string;
	description: string;
	preview: React.ReactNode;
	previewCode: string;
	installCommand: string;
	usageCode: string;
	props: PropDef[];
	examples?: { title: string; preview: React.ReactNode; code: string }[];
}) {
	const sections = [
		{ id: "installation", title: "Installation" },
		{ id: "usage", title: "Usage" },
		...(examples?.map((e) => ({ id: e.title.toLowerCase().replace(/\s+/g, "-"), title: e.title })) ?? []),
		{ id: "api-reference", title: "API Reference" },
	];

	return (
		<div className="flex">
			<article className="flex-1 px-8 py-6">
				<div className="mb-8">
					<h1 className="text-3xl font-bold tracking-tight">{name}</h1>
					<p className="mt-2 text-lg text-muted-foreground">{description}</p>
				</div>

				<ComponentPreview code={previewCode}>{preview}</ComponentPreview>

				<section id="installation" className="mt-10 scroll-mt-20">
					<h2 className="text-xl font-semibold mb-4">Installation</h2>
					<div className="rounded-lg border">
						<div className="flex items-center border-b bg-muted/50 px-4 py-2">
							<span className="text-xs font-medium text-muted-foreground">pnpm</span>
						</div>
						<pre className="overflow-x-auto p-4 text-sm">
							<code>{installCommand}</code>
						</pre>
					</div>
				</section>

				<section id="usage" className="mt-10 scroll-mt-20">
					<h2 className="text-xl font-semibold mb-4">Usage</h2>
					<pre className="overflow-x-auto rounded-lg border p-4 text-sm">
						<code>{usageCode}</code>
					</pre>
				</section>

				{examples?.map((example) => (
					<section
						key={example.title}
						id={example.title.toLowerCase().replace(/\s+/g, "-")}
						className="mt-10 scroll-mt-20"
					>
						<h2 className="text-xl font-semibold mb-4">{example.title}</h2>
						<ComponentPreview code={example.code}>{example.preview}</ComponentPreview>
					</section>
				))}

				<section id="api-reference" className="mt-10 scroll-mt-20">
					<h2 className="text-xl font-semibold mb-4">API Reference</h2>
					<div className="overflow-x-auto rounded-lg border">
						<table className="w-full text-sm">
							<thead>
								<tr className="border-b bg-muted/50">
									<th className="px-4 py-3 text-left font-medium">Prop</th>
									<th className="px-4 py-3 text-left font-medium">Type</th>
									<th className="px-4 py-3 text-left font-medium">Default</th>
									<th className="px-4 py-3 text-left font-medium">Description</th>
								</tr>
							</thead>
							<tbody>
								{props.map((prop) => (
									<tr key={prop.name} className="border-b last:border-0">
										<td className="px-4 py-3">
											<code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
												{prop.name}
											</code>
										</td>
										<td className="px-4 py-3">
											<code className="text-xs text-muted-foreground">{prop.type}</code>
										</td>
										<td className="px-4 py-3 text-muted-foreground">
											{prop.default ?? "—"}
										</td>
										<td className="px-4 py-3 text-muted-foreground">{prop.description}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</section>
			</article>
			<OnThisPage sections={sections} />
		</div>
	);
}
