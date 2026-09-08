import { type ComponentProps, useEffect, useState } from "react";
import { Animated, View } from "react-native";
import { AnimatedView } from "../../lib/animated.js";
import { cn } from "../../lib/utils.js";

/** Props for {@link Skeleton}. */
export interface SkeletonProps extends ComponentProps<typeof View> {
	/**
	 * Stop the pulse. Set this when many skeletons are on screen at once and
	 * the motion becomes noise, or to respect a reduce-motion preference.
	 */
	animated?: boolean;
}

/** One full fade-out/fade-in cycle, in milliseconds. */
const PULSE_DURATION = 900;

/**
 * A placeholder block that mimics the shape of content still loading.
 *
 * Uses React Native's built-in `Animated` rather than Reanimated, so the
 * package pulls in no native module: `hex add native-skeleton` needs no
 * config plugin and no rebuild of the consumer's dev client.
 * @param props - {@link SkeletonProps}
 * @returns An animated `View`
 * @example
 * ```tsx
 * <View className="gap-2" aria-busy>
 *   <Skeleton className="h-4 w-32" />
 *   <Skeleton className="h-4 w-full" />
 * </View>
 * ```
 */
export function Skeleton({ className, animated = true, style, ...props }: SkeletonProps) {
	// `useState` with an initialiser, not `useRef(new Animated.Value(…))`:
	// the latter builds a fresh Value on every render and throws it away.
	const [opacity] = useState(() => new Animated.Value(1));

	useEffect(() => {
		if (!animated) {
			opacity.setValue(1);
			return;
		}
		const loop = Animated.loop(
			Animated.sequence([
				Animated.timing(opacity, {
					toValue: 0.4,
					duration: PULSE_DURATION / 2,
					useNativeDriver: true,
				}),
				Animated.timing(opacity, {
					toValue: 1,
					duration: PULSE_DURATION / 2,
					useNativeDriver: true,
				}),
			]),
		);
		loop.start();
		return () => {
			loop.stop();
		};
	}, [animated, opacity]);

	return (
		<AnimatedView
			{...props}
			// The spread comes first and `style` is merged rather than
			// replaced: `SkeletonProps` extends View's props, so a consumer
			// passing `style={{ marginTop: 8 }}` used to overwrite the
			// animated opacity outright and silently kill the pulse while the
			// animation loop kept running against nothing.
			style={[{ opacity }, style]}
			className={cn("rounded-md bg-muted", className)}
		/>
	);
}
