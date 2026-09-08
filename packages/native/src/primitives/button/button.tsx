import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";
import { ActivityIndicator, Pressable } from "react-native";
import { TextClassContext } from "../../lib/text-context.js";
import { cn } from "../../lib/utils.js";

/**
 * Container styles per variant and size.
 *
 * `active:` replaces the web `hover:` — touch has no hover, and NativeWind
 * maps `active:` to the Pressable pressed state. Focus rings are omitted:
 * React Native draws no keyboard focus ring on touch platforms.
 */
export const buttonVariants = cva(
	"group shrink-0 flex-row items-center justify-center gap-2 rounded-md",
	{
		variants: {
			variant: {
				default: "bg-primary shadow-sm shadow-black/5 active:bg-primary/90",
				destructive: "bg-destructive shadow-sm shadow-black/5 active:bg-destructive/90",
				outline: "border border-input bg-background shadow-sm shadow-black/5 active:bg-accent",
				secondary: "bg-secondary shadow-sm shadow-black/5 active:bg-secondary/80",
				ghost: "active:bg-accent",
				link: "",
			},
			size: {
				default: "h-10 px-4 py-2",
				sm: "h-9 rounded-md px-3",
				lg: "h-11 rounded-md px-8",
				icon: "h-10 w-10",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

/**
 * Label styles per variant, published to descendant `Text` through
 * `TextClassContext`. `group-active:` follows the container's pressed state.
 */
export const buttonTextVariants = cva("text-sm font-medium text-foreground", {
	variants: {
		variant: {
			default: "text-primary-foreground",
			destructive: "text-destructive-foreground",
			outline: "group-active:text-accent-foreground",
			secondary: "text-secondary-foreground",
			ghost: "group-active:text-accent-foreground",
			link: "text-primary group-active:underline",
		},
		size: {
			default: "",
			sm: "",
			lg: "text-base",
			icon: "",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "default",
	},
});

/**
 * Props for {@link Button}. `ref` comes with the `Pressable` props and reaches
 * the host view (React 19 — no forwardRef).
 */
export interface ButtonProps
	extends Omit<ComponentProps<typeof Pressable>, "children">,
		VariantProps<typeof buttonVariants> {
	/**
	 * The label and any icons. Wrap strings in `Text` — React Native cannot
	 * render a bare string inside a Pressable. Render-prop children are not
	 * supported because the loading indicator is composed in front of them.
	 */
	children?: ReactNode;
	/** Show an activity indicator before the label and block interaction. */
	loading?: boolean;
}

/**
 * A pressable action button with the web catalog's variants and sizes.
 *
 * The container is a `Pressable` with `role="button"`; labels pick up their
 * colour through `TextClassContext`, so `<Button><Text>Save</Text></Button>`
 * renders the label in `primary-foreground` without any extra prop.
 * @param props - {@link ButtonProps}
 * @returns A React Native `Pressable`
 * @example
 * ```tsx
 * <Button onPress={save}>
 *   <Text>Save</Text>
 * </Button>
 * <Button variant="outline" size="icon" aria-label="Settings" onPress={openSettings}>
 *   <SettingsIcon />
 * </Button>
 * ```
 */
export function Button({
	className,
	variant,
	size,
	loading = false,
	disabled,
	children,
	...props
}: ButtonProps) {
	const inactive = disabled === true || loading;
	const textClass = buttonTextVariants({ variant, size });
	return (
		<TextClassContext.Provider value={textClass}>
			<Pressable
				role="button"
				aria-busy={loading || undefined}
				disabled={inactive}
				className={cn(buttonVariants({ variant, size }), inactive && "opacity-50", className)}
				{...props}
			>
				{loading ? <ActivityIndicator size="small" className={textClass} /> : null}
				{children}
			</Pressable>
		</TextClassContext.Provider>
	);
}
