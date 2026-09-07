import { type ComponentProps, useEffect, useRef } from "react";
import { Animated, View } from "react-native";
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
export function Skeleton({ className, animated = true, ...props }: SkeletonProps) {
	const opacity = useRef(new Animated.Value(1)).current;

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
		<Animated.View
			style={{ opacity }}
			className={cn("rounded-md bg-muted", className)}
			{...props}
		/>
	);
}
