import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { View } from "react-native";
import { TextClassContext } from "../../lib/text-context.js";
import { cn } from "../../lib/utils.js";

/** Container styles per variant. */
export const badgeVariants = cva(
	"shrink-0 flex-row items-center justify-center gap-1 overflow-hidden rounded-full border border-border px-2 py-0.5",
	{
		variants: {
			variant: {
				default: "border-transparent bg-primary",
				secondary: "border-transparent bg-secondary",
				destructive: "border-transparent bg-destructive",
				outline: "",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

/** Label styles per variant, published through `TextClassContext`. */
export const badgeTextVariants = cva("text-xs font-medium", {
	variants: {
		variant: {
			default: "text-primary-foreground",
			secondary: "text-secondary-foreground",
			destructive: "text-destructive-foreground",
			outline: "text-foreground",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

/** Props for {@link Badge}. */
export type BadgeProps = ComponentProps<typeof View> & VariantProps<typeof badgeVariants>;

/**
 * A compact status, count or category chip.
 *
 * Purely visual by default. For a badge whose text changes in response to
 * something (a live count, a job status), pass `role="status"` so screen
 * readers announce the update.
 * @param props - {@link BadgeProps}
 * @returns A React Native `View` wrapping the label
 * @example
 * ```tsx
 * <Badge><Text>New</Text></Badge>
 * <Badge variant="destructive"><Text>Failed</Text></Badge>
 * ```
 */
export function Badge({ className, variant, ...props }: BadgeProps) {
	return (
		<TextClassContext.Provider value={badgeTextVariants({ variant })}>
			<View className={cn(badgeVariants({ variant }), className)} {...props} />
		</TextClassContext.Provider>
	);
}
