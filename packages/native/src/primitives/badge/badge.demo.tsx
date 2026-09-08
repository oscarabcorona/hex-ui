import { View } from "react-native";
import { Text } from "../text/text.js";
import { Badge } from "./badge.js";

/**
 * Badge variants plus a heading pairing and a count chip.
 * @returns The rendered demo
 */
export function BadgeDemo() {
	return (
		<View className="w-full max-w-md gap-6">
			<View className="gap-2">
				<Text variant="muted">Variants</Text>
				<View className="flex-row flex-wrap items-center gap-2">
					<Badge>
						<Text>Default</Text>
					</Badge>
					<Badge variant="secondary">
						<Text>Beta</Text>
					</Badge>
					<Badge variant="destructive">
						<Text>Failed</Text>
					</Badge>
					<Badge variant="outline">
						<Text>Draft</Text>
					</Badge>
				</View>
			</View>

			<View className="gap-2">
				<Text variant="muted">Next to a heading</Text>
				<View className="flex-row items-center gap-2">
					<Text variant="h3">API Keys</Text>
					<Badge variant="secondary">
						<Text>Beta</Text>
					</Badge>
				</View>
			</View>
		</View>
	);
}
