import { describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { PortalHost } from "@rn-primitives/portal";
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
 * Render an alert dialog with the PortalHost overlays require.
 * @param open - Whether the alert is open
 * @param onOpenChange - Open-state handler
 * @returns The element tree
 */
function fixture(open: boolean, onOpenChange: (next: boolean) => void) {
	return (
		<>
			<AlertDialog open={open} onOpenChange={onOpenChange}>
				<AlertDialogContent>
					<AlertDialogTitle>Delete account?</AlertDialogTitle>
					<AlertDialogDescription>This cannot be undone.</AlertDialogDescription>
					<View>
						<AlertDialogCancel asChild>
							<Button>
								<Text>Cancel</Text>
							</Button>
						</AlertDialogCancel>
						<AlertDialogAction asChild>
							<Button>
								<Text>Delete</Text>
							</Button>
						</AlertDialogAction>
					</View>
				</AlertDialogContent>
			</AlertDialog>
			<PortalHost />
		</>
	);
}

describe("AlertDialog", () => {
	it("renders nothing while closed", async () => {
		await render(fixture(false, () => undefined));
		expect(screen.queryByText("Delete account?")).toBeNull();
	});

	it("renders the question, consequence and both answers when open", async () => {
		await render(fixture(true, () => undefined));
		expect(screen.getByText("Delete account?")).toBeTruthy();
		expect(screen.getByText("This cannot be undone.")).toBeTruthy();
		expect(screen.getByText("Cancel")).toBeTruthy();
		expect(screen.getByText("Delete")).toBeTruthy();
	});

	it("closes on cancel", async () => {
		const onOpenChange = jest.fn();
		await render(fixture(true, onOpenChange));
		await fireEvent.press(screen.getByText("Cancel"));
		expect(onOpenChange).toHaveBeenCalledWith(false);
	});

	it("closes on the confirming action", async () => {
		const onOpenChange = jest.fn();
		await render(fixture(true, onOpenChange));
		await fireEvent.press(screen.getByText("Delete"));
		expect(onOpenChange).toHaveBeenCalledWith(false);
	});
});
