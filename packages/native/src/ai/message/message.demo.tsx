import { View } from "react-native";
import { Text } from "../../primitives/text/text.js";
import { Message } from "./message.js";

/**
 * A short exchange showing each role.
 */
export function MessageDemo() {
	return (
		<View className="w-full max-w-md gap-2">
			<Message role="system">
				<Text>Model switched to the fast tier.</Text>
			</Message>
			<Message role="user">
				<Text>What is the weather in Lisbon?</Text>
			</Message>
			<Message role="assistant">
				<Text>Sunny and 21 degrees, with a light breeze off the river.</Text>
			</Message>
			<Message role="tool">
				<Text>weather.lookup returned 12 records</Text>
			</Message>
		</View>
	);
}
