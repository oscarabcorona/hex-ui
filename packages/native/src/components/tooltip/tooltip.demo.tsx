import { View } from "react-native";
import { Button } from "../../primitives/button/button.js";
import { Text } from "../../primitives/text/text.js";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip.js";

/**
 * An icon-only button whose name is revealed on long press.
 */
export function TooltipDemo() {
	return (
		<View className="w-full max-w-md gap-3">
			<View className="flex-row gap-2">
				<Tooltip>
					<TooltipTrigger asChild>
						<Button variant="outline" size="icon" aria-label="Archive">
							<Text>A</Text>
						</Button>
					</TooltipTrigger>
					<TooltipContent>
						<Text>Archive</Text>
					</TooltipContent>
				</Tooltip>
			</View>
			<Text variant="muted">
				Long-press the button. Requires a PortalHost in the root layout.
			</Text>
		</View>
	);
}
