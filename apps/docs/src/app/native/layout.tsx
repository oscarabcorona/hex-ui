import { DocsShell } from "../../components/docs-shell";

/**
 * React Native section layout.
 *
 * Shares the docs chrome so `/native` is not a bare page floating outside the
 * site: the sidebar switches to the native catalog on these routes, which is
 * what makes the 26 items reachable without going through the registry JSON.
 * @param props - Layout props
 * @param props.children - The routed page
 * @returns The section wrapped in the docs shell
 */
export default function NativeLayout({ children }: { children: React.ReactNode }) {
	return <DocsShell>{children}</DocsShell>;
}
