import { PortalHost } from "@rn-primitives/portal";
import { Stack, useGlobalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider, type Scheme } from "../src/theme";
import "../global.css";

/**
 * Root layout.
 *
 * `PortalHost` is mounted once here so overlay components (Dialog, Popover,
 * Select) have somewhere to render above the rest of the tree. The scheme
 * comes from the URL so the screenshot script can deep-link
 * `?scheme=dark` instead of driving a settings toggle.
 *
 * It must be `useGlobalSearchParams`: the local variant only sees the params
 * of the segment that owns them, so on `/component/button?scheme=dark` the
 * root layout would read `undefined` and every dark screenshot would come
 * back light.
 * @returns The app shell
 */
export default function RootLayout() {
	const { scheme } = useGlobalSearchParams<{ scheme?: string }>();
	const resolved: Scheme = scheme === "dark" ? "dark" : "light";

	return (
		<SafeAreaProvider>
			<ThemeProvider scheme={resolved}>
				<StatusBar style={resolved === "dark" ? "light" : "dark"} />
				<Stack
					screenOptions={{
						headerShown: true,
						contentStyle: { backgroundColor: "transparent" },
					}}
				/>
				<PortalHost />
			</ThemeProvider>
		</SafeAreaProvider>
	);
}
