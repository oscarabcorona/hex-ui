import type { ComponentProps } from "react";
import { View } from "react-native";
import { TextClassContext } from "../../lib/text-context.js";
import { cn } from "../../lib/utils.js";
import { Text } from "../../primitives/text/text.js";

/** Props for {@link Card} and its layout slots. */
export type CardProps = ComponentProps<typeof View>;

/**
 * A bordered surface grouping related content.
 *
 * Compose it from the slots rather than passing content through props:
 * `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`.
 * @param props - {@link CardProps}
 * @returns The card container
 * @example
 * ```tsx
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Storage</CardTitle>
 *     <CardDescription>94% of 10 GB used</CardDescription>
 *   </CardHeader>
 *   <CardContent><Progress value={94} aria-label="Storage used" /></CardContent>
 * </Card>
 * ```
 */
export function Card({ className, ...props }: CardProps) {
	return (
		<TextClassContext.Provider value="text-card-foreground">
			<View
				className={cn(
					"flex-col gap-6 rounded-xl border border-border bg-card py-6 shadow-sm shadow-black/5",
					className,
				)}
				{...props}
			/>
		</TextClassContext.Provider>
	);
}

/**
 * The card's heading area. Holds `CardTitle` and `CardDescription`.
 * @param props - {@link CardProps}
 * @returns The header container
 */
export function CardHeader({ className, ...props }: CardProps) {
	return <View className={cn("flex-col gap-1.5 px-6", className)} {...props} />;
}

/** Props for {@link CardTitle} and {@link CardDescription}. */
export type CardTextProps = ComponentProps<typeof Text>;

/**
 * The card's title, announced as a heading.
 * @param props - {@link CardTextProps}
 * @returns The title text
 */
export function CardTitle({ className, ...props }: CardTextProps) {
	return <Text variant="h4" className={cn("leading-none", className)} {...props} />;
}

/**
 * A muted line under the title.
 *
 * The muted colour is passed as a class rather than left to the `muted`
 * variant: the Card publishes `text-card-foreground` through
 * `TextClassContext`, and an inherited class outranks the variant. Only an
 * explicit `className` beats it.
 * @param props - {@link CardTextProps}
 * @returns The description text
 */
export function CardDescription({ className, ...props }: CardTextProps) {
	return <Text variant="muted" className={cn("text-muted-foreground", className)} {...props} />;
}

/**
 * The card's main body.
 * @param props - {@link CardProps}
 * @returns The content container
 */
export function CardContent({ className, ...props }: CardProps) {
	return <View className={cn("px-6", className)} {...props} />;
}

/**
 * A row of actions at the bottom of the card.
 * @param props - {@link CardProps}
 * @returns The footer container
 */
export function CardFooter({ className, ...props }: CardProps) {
	return <View className={cn("flex-row items-center px-6", className)} {...props} />;
}
