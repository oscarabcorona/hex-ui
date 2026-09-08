import * as SeparatorPrimitive from "@rn-primitives/separator";
import type { ComponentProps } from "react";
import { cn } from "../../lib/utils.js";

/** Props for {@link Separator}. */
export type SeparatorProps = ComponentProps<typeof SeparatorPrimitive.Root>;

/**
 * A one-pixel rule between content groups.
 *
 * Decorative by default, which hides it from assistive tech. Pass
 * `decorative={false}` when the rule is the only thing marking a boundary
 * that matters — a thematic break between two unrelated sections.
 * @param props - {@link SeparatorProps}
 * @returns The separator element
 * @example
 * ```tsx
 * <Separator className="my-4" />
 * <Separator orientation="vertical" className="mx-2 h-4" />
 * ```
 */
export function Separator({
	className,
	orientation = "horizontal",
	decorative = true,
	...props
}: SeparatorProps) {
	return (
		<SeparatorPrimitive.Root
			decorative={decorative}
			orientation={orientation}
			className={cn(
				"shrink-0 bg-border",
				orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
				className,
			)}
			{...props}
		/>
	);
}
