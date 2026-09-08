const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("node:path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

// The playground consumes `@hex-core/native` through the workspace link, so
// Metro has to watch the repo root and resolve from both module trees.
// pnpm's store is not flat, so `disableHierarchicalLookup` is deliberately
// left off — Metro still needs to walk up to find hoisted packages.
config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
	path.resolve(projectRoot, "node_modules"),
	path.resolve(workspaceRoot, "node_modules"),
];

// The workspace writes ESM-correct relative imports (`../text/text.js`) that
// point at `.ts(x)` files on disk. tsup and tsc both understand that; Metro
// does not, and the playground consumes `@hex-core/native` as *source* rather
// than as built output. So retry a relative `.js` specifier against the
// TypeScript file it names before failing. A consumer installing the
// published package never hits this — dist is already JavaScript.
const defaultResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
	const resolve = defaultResolveRequest ?? context.resolveRequest;
	if (moduleName.startsWith(".") && moduleName.endsWith(".js")) {
		const withoutExtension = moduleName.slice(0, -".js".length);
		for (const candidate of [`${withoutExtension}.tsx`, `${withoutExtension}.ts`]) {
			try {
				return resolve(context, candidate, platform);
			} catch {
				// Fall through to the next candidate, then to the original.
			}
		}
	}
	return resolve(context, moduleName, platform);
};

module.exports = withNativeWind(config, {
	input: "./global.css",
	// Radii and spacing tokens are declared in rem; React Native has no root
	// font size, so NativeWind needs the multiplier to resolve them.
	inlineRem: 16,
});
