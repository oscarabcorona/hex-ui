import { View } from "react-native";
import { Text } from "../text/text.js";
import { Label } from "./label.js";

/**
 * A label above a field caption, and a disabled label.
 * @returns The rendered demo
 */
export function LabelDemo() {
	return (
		<View className="w-full max-w-md gap-6">
			<View className="gap-1.5">
				<Label nativeID="email">Email address</Label>
				<Text variant="muted">We only use it for sign-in.</Text>
			</View>

			<View className="gap-1.5">
				<Label nativeID="plan" disabled>
					Plan
				</Label>
				<Text variant="muted">Contact sales to change your plan.</Text>
			</View>
		</View>
	);
}
