import * as fs from "node:fs";
import * as path from "node:path";
import { toNativeSlug } from "@hex-core/registry";
import { detectFramework, type PlatformKind } from "./detect-framework.js";

/**
 * Decide which render target a command should install for, and map a typed
 * slug onto the item that actually serves it.
 *
 * A React Native project holds only one platform, so a user there types
 * `hex add button` and means `native-button`. Resolution order:
 *
 *   1. an explicit `--platform` flag,
 *   2. `platform` recorded in `hex.config.json` by `hex init`,
 *   3. framework detection (an Expo or React Native app is native).
 */

/** Where the resolved platform came from, for the CLI's diagnostic line. */
export type PlatformSource = "flag" | "config" | "detected";

export interface ResolvedPlatform {
	platform: PlatformKind;
	source: PlatformSource;
	/** Framework label, for the "Detected: X" line. */
	label: string;
}

/**
 * Read the `platform` field `hex init` writes into `hex.config.json`.
 * @param cwd - Project root
 * @returns The recorded platform, or null when absent or unreadable
 */
function platformFromConfig(cwd: string): PlatformKind | null {
	const configPath = path.join(cwd, "hex.config.json");
	if (!fs.existsSync(configPath)) return null;
	try {
		const raw: unknown = JSON.parse(fs.readFileSync(configPath, "utf-8"));
		if (typeof raw !== "object" || raw === null || !("platform" in raw)) return null;
		const { platform } = raw;
		return platform === "native" || platform === "web" ? platform : null;
	} catch {
		return null;
	}
}

/**
 * Resolve the platform for the project at `cwd`.
 * @param cwd - Project root
 * @param flag - An explicit `--platform` value, when the user passed one
 * @returns The platform, where it came from, and the framework label
 */
export function resolvePlatform(cwd: string, flag?: PlatformKind): ResolvedPlatform {
	const detection = detectFramework(cwd);
	if (flag) return { platform: flag, source: "flag", label: detection.label };

	const configured = platformFromConfig(cwd);
	if (configured) return { platform: configured, source: "config", label: detection.label };

	return { platform: detection.platform, source: "detected", label: detection.label };
}

/**
 * Map a user-typed slug onto the registry item for a platform.
 *
 * On web, and for a slug that already names a native item, this is the
 * identity. On native it adds the `native-` prefix — but only when that item
 * exists, so `hex add data-table` on an Expo project still reports the real
 * "not found" for a component with no native port rather than a confusing
 * "native-data-table not found".
 * @param slug - What the user typed
 * @param platform - The resolved render target
 * @param itemExists - Whether a given item name is in the registry
 * @returns The slug to install, and whether it was rewritten
 */
export function resolveSlugForPlatform(
	slug: string,
	platform: PlatformKind,
	itemExists: (name: string) => boolean,
): { slug: string; rewritten: boolean } {
	if (platform !== "native") return { slug, rewritten: false };
	if (slug.startsWith("native-")) return { slug, rewritten: false };

	const native = toNativeSlug(slug);
	if (itemExists(native)) return { slug: native, rewritten: true };
	return { slug, rewritten: false };
}
