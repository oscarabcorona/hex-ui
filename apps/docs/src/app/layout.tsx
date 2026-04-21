import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "../components/theme-provider";
import { listComponents } from "../lib/registry";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://hex-ui.dev";
const siteTitle = "Hex UI — AI-Native Component Library";
const componentCount = listComponents().length;
const siteDescription = `Component library designed for LLMs and humans. MCP-first distribution, Radix UI + Tailwind CSS, ${componentCount} polished primitives and compounds.`;

export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
	title: {
		default: siteTitle,
		template: "%s — Hex UI",
	},
	description: siteDescription,
	applicationName: "Hex UI",
	authors: [{ name: "Hex UI" }],
	keywords: [
		"hex ui",
		"component library",
		"mcp",
		"ai-native",
		"react components",
		"radix ui",
		"tailwind css",
	],
	openGraph: {
		type: "website",
		url: siteUrl,
		siteName: "Hex UI",
		title: siteTitle,
		description: siteDescription,
		locale: "en_US",
	},
	twitter: {
		card: "summary_large_image",
		title: siteTitle,
		description: siteDescription,
		images: ["/opengraph-image"],
	},
	alternates: {
		canonical: siteUrl,
	},
};

/**
 * Root layout — HTML shell, fonts, ThemeProvider. All visual chrome (header,
 * sidebar) lives in nested layouts (see app/docs/layout.tsx).
 */
export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			style={{ colorScheme: "light dark" }}
			suppressHydrationWarning
		>
			<body className="min-h-screen bg-background font-sans">
				{/* ThemeProvider wraps <body> (not <html>) so the root layout stays a Server Component. next-themes targets document.documentElement directly via its inline script. */}
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					enableColorScheme
					disableTransitionOnChange
					storageKey="hex-ui-theme"
				>
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
