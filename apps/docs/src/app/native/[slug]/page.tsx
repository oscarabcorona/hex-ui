import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NativePreview } from "../../../components/native-preview";
import { PropsTable } from "../../../components/props-table";
import { CodeBlock } from "../../../components/code-block";
import {
	INSTALL_COMMAND_LABEL,
	installCommand,
	listComponents,
	listNativeComponents,
	nativeDisplaySlug,
} from "../../../lib/registry";
import { getRegistryItem } from "../../../lib/registry.server";

/** One static route per React Native item. */
export function generateStaticParams() {
	return listNativeComponents().map((item) => ({ slug: item.name }));
}

/**
 * Per-page metadata derived from the registry.
 * @param params - Route params (async in Next.js 16)
 * @returns The page metadata
 */
export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const item = await getRegistryItem(slug);
	if (!item) return { title: "Not found" };
	const title = `${item.displayName} (React Native)`;
	return {
		title,
		description: item.description,
		openGraph: {
			title: `${title} — Hex Core`,
			description: item.description,
			url: `/native/${slug}`,
			type: "article",
		},
	};
}

/**
 * Documentation for one React Native component.
 *
 * Mirrors the web component page, with two differences the platform forces:
 * the preview is a screenshot pair rather than a live demo, and the page
 * links across to the web counterpart when one exists.
 * @param params - Route params (async in Next.js 16)
 * @returns The rendered page
 */
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const item = await getRegistryItem(slug);
	if (!item || item.platform !== "native") notFound();

	const webSlug = nativeDisplaySlug(item.name);
	const hasWebCounterpart = listComponents().some((entry) => entry.name === webSlug);

	return (
		<article className="mx-auto flex w-full max-w-3xl flex-col gap-10 py-10">
			<header className="flex flex-col gap-3">
				<div className="flex flex-wrap items-center gap-2">
					<h1 className="text-3xl font-semibold tracking-tight">{item.displayName}</h1>
					<span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
						React Native
					</span>
				</div>
				<p className="text-muted-foreground">{item.description}</p>
				{hasWebCounterpart ? (
					<p className="text-sm text-muted-foreground">
						Also available for the web:{" "}
						<Link className="underline underline-offset-4" href={`/docs/components/${webSlug}`}>
							{item.displayName} for React DOM
						</Link>
					</p>
				) : (
					<p className="text-sm text-muted-foreground">
						React Native only — the web catalog solves this with a different component.
					</p>
				)}
			</header>

			<section className="flex flex-col gap-4">
				<h2 className="text-xl font-semibold tracking-tight">Preview</h2>
				<NativePreview slug={item.name} displayName={item.displayName} />
			</section>

			<section className="flex flex-col gap-4">
				<h2 className="text-xl font-semibold tracking-tight">Installation</h2>
				<CodeBlock label={INSTALL_COMMAND_LABEL} code={installCommand(item.name)} />
				<p className="text-sm text-muted-foreground">
					On an Expo or React Native project, <code>hex add {webSlug}</code> resolves to this item
					automatically. Overlay components also need a <code>PortalHost</code> mounted in your root
					layout.
				</p>
			</section>

			{item.examples.length > 0 ? (
				<section className="flex flex-col gap-6">
					<h2 className="text-xl font-semibold tracking-tight">Examples</h2>
					{item.examples.map((example) => (
						<div key={example.title} className="flex flex-col gap-2">
							<h3 className="font-medium">{example.title}</h3>
							<p className="text-sm text-muted-foreground">{example.description}</p>
							<CodeBlock label="tsx" code={example.code} />
						</div>
					))}
				</section>
			) : null}

			<section className="flex flex-col gap-4">
				<h2 className="text-xl font-semibold tracking-tight">API Reference</h2>
				<PropsTable props={item.props} />
			</section>

			<section className="flex flex-col gap-4">
				<h2 className="text-xl font-semibold tracking-tight">AI Guidance</h2>
				<div className="flex flex-col gap-4 text-sm">
					<div>
						<h3 className="mb-1 font-medium">When to use</h3>
						<p className="text-muted-foreground">{item.ai.whenToUse}</p>
					</div>
					<div>
						<h3 className="mb-1 font-medium">When not to use</h3>
						<p className="text-muted-foreground">{item.ai.whenNotToUse}</p>
					</div>
					<div>
						<h3 className="mb-1 font-medium">Common mistakes</h3>
						<ul className="list-disc pl-5 text-muted-foreground">
							{item.ai.commonMistakes.map((mistake) => (
								<li key={mistake}>{mistake}</li>
							))}
						</ul>
					</div>
					<div>
						<h3 className="mb-1 font-medium">Accessibility</h3>
						<p className="text-muted-foreground">{item.ai.accessibilityNotes}</p>
					</div>
				</div>
			</section>
		</article>
	);
}

export const dynamicParams = false;
