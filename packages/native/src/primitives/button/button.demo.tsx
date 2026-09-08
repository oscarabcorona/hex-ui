import { View } from "react-native";
import { Text } from "../text/text.js";
import { Button } from "./button.js";

/**
 * Every variant and size, plus the loading and disabled states.
 * @returns The rendered demo
 */
export function ButtonDemo() {
	return (
		<View className="w-full max-w-md gap-6">
			<View className="gap-2">
				<Text variant="muted">Variants</Text>
				<View className="flex-row flex-wrap gap-2">
					<Button>
						<Text>Primary</Text>
					</Button>
					<Button variant="secondary">
						<Text>Secondary</Text>
					</Button>
					<Button variant="outline">
						<Text>Outline</Text>
					</Button>
					<Button variant="ghost">
						<Text>Ghost</Text>
					</Button>
					<Button variant="destructive">
						<Text>Delete</Text>
					</Button>
					<Button variant="link">
						<Text>Link</Text>
					</Button>
				</View>
			</View>

			<View className="gap-2">
				<Text variant="muted">Sizes</Text>
				<View className="flex-row flex-wrap items-center gap-2">
					<Button size="sm">
						<Text>Small</Text>
					</Button>
					<Button>
						<Text>Default</Text>
					</Button>
					<Button size="lg">
						<Text>Large</Text>
					</Button>
					<Button size="icon" variant="outline" aria-label="Add">
						<Text>+</Text>
					</Button>
				</View>
			</View>

			<View className="gap-2">
				<Text variant="muted">States</Text>
				<View className="flex-row flex-wrap gap-2">
					<Button loading>
						<Text>Saving…</Text>
					</Button>
					<Button disabled>
						<Text>Disabled</Text>
					</Button>
				</View>
			</View>
		</View>
	);
}
