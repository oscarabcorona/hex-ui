"use client";

import { useEffect, useRef, useState } from "react";

type CopyState = "idle" | "copied" | "error";

/**
 * Copy-to-clipboard button for code blocks. Shows a transient "Copied" state
 * for ~2 seconds after a successful copy, or a brief "error" state if the
 * clipboard API is blocked (insecure context, permission policy, etc.).
 */
export function CodeBlockCopy({ code }: { code: string }) {
	const [state, setState] = useState<CopyState>("idle");
	const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		return () => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
		};
	}, []);

	const onCopy = async () => {
		try {
			await navigator.clipboard.writeText(code);
			setState("copied");
		} catch {
			setState("error");
		}
		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(() => setState("idle"), 2000);
	};

	const label =
		state === "copied" ? "Copied" : state === "error" ? "Copy failed" : "Copy code";

	return (
		<button
			type="button"
			onClick={onCopy}
			aria-label={label}
			title={label}
			className="inline-flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-all duration-200 ease-out hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
		>
			{state === "copied" ? (
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 text-foreground" aria-hidden="true">
					<polyline points="20 6 9 17 4 12" />
				</svg>
			) : state === "error" ? (
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 text-destructive" aria-hidden="true">
					<circle cx="12" cy="12" r="10" />
					<line x1="15" y1="9" x2="9" y2="15" />
					<line x1="9" y1="9" x2="15" y2="15" />
				</svg>
			) : (
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5" aria-hidden="true">
					<rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
					<path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
				</svg>
			)}
		</button>
	);
}
