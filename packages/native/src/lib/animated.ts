import { cssInterop } from "nativewind";
import { Animated } from "react-native";

/**
 * `Animated.View`, registered so `className` actually applies.
 *
 * NativeWind registers a fixed list of React Native components with
 * `cssInterop` — Image, Pressable, Text, View, ScrollView, TextInput and a
 * handful more — and `Animated.View` is not among them. A `className` on the
 * bare `Animated.View` is therefore an inert prop: no error, no style, just a
 * component that renders unstyled unless the consumer's Metro happens to run
 * `nativewind/babel` over `node_modules`, which this package's build
 * deliberately does not assume.
 *
 * Registering once here, in a module every animated component imports, keeps
 * that assumption out of the consumer's build config. Components that animate
 * (Progress, Skeleton, BottomSheet) must use this rather than
 * `Animated.View` directly.
 */
export const AnimatedView = Animated.View;

cssInterop(AnimatedView, { className: "style" });
