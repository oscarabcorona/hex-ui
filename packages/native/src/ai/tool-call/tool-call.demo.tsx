import { View } from "react-native";
import { Text } from "../../primitives/text/text.js";
import { ToolCall } from "./tool-call.js";

/**
 * A tool call in each state.
 * @returns The rendered demo
 */
export function ToolCallDemo() {
	return (
		<View className="w-full max-w-md gap-3">
			<ToolCall name="search_flights" state="running" args={{ from: "LHR", to: "JFK" }} />
			<ToolCall
				name="search_flights"
				state="success"
				args={{ from: "LHR", to: "JFK" }}
				result={{ count: 12, cheapest: 412 }}
			/>
			<ToolCall
				name="book_flight"
				state="error"
				args={{ id: "BA117" }}
				result="Payment declined"
				defaultOpen
			/>
			<Text variant="muted">Tap a row to expand its arguments and result.</Text>
		</View>
	);
}
