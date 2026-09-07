/**
 * `jsxImportSource: "nativewind"` is what turns `className` on a React
 * Native element into a style. Without it every component in
 * `@hex-core/native` renders unstyled.
 * @param {{ cache: (enabled: boolean) => void }} api - Babel's config API
 * @returns {object} The Babel configuration
 */
module.exports = function babelConfig(api) {
	api.cache(true);
	return {
		presets: [
			["babel-preset-expo", { jsxImportSource: "nativewind" }],
			"nativewind/babel",
		],
	};
};
