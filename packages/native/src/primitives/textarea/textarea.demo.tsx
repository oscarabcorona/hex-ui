import { useState } from "react";
import { View } from "react-native";
import { Label } from "../label/label.js";
import { Text } from "../text/text.js";
import { Textarea } from "./textarea.js";

/**
 * A labelled notes field with a character counter.
 * @returns The rendered demo
 */
export function TextareaDemo() {
	const [notes, setNotes] = useState("");

	return (
		<View className="w-full max-w-md gap-5">
			<View className="gap-1.5">
				<Label nativeID="demo-notes">Notes</Label>
				<Textarea
					aria-labelledby="demo-notes"
					value={notes}
					onChangeText={setNotes}
					numberOfLines={4}
					maxLength={280}
					placeholder="Anything we should know?"
				/>
				<Text variant="muted" className="self-end">
					{280 - notes.length} left
				</Text>
			</View>

			<View className="gap-1.5">
				<Label nativeID="demo-readonly" disabled>
					Terms
				</Label>
				<Textarea
					aria-labelledby="demo-readonly"
					editable={false}
					value="These terms were accepted on 3 March."
				/>
			</View>
		</View>
	);
}
