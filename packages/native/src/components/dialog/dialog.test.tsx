import { describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { PortalHost } from "@rn-primitives/portal";
import { Button } from "../../primitives/button/button.js";
import { Text } from "../../primitives/text/text.js";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "./dialog.js";

/**
 * Render a dialog with the PortalHost every overlay needs.
 * @param open - Whether the dialog is open
 * @param onOpenChange - Open-state handler
 * @returns The element tree
 */
function fixture(open: boolean, onOpenChange: (next: boolean) => void) {
	return (
		<>
			<Dialog open={open} onOpenChange={onOpenChange}>
				<DialogTrigger asChild>
					<Button>
						<Text>Open</Text>
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogTitle>Delete project</DialogTitle>
					<DialogDescription>This cannot be undone.</DialogDescription>
				</DialogContent>
			</Dialog>
			<PortalHost />
		</>
	);
}

describe("Dialog", () => {
	it("renders nothing while closed", async () => {
		await render(fixture(false, () => undefined));
		expect(screen.queryByText("Delete project")).toBeNull();
	});

	it("renders its title and description when open", async () => {
		await render(fixture(true, () => undefined));
		expect(screen.getByText("Delete project")).toBeTruthy();
		expect(screen.getByText("This cannot be undone.")).toBeTruthy();
	});

	it("opens from the trigger", async () => {
		const onOpenChange = jest.fn();
		await render(fixture(false, onOpenChange));
		await fireEvent.press(screen.getByText("Open"));
		expect(onOpenChange).toHaveBeenCalledWith(true);
	});

	it("keeps the description muted", async () => {
		await render(fixture(true, () => undefined));
		expect(screen.getByText("This cannot be undone.").props.className).toContain(
			"text-muted-foreground",
		);
	});

	// Without a PortalHost the content mounts but renders nowhere. Proving it
	// here keeps the "mount a PortalHost" instruction from being folklore.
	it("renders nothing when the app has no PortalHost", async () => {
		await render(
			<Dialog open>
				<DialogContent>
					<DialogTitle>Delete project</DialogTitle>
				</DialogContent>
			</Dialog>,
		);
		expect(screen.queryByText("Delete project")).toBeNull();
	});
});
