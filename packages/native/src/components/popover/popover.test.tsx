import { describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { PortalHost } from "@rn-primitives/portal";
import { Button } from "../../primitives/button/button.js";
import { Text } from "../../primitives/text/text.js";
import { Popover, PopoverContent, PopoverTrigger } from "./popover.js";

// The panel is portalled and anchored to the trigger, and the primitive only
// mounts it once the trigger has been measured with `.measure()` — which
// needs a real layout pass and so never happens under the test renderer.
// These tests assert the trigger contract and the closed state; the anchored
// panel itself is a device concern, covered by the playground.

/**
 * Render a popover with the PortalHost overlays require.
 * @param onOpenChange - Open-state observer
 * @returns The element tree
 */
function fixture(onOpenChange?: (open: boolean) => void) {
	return (
		<>
			<Popover onOpenChange={onOpenChange}>
				<PopoverTrigger asChild>
					<Button>
						<Text>Filters</Text>
					</Button>
				</PopoverTrigger>
				<PopoverContent>
					<Text>Sort options</Text>
				</PopoverContent>
			</Popover>
			<PortalHost />
		</>
	);
}

describe("Popover", () => {
	it("keeps its panel closed until the trigger is pressed", async () => {
		await render(fixture());
		expect(screen.queryByText("Sort options")).toBeNull();
	});

	it("reports the panel opening", async () => {
		const onOpenChange = jest.fn();
		await render(fixture(onOpenChange));
		await fireEvent.press(screen.getByText("Filters"));
		expect(onOpenChange).toHaveBeenCalledWith(true);
	});

	it("marks the trigger expanded once open", async () => {
		await render(fixture());
		const trigger = screen.getByRole("button", { name: "Filters" });
		await fireEvent.press(trigger);
		expect(trigger.props.accessibilityState.expanded).toBe(true);
	});
});
