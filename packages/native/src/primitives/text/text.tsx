import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { Text as RNText } from "react-native";
import { useTextClass } from "../../lib/text-context.js";
import { cn } from "../../lib/utils.js";

/**
 * Typographic scale for native text.
 *
 * Mirrors the web docs' heading and body styles, minus anything that needs a
 * DOM: no `scroll-m-*`, no `text-balance`, no `select-text`.
 */
export const textVariants = cva("text-base text-foreground", {
	variants: {
		variant: {
			default: "",
			h1: "text-4xl font-extrabold tracking-tight",
			h2: "text-3xl font-semibold tracking-tight",
			h3: "text-2xl font-semibold tracking-tight",
			h4: "text-xl font-semibold tracking-tight",
			p: "leading-7",
			lead: "text-xl text-muted-foreground",
			large: "text-lg font-semibold",
			small: "text-sm font-medium leading-none",
			muted: "text-sm text-muted-foreground",
			code: "rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

type TextVariant = NonNullable<VariantProps<typeof textVariants>["variant"]>;

/** Variants that read as headings to VoiceOver and TalkBack. */
const HEADING_VARIANTS: ReadonlySet<TextVariant> = new Set<TextVariant>(["h1", "h2", "h3", "h4"]);

/**
 * Props for {@link Text}. `ref` comes with the React Native `Text` props and
 * reaches the host element (React 19 — no forwardRef).
 */
export type TextProps = ComponentProps<typeof RNText> & VariantProps<typeof textVariants>;

/**
 * Themed text with a typographic scale and parent-driven class inheritance.
 *
 * React Native text does not inherit colour or size from a `View`, so
 * containers like `Button`, `Card` and `Badge` publish the classes they want
 * their labels to carry through `TextClassContext`; this component reads
 * them and lets an explicit `className` win.
 * @param props - {@link TextProps}
 * @returns A React Native `Text` element
 * @example
 * ```tsx
 * <Text variant="h2">Settings</Text>
 * <Text variant="muted">Manage your account preferences.</Text>
 * ```
 */
export function Text({ className, variant = "default", ...props }: TextProps) {
	const inherited = useTextClass();
	const isHeading = variant !== null && HEADING_VARIANTS.has(variant);
	return (
		<RNText
			className={cn(textVariants({ variant }), inherited, className)}
			role={isHeading ? "heading" : undefined}
			{...props}
		/>
	);
}
