import { defaultTheme, themeToNativeTheme } from "@hex-core/tokens";
import { colorScheme, vars } from "nativewind";
import type { ReactNode } from "react";
import { View } from "react-native";

const NATIVE_THEME = themeToNativeTheme(defaultTheme);

/** The two colour schemes the playground can render. */
export type Scheme = "light" | "dark";

/**
 * Apply a Hex theme to a subtree at runtime.
 *
 * `themeToNativeTheme` hands back one flat `--token → value` map per scheme;
 * NativeWind's `vars()` turns either into a style object, so switching
 * themes is a re-render rather than a rebuild of `global.css`.
 * @param props - The scheme to apply and the subtree to apply it to
 * @returns A View carrying the theme variables
 */
export function ThemeProvider({
	scheme,
	children,
}: {
	scheme: Scheme;
	children: ReactNode;
}) {
	// Keep NativeWind's own `dark:` variant in step with the vars we inject,
	// or `dark:` utilities inside components would disagree with the tokens.
	colorScheme.set(scheme);
	return (
		<View style={vars(NATIVE_THEME[scheme])} className="flex-1 bg-background">
			{children}
		</View>
	);
}
