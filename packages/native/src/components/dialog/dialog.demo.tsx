import { useState } from "react";
import { View } from "react-native";
import { Button } from "../../primitives/button/button.js";
import { Text } from "../../primitives/text/text.js";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "./dialog.js";

/**
 * A controlled confirmation dialog.
 *
 * Renders through the playground's `PortalHost`, mounted in the root layout.
 * @returns The rendered demo
 */
export function DialogDemo() {
	const [open, setOpen] = useState(false);

	return (
		<View className="w-full max-w-md gap-3">
			<Button onPress={() => setOpen(true)}>
				<Text>Delete project</Text>
			</Button>
			<Text variant="muted">Requires a PortalHost in the root layout.</Text>

			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent>
					<DialogTitle>Delete project</DialogTitle>
					<DialogDescription>
						This removes the project and everything in it. It cannot be undone.
					</DialogDescription>
					<View className="flex-row justify-end gap-2">
						<Button variant="secondary" onPress={() => setOpen(false)}>
							<Text>Cancel</Text>
						</Button>
						<Button variant="destructive" onPress={() => setOpen(false)}>
							<Text>Delete</Text>
						</Button>
					</View>
				</DialogContent>
			</Dialog>
		</View>
	);
}
