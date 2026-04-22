"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

type ThemeUi = "light" | "dark" | "loading";

/** Always-true subscription — only runs on the client, so serves as a hydration gate. */
const subscribeMount = () => () => {};
const getMountedClient = () => true;
const getMountedServer = () => false;

/**
 * Headless hook: reads next-themes' `resolvedTheme` and guards on client
 * mount via `useSyncExternalStore`. Returns `"loading"` on SSR + first client
 * render so the button can paint a stable neutral shell and never triggers a
 * hydration mismatch on `aria-label` / icon content.
 */
function useThemeToggle() {
	const { resolvedTheme, setTheme } = useTheme();
	const mounted = useSyncExternalStore(subscribeMount, getMountedClient, getMountedServer);

	const ui: ThemeUi = !mounted ? "loading" : resolvedTheme === "dark" ? "dark" : "light";
	const toggle = () => setTheme(ui === "dark" ? "light" : "dark");

	return { ui, toggle };
}

/**
 * Theme toggle button — cycles light/dark via next-themes. Server render is
 * a neutral mount-aware shell; real state lands after hydration to avoid any
 * aria-label / icon mismatch between server HTML and next-themes' inline
 * script.
 */
export function ThemeToggle() {
	const { ui, toggle } = useThemeToggle();
	const label =
		ui === "loading"
			? "Toggle theme"
			: ui === "dark"
				? "Switch to light theme"
				: "Switch to dark theme";

	return (
		<button
			type="button"
			onClick={toggle}
			aria-label={label}
			suppressHydrationWarning
			className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-all duration-200 ease-out hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
		>
			<span
				suppressHydrationWarning
				className="inline-flex h-4 w-4 items-center justify-center"
			>
				<ThemeIcon ui={ui} />
			</span>
		</button>
	);
}

/** Renders the sun, moon, or a neutral placeholder based on mount-aware state. */
function ThemeIcon({ ui }: { ui: ThemeUi }) {
	if (ui === "loading") {
		return <span className="block h-4 w-4" aria-hidden="true" />;
	}
	if (ui === "dark") {
		return (
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
				<circle cx="12" cy="12" r="4" />
				<path d="M12 2v2" />
				<path d="M12 20v2" />
				<path d="m4.93 4.93 1.41 1.41" />
				<path d="m17.66 17.66 1.41 1.41" />
				<path d="M2 12h2" />
				<path d="M20 12h2" />
				<path d="m6.34 17.66-1.41 1.41" />
				<path d="m19.07 4.93-1.41 1.41" />
			</svg>
		);
	}
	return (
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
			<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
		</svg>
	);
}
