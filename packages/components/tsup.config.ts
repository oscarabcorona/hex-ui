import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts"],
	format: ["esm"],
	dts: true,
	clean: true,
	sourcemap: true,
	// Components use React context, state, and Radix — all client-side.
	// Prepend "use client" so the bundle is tagged as a client module when
	// consumed from a Next.js app, even after tsup merges the sources.
	banner: { js: '"use client";' },
	external: [
		"react",
		"react-dom",
		"react-hook-form",
		"@hookform/resolvers",
		"zod",
		"@tanstack/react-table",
		"sonner",
		/^@radix-ui\//,
		"class-variance-authority",
		"clsx",
		"tailwind-merge",
	],
});
