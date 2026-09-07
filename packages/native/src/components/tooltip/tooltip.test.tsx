import { describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { PortalHost } from "@rn-primitives/portal";
import { Button } from "../../primitives/button/button.js";
import { Text } from "../../primitives/text/text.js";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip.js";

// The bubble is portalled and anchored, and the primitive only mounts it
// once the trigger has been measured with `.measure()` — which needs a real
// layout pass and so never happens under the test renderer. These tests
// therefore assert the trigger contract and the closed state; that the bubble
// draws in the right place is a device concern, covered by the playground.

/**
 * Render a tooltip with the PortalHost overlays require.
 * @param onOpenChange - Open-state observer
 * @returns The element tree
 */
function fixture(onOpenChange?: (open: boolean) => void) {
	return (
		<>
			<Tooltip onOpenChange={onOpenChange}>
				<TooltipTrigger asChild>
					<Button aria-label="Archive">
						<Text>A</Text>
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					<Text>Archive</Text>
				</TooltipContent>
			</Tooltip>
			<PortalHost />
		</>
	);
}

describe("Tooltip", () => {
	it("keeps the bubble closed until the trigger is tapped", async () => {
		await render(fixture());
		expect(screen.queryByText("Archive")).toBeNull();
	});

	// The trigger's own aria-label is what assistive tech reads. The bubble is
	// a visual echo, which is why the schema insists on labelling the trigger.
	it("leaves the trigger's accessible name intact", async () => {
		await render(fixture());
		expect(screen.getByRole("button", { name: "Archive" })).toBeTruthy();
	});

	it("reports the bubble opening", async () => {
		const onOpenChange = jest.fn();
		await render(fixture(onOpenChange));
		await fireEvent.press(screen.getByRole("button", { name: "Archive" }));
		expect(onOpenChange).toHaveBeenCalledWith(true);
	});

	it("marks the trigger expanded once open", async () => {
		await render(fixture());
		const trigger = screen.getByRole("button", { name: "Archive" });
		await fireEvent.press(trigger);
		expect(trigger.props.accessibilityState.expanded).toBe(true);
	});
});
