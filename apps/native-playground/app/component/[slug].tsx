import { Text } from "@hex-core/native";
import { Stack, useLocalSearchParams } from "expo-router";
import { ScrollView, View } from "react-native";
import { getDemo } from "../../src/demos";

/**
 * One screen per demo, addressed by slug so the screenshot script can
 * deep-link straight to it.
 * @returns The rendered demo, or a not-found message
 */
export default function ComponentScreen() {
	const { slug } = useLocalSearchParams<{ slug: string }>();
	const Demo = typeof slug === "string" ? getDemo(slug) : undefined;

	return (
		<>
			<Stack.Screen options={{ title: slug ?? "Component" }} />
			<ScrollView contentContainerClassName="p-4">
				{Demo ? (
					<Demo />
				) : (
					<View className="gap-2">
						<Text variant="h4">No demo</Text>
						<Text variant="muted">
							Nothing is registered for &quot;{slug}&quot;. Run pnpm run build:barrels.
						</Text>
					</View>
				)}
			</ScrollView>
		</>
	);
}
