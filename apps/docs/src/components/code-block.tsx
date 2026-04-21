import { codeToHtml } from "shiki";
import { CodeBlockCopy } from "./code-block-copy";

type SupportedLang = "bash" | "ts" | "tsx" | "json";

const LABEL_TO_LANG: Record<string, SupportedLang> = {
	pnpm: "bash",
	npm: "bash",
	yarn: "bash",
	bun: "bash",
	bash: "bash",
	sh: "bash",
	shell: "bash",
	ts: "ts",
	typescript: "ts",
	tsx: "tsx",
	json: "json",
};

function resolveLang(label?: string, language?: SupportedLang): SupportedLang {
	if (language) return language;
	if (label && LABEL_TO_LANG[label.toLowerCase()]) return LABEL_TO_LANG[label.toLowerCase()];
	return "tsx";
}

/**
 * Syntax-highlighted code block with a language label header and a copy
 * button. Highlighting is performed server-side by Shiki using a dual-theme
 * (github-light / github-dark) so the same HTML flips with next-themes.
 * @param code - The code to display
 * @param label - Optional language/tool label shown in the header (e.g. "pnpm")
 * @param language - Explicit Shiki grammar key; overrides inference from label
 * @returns A Server Component fragment with the highlighted code + copy button
 */
export async function CodeBlock({
	code,
	label,
	language,
}: {
	code: string;
	label?: string;
	language?: SupportedLang;
}) {
	const lang = resolveLang(label, language);
	const html = await codeToHtml(code, {
		lang,
		themes: { light: "github-light", dark: "github-dark" },
		defaultColor: false,
	});
	const displayLabel = label ?? lang;

	return (
		<div className="group relative overflow-hidden rounded-lg border bg-card">
			<div className="flex items-center justify-between border-b bg-muted/40 px-3 py-1.5">
				<span className="text-xs font-medium text-muted-foreground">{displayLabel}</span>
				<CodeBlockCopy code={code} />
			</div>
			<div
				data-shiki=""
				className="overflow-x-auto p-4 text-sm [&_pre]:!bg-transparent"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki output is trusted server-rendered HTML
				dangerouslySetInnerHTML={{ __html: html }}
			/>
		</div>
	);
}
