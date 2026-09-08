import { View } from "react-native";
import { Text } from "../text/text.js";
import { Progress } from "./progress.js";

/**
 * A labelled upload bar, a step counter, and a threshold colour.
 * @returns The rendered demo
 */
export function ProgressDemo() {
	return (
		<View className="w-full max-w-md gap-6">
			<View className="gap-1.5">
				<View className="flex-row justify-between">
					<Text variant="small">Uploading</Text>
					<Text variant="muted">64%</Text>
				</View>
				<Progress value={64} aria-label="Upload progress" />
			</View>

			<View className="gap-1.5">
				<Text variant="small">Step 2 of 5</Text>
				<Progress value={2} max={5} aria-label="Step 2 of 5" />
			</View>

			<View className="gap-1.5">
				<View className="flex-row justify-between">
					<Text variant="small">Storage used</Text>
					<Text variant="muted">94%</Text>
				</View>
				<Progress value={94} aria-label="Storage used" indicatorClassName="bg-destructive" />
			</View>
		</View>
	);
}
