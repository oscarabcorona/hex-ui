import type { Metadata } from "next";
import Link from "next/link";
import {
	CATEGORY_LABELS,
	CATEGORY_ORDER,
	componentsByCategory,
	listNativeComponents,
} from "../../lib/registry";

export const metadata: Metadata = {
	title: "React Native",
	description:
		"Hex Core components for React Native — the same schemas, tokens and AI guidance, rendered with NativeWind and @rn-primitives.",
};

/**
 * Index of the React Native catalog, grouped by category.
 * @returns The rendered page
 */
export default function Page() {
	const items = listNativeComponents();
	const groups = componentsByCategory(items);

	return (
		<article className="mx-auto flex w-full max-w-3xl flex-col gap-8 py-10">
			<header className="flex flex-col gap-3">
				<h1 className="text-3xl font-semibold tracking-tight">React Native</h1>
				<p className="text-muted-foreground">
					{items.length} components for Expo and React Native, built on NativeWind and{" "}
					<code>@rn-primitives</code>. They carry the same machine-readable schemas as the web
					catalog, so an agent gets the same guidance on either platform.
				</p>
				<p className="text-sm text-muted-foreground">
					Start with <code>hex init --platform native</code>. After that,{" "}
					<code>hex add button</code> installs the native item automatically.
				</p>
			</header>

			{CATEGORY_ORDER.map((category) => {
				const inCategory = groups[category] ?? [];
				if (inCategory.length === 0) return null;
				return (
					<section key={category} className="flex flex-col gap-3">
						<h2 className="text-xl font-semibold tracking-tight">
							{CATEGORY_LABELS[category] ?? category}
						</h2>
						<ul className="grid gap-2 sm:grid-cols-2">
							{inCategory.map((item) => (
								<li key={item.name}>
									<Link
										href={`/native/${item.name}`}
										className="flex flex-col gap-1 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
									>
										<span className="font-medium">{item.displayName}</span>
										<span className="line-clamp-2 text-sm text-muted-foreground">
											{item.description}
										</span>
									</Link>
								</li>
							))}
						</ul>
					</section>
				);
			})}
		</article>
	);
}
