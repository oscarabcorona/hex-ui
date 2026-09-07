import { useState } from "react";
import { View } from "react-native";
import { Label } from "../../primitives/label/label.js";
import { Text } from "../../primitives/text/text.js";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select.js";

type Option = { value: string; label: string } | undefined;

/**
 * A labelled plan picker.
 */
export function SelectDemo() {
	const [plan, setPlan] = useState<Option>(undefined);

	return (
		<View className="w-full max-w-md gap-3">
			<View className="gap-1.5">
				<Label nativeID="demo-plan">Plan</Label>
				<Select value={plan} onValueChange={setPlan}>
					<SelectTrigger aria-labelledby="demo-plan">
						<SelectValue placeholder="Pick a plan" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="free" label="Free" />
						<SelectItem value="pro" label="Pro" />
						<SelectItem value="team" label="Team" />
					</SelectContent>
				</Select>
			</View>
			<Text variant="muted">
				Selected: {plan?.label ?? "nothing yet"}. Requires a PortalHost in the root layout.
			</Text>
		</View>
	);
}
