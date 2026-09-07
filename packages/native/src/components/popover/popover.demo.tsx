import { View } from "react-native";
import { Button } from "../../primitives/button/button.js";
import { Text } from "../../primitives/text/text.js";
import { Popover, PopoverContent, PopoverTrigger } from "./popover.js";

/**
 * A short help panel anchored to a button.
 */
export function PopoverDemo() {
	return (
		<View className="w-full max-w-md gap-3">
			<Popover>
				<PopoverTrigger asChild>
					<Button variant="outline">
						<Text>Why this rate?</Text>
					</Button>
				</PopoverTrigger>
				<PopoverContent>
					<Text variant="small">Exchange rate</Text>
					<Text variant="muted">
						Rates refresh every 15 minutes and are fixed once you confirm.
					</Text>
				</PopoverContent>
			</Popover>
			<Text variant="muted">Requires a PortalHost in the root layout.</Text>
		</View>
	);
}
