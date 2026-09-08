import * as ProgressPrimitive from "@rn-primitives/progress";
import { type ComponentProps, useEffect, useState } from "react";
import { Animated } from "react-native";
import { AnimatedView } from "../../lib/animated.js";
import { cn } from "../../lib/utils.js";

/** Props for {@link Progress}. */
export interface ProgressProps extends ComponentProps<typeof ProgressPrimitive.Root> {
	/** Class names for the filled portion, e.g. to recolour it. */
	indicatorClassName?: string;
}

/** How long the bar takes to animate to a new value, in milliseconds. */
const FILL_DURATION = 300;

/**
 * A determinate progress bar.
 *
 * Animates the fill with React Native's built-in `Animated` rather than
 * Reanimated, so the package needs no native module. The bar animates its
 * width, which cannot use the native driver, so keep it off long lists.
 * @param props - {@link ProgressProps}
 * @returns The progress element
 * @example
 * ```tsx
 * <Progress value={uploaded} aria-label="Upload progress" />
 * ```
 */
export function Progress({
	className,
	indicatorClassName,
	value,
	max = 100,
	...props
}: ProgressProps) {
	// Clamp ONCE and pass the clamped pair down. The bar used to clamp its own
	// fill while forwarding the raw value to the primitive, whose
	// `isValidValueNumber` rejects `value > max` and falls back to 0 — so
	// `value={150} max={100}` drew a full bar that VoiceOver announced as
	// "0%". A non-positive `max` made `percent` NaN, which then poisoned the
	// Animated.Value it was constructed with.
	const safeMax = max > 0 ? max : 100;
	const safeValue = Math.min(Math.max(value ?? 0, 0), safeMax);
	const percent = (safeValue / safeMax) * 100;
	// `useState` with an initialiser: `useRef(new Animated.Value(…))` builds a
	// fresh Value on every render and discards it.
	const [width] = useState(() => new Animated.Value(percent));

	useEffect(() => {
		const animation = Animated.timing(width, {
			toValue: percent,
			duration: FILL_DURATION,
			// Width is a layout property, so it cannot run on the native driver.
			useNativeDriver: false,
		});
		animation.start();
		return () => {
			animation.stop();
		};
	}, [percent, width]);

	return (
		<ProgressPrimitive.Root
			value={safeValue}
			max={safeMax}
			className={cn("h-2 w-full overflow-hidden rounded-full bg-secondary", className)}
			{...props}
		>
			<ProgressPrimitive.Indicator asChild>
				<AnimatedView
					className={cn("h-full bg-primary", indicatorClassName)}
					style={{
						width: width.interpolate({
							inputRange: [0, 100],
							outputRange: ["0%", "100%"],
						}),
					}}
				/>
			</ProgressPrimitive.Indicator>
		</ProgressPrimitive.Root>
	);
}
