import { useState } from "react";
import { View } from "react-native";
import { Label } from "../label/label.js";
import { Text } from "../text/text.js";
import { RadioGroup, RadioGroupItem } from "./radio-group.js";

const OPTIONS = [
	{ id: "standard", label: "Standard", hint: "Delivered in 3-5 days." },
	{ id: "express", label: "Express", hint: "Delivered tomorrow." },
	{ id: "pickup", label: "Collect in store", hint: "Ready in 2 hours." },
];

/**
 * A shipping picker with a description under each option.
 */
export function RadioGroupDemo() {
	const [choice, setChoice] = useState("standard");

	return (
		<View className="w-full max-w-md">
			<RadioGroup value={choice} onValueChange={setChoice}>
				{OPTIONS.map((option) => (
					<View key={option.id} className="flex-row items-start gap-2">
						<RadioGroupItem
							value={option.id}
							aria-labelledby={`demo-ship-${option.id}`}
							className="mt-1"
						/>
						<View className="flex-1">
							<Label nativeID={`demo-ship-${option.id}`}>{option.label}</Label>
							<Text variant="muted">{option.hint}</Text>
						</View>
					</View>
				))}
			</RadioGroup>
		</View>
	);
}
