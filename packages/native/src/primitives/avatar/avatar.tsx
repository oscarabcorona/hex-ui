import * as AvatarPrimitive from "@rn-primitives/avatar";
import type { ComponentProps } from "react";
import { TextClassContext } from "../../lib/text-context.js";
import { cn } from "../../lib/utils.js";

/** Props for {@link Avatar}. */
export type AvatarProps = ComponentProps<typeof AvatarPrimitive.Root>;

/**
 * A circular user image with a fallback for when the image is missing or
 * still loading.
 *
 * `alt` is required by the primitive and is what assistive tech announces,
 * so it belongs on the root rather than on the image.
 * @param props - {@link AvatarProps}
 * @returns The avatar root
 * @example
 * ```tsx
 * <Avatar alt="Ada Lovelace's profile picture">
 *   <AvatarImage source={{ uri: user.avatarUrl }} />
 *   <AvatarFallback><Text>AL</Text></AvatarFallback>
 * </Avatar>
 * ```
 */
export function Avatar({ className, ...props }: AvatarProps) {
	return (
		<AvatarPrimitive.Root
			className={cn("relative size-10 shrink-0 overflow-hidden rounded-full", className)}
			{...props}
		/>
	);
}

/** Props for {@link AvatarImage}. */
export type AvatarImageProps = ComponentProps<typeof AvatarPrimitive.Image>;

/**
 * The avatar's image. Renders nothing until the source loads, which is what
 * lets the fallback show through.
 * @param props - {@link AvatarImageProps}
 * @returns The avatar image
 */
export function AvatarImage({ className, ...props }: AvatarImageProps) {
	return <AvatarPrimitive.Image className={cn("aspect-square size-full", className)} {...props} />;
}

/** Props for {@link AvatarFallback}. */
export type AvatarFallbackProps = ComponentProps<typeof AvatarPrimitive.Fallback>;

/**
 * Shown while the image loads or when it fails. Holds initials or an icon.
 * @param props - {@link AvatarFallbackProps}
 * @returns The avatar fallback
 */
export function AvatarFallback({ className, ...props }: AvatarFallbackProps) {
	return (
		<TextClassContext.Provider value="text-sm font-medium text-muted-foreground">
			<AvatarPrimitive.Fallback
				className={cn(
					"size-full flex-row items-center justify-center rounded-full bg-muted",
					className,
				)}
				{...props}
			/>
		</TextClassContext.Provider>
	);
}
