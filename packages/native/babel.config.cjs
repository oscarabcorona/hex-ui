/**
 * Used only by Jest. Published output is built by tsup/esbuild (see
 * tsup.config.ts), and consumers' Metro builds bring their own Babel
 * config with `jsxImportSource: "nativewind"`.
 */
module.exports = {
	presets: ["module:@react-native/babel-preset"],
};
