import Image from "next/image";

/**
 * Light and dark screenshots of a React Native component, captured from the
 * Expo playground by `scripts/native-screens.ts`.
 *
 * The docs site cannot render a React Native component: `react-native-web`
 * inside the app's Turbopack build is a large integration with its own
 * NativeWind story, and it would put a second renderer in the bundle for
 * every reader of every page. A pair of committed screenshots shows the same
 * thing at a fraction of the cost, and doubles as the visual baseline — a
 * change to a native component shows up as an image diff in review.
 * @param props - The item slug and its display name
 * @returns The screenshot pair, or a note when none have been captured
 */
export function NativePreview({ slug, displayName }: { slug: string; displayName: string }) {
	return (
		<div className="grid gap-4 sm:grid-cols-2">
			{(["light", "dark"] as const).map((scheme) => (
				<figure key={scheme} className="flex flex-col gap-2">
					<div className="overflow-hidden rounded-lg border border-border bg-muted/30">
						{/* Unoptimized: these are already device-sized PNGs committed to
						    the repo, and the static export has no image server. */}
						<Image
							src={`/native/${slug}.${scheme}.png`}
							alt={`${displayName} rendered on iOS in ${scheme} mode`}
							width={390}
							height={422}
							unoptimized
							className="h-auto w-full"
						/>
					</div>
					<figcaption className="text-xs text-muted-foreground capitalize">{scheme}</figcaption>
				</figure>
			))}
		</div>
	);
}
