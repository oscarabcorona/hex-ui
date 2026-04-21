import { CodeBlock } from "../../../components/code-block";
import { DocSection, InlineCode } from "../../../components/doc-section";
import { DocsPage } from "../../../components/docs-page";

export const metadata = {
	title: "Theming",
	description: "HSL design tokens, dark mode, and how to customize them.",
};

const SECTIONS = [
	{ id: "tokens", title: "Design tokens" },
	{ id: "dark-mode", title: "Dark mode" },
	{ id: "custom-palette", title: "Custom palette" },
	{ id: "typography", title: "Typography scale" },
];

const TOKENS_SNIPPET = `@theme {
  --color-background: hsl(0 0% 100%);
  --color-foreground: hsl(240 10% 3.9%);
  --color-card: hsl(0 0% 100%);
  --color-card-foreground: hsl(240 10% 3.9%);
  --color-primary: hsl(240 5.9% 10%);
  --color-primary-foreground: hsl(0 0% 98%);
  --color-muted: hsl(240 4.8% 95.9%);
  --color-muted-foreground: hsl(240 3.8% 46.1%);
  --color-accent: hsl(240 4.8% 95.9%);
  --color-accent-foreground: hsl(240 5.9% 10%);
  --color-destructive: hsl(0 84.2% 60.2%);
  --color-destructive-foreground: hsl(0 0% 98%);
  --color-border: hsl(240 5.9% 90%);
  --color-input: hsl(240 5.9% 90%);
  --color-ring: hsl(240 5.9% 10%);
}`;

const DARK_SNIPPET = `@custom-variant dark (&:is(.dark *));

.dark {
  --color-background: hsl(240 10% 3.9%);
  --color-foreground: hsl(0 0% 98%);
  --color-muted: hsl(240 3.7% 15.9%);
  --color-muted-foreground: hsl(240 5% 70%);
  --color-border: hsl(240 3.7% 15.9%);
  --color-ring: hsl(240 4.9% 83.9%);
}`;

const CUSTOM_PALETTE_SNIPPET = `/* Violet-tinted primary */
@theme {
  --color-primary: hsl(258 90% 66%);
  --color-primary-foreground: hsl(0 0% 100%);
  --color-ring: hsl(258 90% 66%);
}
.dark {
  --color-primary: hsl(258 90% 76%);
  --color-primary-foreground: hsl(240 10% 3.9%);
}`;

/** Theming guide — tokens, dark mode, customization recipes. */
export default function ThemingPage() {
	return (
		<DocsPage
			pathname="/docs/theming"
			title="Theming"
			description="Hex UI ships with an HSL token palette that flips cleanly between light and dark. Every token is a CSS custom property you can override."
			sections={SECTIONS}
		>
			<DocSection id="tokens" title="Design tokens">
				<p className="text-sm leading-6">
					Colors are authored in HSL so that opacity modifiers and contrast tweaks stay
					predictable. Every token has a semantic pair — e.g.{" "}
					<InlineCode>--color-primary</InlineCode> /{" "}
					<InlineCode>--color-primary-foreground</InlineCode>.
				</p>
				<CodeBlock label="css" code={TOKENS_SNIPPET} />
			</DocSection>

			<DocSection id="dark-mode" title="Dark mode">
				<p className="text-sm leading-6">
					Dark mode is driven by <InlineCode>next-themes</InlineCode> toggling a{" "}
					<InlineCode>.dark</InlineCode> class on <InlineCode>&lt;html&gt;</InlineCode>.
					Override tokens inside a <InlineCode>.dark &#123; … &#125;</InlineCode> block.
				</p>
				<CodeBlock label="css" code={DARK_SNIPPET} />
			</DocSection>

			<DocSection id="custom-palette" title="Custom palette">
				<p className="text-sm leading-6">
					Brand the library by swapping the neutral palette for your own hues. Keep the
					token names — all components read these semantics.
				</p>
				<CodeBlock label="css" code={CUSTOM_PALETTE_SNIPPET} />
			</DocSection>

			<DocSection id="typography" title="Typography scale">
				<p className="text-sm leading-6">
					The docs site ships a tuned type scale — <InlineCode>--text-2xs</InlineCode>{" "}
					through <InlineCode>--text-5xl</InlineCode> with matching line heights. See{" "}
					<InlineCode>globals.css</InlineCode> for the full list.
				</p>
			</DocSection>
		</DocsPage>
	);
}
