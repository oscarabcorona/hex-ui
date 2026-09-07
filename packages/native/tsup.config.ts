import * as path from "node:path";
import fg from "fast-glob";
import { defineConfig } from "tsup";

/**
 * One entry per component, mirroring `@hex-core/components`.
 *
 * `import { Button } from "@hex-core/native"` works through the barrel;
 * `import { Button } from "@hex-core/native/button"` is the tree-shake-
 * friendly deep import. Demos, tests and schemas stay out of the runtime
 * tarball — schemas ship through the separate `./schemas` entry.
 */
const entryFiles = fg.sync(
	[
		"src/index.ts",
		"src/schemas.ts",
		"src/primitives/*/*.tsx",
		"src/components/*/*.tsx",
		"src/ai/*/*.tsx",
		"src/lib/*.ts",
		"src/lib/*.tsx",
	],
	{
		ignore: ["**/*.test.tsx", "**/*.test.ts", "**/*.schema.ts", "**/*.demo.tsx", "**/*.d.ts"],
		cwd: path.resolve(__dirname),
		absolute: false,
	},
);

const entry = Object.fromEntries(
	entryFiles.map((relPath) => [path.basename(relPath, path.extname(relPath)), relPath]),
);

export default defineConfig({
	entry,
	format: ["esm"],
	dts: true,
	clean: true,
	sourcemap: true,
	// Self-contained modules, same reasoning as the web package: no shared
	// chunks means each deep import pulls exactly its own component.
	splitting: false,
	treeshake: true,
	esbuildOptions(options) {
		// The whole point of the package: `className` on a React Native
		// element only becomes a style because NativeWind's JSX runtime
		// intercepts element creation. Compile JSX against that runtime so
		// the published dist styles itself without the consumer's Babel
		// config having to re-transform node_modules.
		options.jsx = "automatic";
		options.jsxImportSource = "nativewind";
	},
	external: [
		"react",
		"react-native",
		"nativewind",
		"react-native-css-interop",
		/^@rn-primitives\//,
		"class-variance-authority",
		"clsx",
		"tailwind-merge",
		"@hex-core/registry",
	],
	// The schema entry derives from the web schemas. Inline that data so
	// `@hex-core/components` (React DOM, Radix, 27 peer deps) never becomes
	// a runtime dependency of a React Native app.
	noExternal: ["@hex-core/components"],
});
