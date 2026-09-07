import { View } from "react-native";
import { Text } from "../../primitives/text/text.js";
import { Message } from "../message/message.js";
import { MessageList } from "./message-list.js";

interface Turn {
	id: string;
	role: "user" | "assistant";
	content: string;
}

const TURNS: Turn[] = [
	{ id: "1", role: "user", content: "What is the weather in Lisbon?" },
	{ id: "2", role: "assistant", content: "Sunny and 21 degrees." },
	{ id: "3", role: "user", content: "And tomorrow?" },
	{ id: "4", role: "assistant", content: "Cloudier, around 18 degrees with a chance of rain." },
];

/**
 * A short conversation in the inverted list.
 */
export function MessageListDemo() {
	return (
		<View className="h-80 w-full max-w-md overflow-hidden rounded-xl border border-border">
			<MessageList
				messages={TURNS}
				keyExtractor={(turn) => turn.id}
				renderMessage={(turn) => (
					<Message role={turn.role}>
						<Text>{turn.content}</Text>
					</Message>
				)}
			/>
		</View>
	);
}
