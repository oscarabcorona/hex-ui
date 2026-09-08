import * as fs from "node:fs";
import * as path from "node:path";
import Image from "next/image";

/** Where `scripts/native-screens.ts` writes its captures. */
const SHOTS_DIR = path.join(process.cwd(), "public", "native");

/**
 * Whether both schemes have been captured for a slug.
 *
 * A Server Component, so this runs at build time against the committed
 * files. Without it the page rendered two broken-image boxes whenever the
 * screenshots had not been taken — which is every slug until someone runs
 * the capture script on a machine with a simulator.
 * @param slug - The native item name, e.g. `native-button`
 * @returns True when the light and dark PNGs both exist
 */
function hasScreenshots(slug: string): boolean {
	return (["light", "dark"] as const).every((scheme) =>
		fs.existsSync(path.join(SHOTS_DIR, `${slug}.${scheme}.png`)),
	);
}

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
 * @param props.slug - The native item name, e.g. `native-button`
 * @param props.displayName - Human-readable name, used in the alt text
 * @returns The screenshot pair, or a note when none have been captured
 */
export function NativePreview({ slug, displayName }: { slug: string; displayName: string }) {
	if (!hasScreenshots(slug)) {
		return (
			<div className="rounded-lg border border-dashed border-border bg-muted/30 p-6 text-sm text-muted-foreground">
				<p className="font-medium text-foreground">No screenshots captured yet</p>
				<p className="mt-1">
					{displayName} renders on a device, not in a browser. Capture the pair with{" "}
					<code>pnpm run native:screens {slug.replace(/^native-/, "")}</code> on a machine with a
					booted iOS simulator, or run the component yourself in the Expo playground.
				</p>
			</div>
		);
	}

	return (
		<div className="grid gap-4 sm:grid-cols-2">
			{(["light", "dark"] as const).map((scheme) => (
				<figure key={scheme} className="flex flex-col gap-2">
					{/*
					 * The aspect ratio is set on the container rather than
					 * inferred from the width/height below. `simctl io
					 * screenshot` writes device-pixel PNGs whose real
					 * dimensions vary by simulator, so hardcoded intrinsic
					 * numbers shifted the page on image load.
					 */}
					<div className="aspect-[390/844] overflow-hidden rounded-lg border border-border bg-muted/30">
						{/* Unoptimized: these are already device-sized PNGs committed to
						    the repo, and the static export has no image server. */}
						<Image
							src={`/native/${slug}.${scheme}.png`}
							alt={`${displayName} rendered on iOS in ${scheme} mode`}
							width={390}
							height={844}
							unoptimized
							className="h-full w-full object-cover object-top"
						/>
					</div>
					<figcaption className="text-xs text-muted-foreground capitalize">{scheme}</figcaption>
				</figure>
			))}
		</div>
	);
}
