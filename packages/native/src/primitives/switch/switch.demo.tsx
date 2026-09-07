import { useState } from "react";
import { View } from "react-native";
import { Label } from "../label/label.js";
import { Text } from "../text/text.js";
import { Switch } from "./switch.js";

/**
 * Two settings rows, one with a description and one disabled.
 */
export function SwitchDemo() {
	const [notifications, setNotifications] = useState(true);
	const [sync, setSync] = useState(false);

	return (
		<View className="w-full max-w-md gap-4">
			<View className="flex-row items-center justify-between py-2">
				<Label nativeID="demo-notifications">Push notifications</Label>
				<Switch
					aria-labelledby="demo-notifications"
					checked={notifications}
					onCheckedChange={setNotifications}
				/>
			</View>

			<View className="flex-row items-start justify-between gap-4 py-2">
				<View className="flex-1 gap-1">
					<Label nativeID="demo-sync">Background sync</Label>
					<Text nativeID="demo-sync-hint" variant="muted">
						Uses mobile data when Wi-Fi is unavailable.
					</Text>
				</View>
				<Switch
					aria-labelledby="demo-sync"
					aria-describedby="demo-sync-hint"
					checked={sync}
					onCheckedChange={setSync}
				/>
			</View>

			<View className="flex-row items-center justify-between py-2">
				<Label nativeID="demo-locked" disabled>
					Managed by your organisation
				</Label>
				<Switch
					aria-labelledby="demo-locked"
					checked
					disabled
					onCheckedChange={() => undefined}
				/>
			</View>
		</View>
	);
}
