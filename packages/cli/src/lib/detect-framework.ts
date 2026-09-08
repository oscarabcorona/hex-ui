import * as fs from "node:fs";
import * as path from "node:path";

/** Frameworks `hex migrate` v1 recognizes. `unknown` proceeds with sane defaults
 * — the migrator can still file-replace if alias resolution works. */
export type FrameworkKind =
	| "next-app"
	| "next-pages"
	| "vite"
	| "cra"
	| "craco"
	| "expo-router"
	| "expo"
	| "react-native"
	| "unknown";

/**
 * Which renderer the project targets. Mirrors the `platform` field on
 * registry items: a React Native project installs `native-*` items, a web
 * project installs the unprefixed ones.
 */
export type PlatformKind = "web" | "native";

export interface FrameworkDetection {
	kind: FrameworkKind;
	/** Render target implied by `kind`. */
	platform: PlatformKind;
	/** True when source lives under `<cwd>/src/` (Next.js `--src-dir`, Vite, CRA, CRACO). */
	srcDir: boolean;
	/** Cwd-relative path of the file the user should mount `<Toaster />` in. */
	entryHint: string;
	/** Human-readable label for the report header (e.g. "Next.js App Router (src/)"). */
	label: string;
}

interface PackageJson {
	dependencies?: Record<string, string>;
	devDependencies?: Record<string, string>;
}

/**
 * Read + parse `package.json` at `cwd`. Returns null on missing or invalid file.
 * @param cwd - Project root.
 * @returns Parsed package.json or null on any read/parse error.
 */
function readPackageJson(cwd: string): PackageJson | null {
	const file = path.join(cwd, "package.json");
	if (!fs.existsSync(file)) return null;
	try {
		return JSON.parse(fs.readFileSync(file, "utf-8")) as PackageJson;
	} catch {
		return null;
	}
}

/**
 * Test whether a dep is declared in either `dependencies` or `devDependencies`.
 * @param pkg - Parsed package.json.
 * @param name - Exact package name to look up.
 * @returns True when the spec is present in either bucket.
 */
function hasDep(pkg: PackageJson, name: string): boolean {
	return Boolean(pkg.dependencies?.[name] ?? pkg.devDependencies?.[name]);
}

/**
 * Filesystem existence check rooted at `cwd`. Variadic segments are joined
 * before the existsSync call so callers can write `exists(cwd, "src", "app")`
 * without manually composing the path.
 * @param cwd - Project root.
 * @param segments - Path segments joined onto `cwd`.
 * @returns True when the resolved path exists on disk.
 */
function exists(cwd: string, ...segments: string[]): boolean {
	return fs.existsSync(path.join(cwd, ...segments));
}

/**
 * Detect the host framework by inspecting `package.json` deps and the project
 * directory layout. Used by `hex migrate` to (a) emit a framework-aware
 * Toaster mount hint in the report and (b) print a "Detected: X" diagnostic.
 *
 * Detection precedence: Expo / React Native (checked first — an Expo app also
 * declares `react-native`, and a React Native app can carry a `metro.config`
 * that would otherwise look like nothing else) → Next.js (App vs Pages by
 * which dir exists) → CRACO (wraps CRA, so check before CRA) → CRA → Vite →
 * unknown. The directory checks honor both top-level (`app/`, `pages/`) and
 * `src/` layouts.
 */
export function detectFramework(cwd: string): FrameworkDetection {
	const pkg = readPackageJson(cwd);
	const srcDir =
		exists(cwd, "src", "app") ||
		exists(cwd, "src", "components") ||
		exists(cwd, "src", "pages") ||
		exists(cwd, "src", "main.tsx") ||
		exists(cwd, "src", "main.jsx") ||
		exists(cwd, "src", "index.tsx") ||
		exists(cwd, "src", "index.jsx");

	// A web framework outranks an *ambiguous* React Native signal. `react-native`
	// appears in plenty of web projects, because `react-native-web` pulls it —
	// and keying off its presence alone scaffolded Metro and Babel configs into
	// Next.js apps and pinned them to `platform: "native"`, after which every
	// `hex add` refused the web components they actually wanted.
	//
	// This gate deliberately does not cover `expo` / `expo-router`. Nothing on
	// the web ships those, so they are unambiguous even alongside a `next`
	// dependency — an Expo Router app has an `app/` directory and may well
	// carry Next.js in a shared package.json. Gating them here made
	// `detectFramework` report `next-app` for a real Expo Router project.
	const webFramework =
		pkg !== null &&
		(hasDep(pkg, "next") ||
			hasDep(pkg, "vite") ||
			hasDep(pkg, "react-scripts") ||
			hasDep(pkg, "@craco/craco") ||
			hasDep(pkg, "@remix-run/react") ||
			hasDep(pkg, "astro"));
	const webConfigOnDisk =
		exists(cwd, "next.config.ts") ||
		exists(cwd, "next.config.js") ||
		exists(cwd, "next.config.mjs") ||
		exists(cwd, "vite.config.ts") ||
		exists(cwd, "vite.config.js") ||
		exists(cwd, "astro.config.mjs");
	const nativeAllowed = !webFramework && !webConfigOnDisk;

	// Among native shapes, Expo comes first: an Expo app declares both `expo`
	// and `react-native`, and an Expo Router app has an `app/` directory the
	// Next.js branch would otherwise claim.
	if (pkg && hasDep(pkg, "expo")) {
		const routerAt = exists(cwd, "src", "app") ? "src/app" : exists(cwd, "app") ? "app" : null;
		if (hasDep(pkg, "expo-router") && routerAt) {
			return {
				kind: "expo-router",
				platform: "native",
				srcDir: routerAt.startsWith("src/"),
				entryHint: `${routerAt}/_layout.tsx`,
				label: `Expo (expo-router${routerAt.startsWith("src/") ? ", src/" : ""})`,
			};
		}
		return {
			kind: "expo",
			platform: "native",
			srcDir,
			entryHint: exists(cwd, "App.tsx") ? "App.tsx" : "App.js",
			label: "Expo",
		};
	}

	if (nativeAllowed && pkg && hasDep(pkg, "react-native")) {
		return {
			kind: "react-native",
			platform: "native",
			srcDir,
			entryHint: exists(cwd, "App.tsx") ? "App.tsx" : "App.js",
			label: "React Native (bare)",
		};
	}

	if (pkg && hasDep(pkg, "next")) {
		const appAt = exists(cwd, "src", "app") ? "src/app" : exists(cwd, "app") ? "app" : null;
		const pagesAt = exists(cwd, "src", "pages") ? "src/pages" : exists(cwd, "pages") ? "pages" : null;
		// App and Pages can coexist during a migration. Prefer App since that's
		// the long-term target — its layout.tsx is the canonical Toaster mount.
		if (appAt) {
			return {
				kind: "next-app",
				platform: "web",
				srcDir: appAt.startsWith("src/"),
				entryHint: `${appAt}/layout.tsx`,
				label: `Next.js App Router${appAt.startsWith("src/") ? " (src/)" : ""}`,
			};
		}
		if (pagesAt) {
			return {
				kind: "next-pages",
				platform: "web",
				srcDir: pagesAt.startsWith("src/"),
				entryHint: `${pagesAt}/_app.tsx`,
				label: `Next.js Pages Router${pagesAt.startsWith("src/") ? " (src/)" : ""}`,
			};
		}
		// `next` declared but no app/ or pages/ on disk yet — likely a fresh
		// install. Default to App Router (current Next.js default).
		return {
			platform: "web",
			kind: "next-app",
			srcDir,
			entryHint: srcDir ? "src/app/layout.tsx" : "app/layout.tsx",
			label: "Next.js (no app/ or pages/ detected — assumed App Router)",
		};
	}

	if (pkg && hasDep(pkg, "@craco/craco")) {
		return {
			platform: "web",
			kind: "craco",
			srcDir: true,
			entryHint: "src/index.tsx",
			label: "CRACO",
		};
	}

	if (pkg && hasDep(pkg, "react-scripts")) {
		return {
			platform: "web",
			kind: "cra",
			srcDir: true,
			entryHint: "src/index.tsx",
			label: "Create React App",
		};
	}

	if (pkg && (hasDep(pkg, "vite") || exists(cwd, "vite.config.ts") || exists(cwd, "vite.config.js"))) {
		return {
			platform: "web",
			kind: "vite",
			srcDir: true,
			entryHint: exists(cwd, "src", "main.tsx") ? "src/main.tsx" : "src/main.jsx",
			label: "Vite + React",
		};
	}

	return {
		kind: "unknown",
		platform: "web",
		srcDir,
		entryHint: srcDir ? "src/index.tsx" : "index.tsx",
		label: "Unknown framework",
	};
}
