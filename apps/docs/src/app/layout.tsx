import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { ThemeProvider } from "../components/theme-provider";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Hex UI — AI-Native Component Library",
	description: "Component library designed for LLMs and humans. MCP-first distribution.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html
			lang="en"
			className={`${geistSans.variable} ${geistMono.variable} antialiased`}
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
					<header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
						<div className="mx-auto flex h-14 max-w-7xl items-center px-6">
							<Link href="/" className="flex items-center gap-2">
								<span className="text-lg font-bold tracking-tight">Hex UI</span>
								<span className="rounded-md bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
									v0.1
								</span>
							</Link>
							<nav className="ml-8 flex gap-6 text-sm">
								<Link
									href="/docs/getting-started"
									className="text-muted-foreground transition-colors hover:text-foreground"
								>
									Docs
								</Link>
								<Link
									href="/docs/components/button"
									className="text-muted-foreground transition-colors hover:text-foreground"
								>
									Components
								</Link>
							</nav>
							<div className="ml-auto flex items-center gap-4">
								<a
									href="https://github.com/oscarabcorona/hex-ui"
									className="text-sm text-muted-foreground transition-colors hover:text-foreground"
									target="_blank"
									rel="noopener noreferrer"
								>
									GitHub
								</a>
							</div>
						</div>
					</header>
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
