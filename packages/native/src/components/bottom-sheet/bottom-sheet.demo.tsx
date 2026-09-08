import { useState } from "react";
import { View } from "react-native";
import { Button } from "../../primitives/button/button.js";
import { Label } from "../../primitives/label/label.js";
import { RadioGroup, RadioGroupItem } from "../../primitives/radio-group/radio-group.js";
import { Text } from "../../primitives/text/text.js";
import {
	BottomSheet,
	BottomSheetClose,
	BottomSheetContent,
	BottomSheetTitle,
} from "./bottom-sheet.js";

/**
 * A sort menu in the shape a phone expects.
 * @returns The rendered demo
 */
export function BottomSheetDemo() {
	const [open, setOpen] = useState(false);
	const [sort, setSort] = useState("newest");

	return (
		<View className="w-full max-w-md gap-3">
			<Button variant="outline" onPress={() => setOpen(true)}>
				<Text>Sort by</Text>
			</Button>
			<Text variant="muted">Requires a PortalHost in the root layout.</Text>

			<BottomSheet open={open} onOpenChange={setOpen}>
				<BottomSheetContent>
					<BottomSheetTitle>Sort by</BottomSheetTitle>
					<RadioGroup value={sort} onValueChange={setSort}>
						<View className="flex-row items-center gap-2">
							<RadioGroupItem value="newest" aria-labelledby="demo-sort-newest" />
							<Label nativeID="demo-sort-newest">Newest first</Label>
						</View>
						<View className="flex-row items-center gap-2">
							<RadioGroupItem value="oldest" aria-labelledby="demo-sort-oldest" />
							<Label nativeID="demo-sort-oldest">Oldest first</Label>
						</View>
					</RadioGroup>
					<BottomSheetClose asChild>
						<Button variant="secondary">
							<Text>Done</Text>
						</Button>
					</BottomSheetClose>
				</BottomSheetContent>
			</BottomSheet>
		</View>
	);
}
