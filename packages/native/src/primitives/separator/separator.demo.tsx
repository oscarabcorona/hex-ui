import { View } from "react-native";
import { Text } from "../text/text.js";
import { Separator } from "./separator.js";

/**
 * A horizontal rule between sections and a vertical rule in a metadata row.
 */
export function SeparatorDemo() {
	return (
		<View className="w-full max-w-md gap-6">
			<View>
				<Text variant="h4">Profile</Text>
				<Separator className="my-3" />
				<Text variant="muted">Manage how your account appears to others.</Text>
			</View>

			<View className="flex-row items-center gap-2">
				<Text variant="small">Draft</Text>
				<Separator orientation="vertical" className="h-4" />
				<Text variant="small">Edited 2h ago</Text>
				<Separator orientation="vertical" className="h-4" />
				<Text variant="small">3 comments</Text>
			</View>
		</View>
	);
}
