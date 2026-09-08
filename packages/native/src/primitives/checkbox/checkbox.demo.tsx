import { useState } from "react";
import { View } from "react-native";
import { Label } from "../label/label.js";
import { Text } from "../text/text.js";
import { Checkbox } from "./checkbox.js";

/**
 * A labelled checkbox and a disabled one.
 * @returns The rendered demo
 */
export function CheckboxDemo() {
	const [accepted, setAccepted] = useState(false);

	return (
		<View className="w-full max-w-md gap-5">
			<View className="flex-row items-center gap-2">
				<Checkbox aria-labelledby="demo-terms" checked={accepted} onCheckedChange={setAccepted} />
				<Label nativeID="demo-terms">I accept the terms</Label>
			</View>

			<View className="flex-row items-center gap-2">
				<Checkbox aria-labelledby="demo-locked" checked disabled onCheckedChange={() => undefined} />
				<Label nativeID="demo-locked" disabled>
					Included in every plan
				</Label>
			</View>

			<Text variant="muted">Accepted: {accepted ? "yes" : "no"}</Text>
		</View>
	);
}
