import { useState } from "react";
import { View } from "react-native";
import { Button } from "../../primitives/button/button.js";
import { Text } from "../../primitives/text/text.js";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogTitle,
} from "./alert-dialog.js";

/**
 * A destructive confirmation with a mandatory Cancel.
 * @returns The rendered demo
 */
export function AlertDialogDemo() {
	const [open, setOpen] = useState(false);

	return (
		<View className="w-full max-w-md gap-3">
			<Button variant="destructive" onPress={() => setOpen(true)}>
				<Text>Delete account</Text>
			</Button>
			<Text variant="muted">Requires a PortalHost in the root layout.</Text>

			<AlertDialog open={open} onOpenChange={setOpen}>
				<AlertDialogContent>
					<AlertDialogTitle>Delete account?</AlertDialogTitle>
					<AlertDialogDescription>
						Everything in this account is removed. This cannot be undone.
					</AlertDialogDescription>
					<View className="flex-row justify-end gap-2">
						<AlertDialogCancel asChild>
							<Button variant="secondary">
								<Text>Cancel</Text>
							</Button>
						</AlertDialogCancel>
						<AlertDialogAction asChild>
							<Button variant="destructive">
								<Text>Delete</Text>
							</Button>
						</AlertDialogAction>
					</View>
				</AlertDialogContent>
			</AlertDialog>
		</View>
	);
}
