import { useState } from "react";
import { View } from "react-native";
import { Text } from "../../primitives/text/text.js";
import { Composer } from "./composer.js";

/**
 * The composer in its idle and busy states.
 * @returns The rendered demo
 */
export function ComposerDemo() {
	const [draft, setDraft] = useState("");
	const [sent, setSent] = useState<string | null>(null);

	return (
		<View className="w-full max-w-md gap-4">
			<View className="overflow-hidden rounded-xl border border-border">
				<Composer
					value={draft}
					onChangeText={setDraft}
					onSubmit={(message) => {
						setSent(message);
						setDraft("");
					}}
				/>
			</View>
			<Text variant="muted">Last sent: {sent ?? "nothing yet"}</Text>

			<View className="overflow-hidden rounded-xl border border-border">
				<Composer value="Waiting for a reply…" onChangeText={() => undefined} onSubmit={() => undefined} busy />
			</View>
		</View>
	);
}
