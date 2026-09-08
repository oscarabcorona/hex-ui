import { describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { PortalHost } from "@rn-primitives/portal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select.js";

// Like the other anchored overlays, the option list mounts only after the
// trigger has been measured on a real layout pass, which the test renderer
// does not perform. These tests cover the closed control and its contract.

type Option = { value: string; label: string } | undefined;

/**
 * Render a select with the PortalHost overlays require.
 * @param value - The chosen option
 * @param onValueChange - Selection handler
 * @returns The element tree
 */
function fixture(value: Option, onValueChange: (next: Option) => void) {
	return (
		<>
			<Select value={value} onValueChange={onValueChange}>
				<SelectTrigger aria-label="Plan">
					<SelectValue placeholder="Pick a plan" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="free" label="Free" />
					<SelectItem value="pro" label="Pro" />
				</SelectContent>
			</Select>
			<PortalHost />
		</>
	);
}

describe("Select", () => {
	it("shows the placeholder when nothing is chosen", async () => {
		await render(fixture(undefined, () => undefined));
		expect(screen.getByText("Pick a plan")).toBeTruthy();
	});

	it("shows the chosen option's label", async () => {
		await render(fixture({ value: "pro", label: "Pro" }, () => undefined));
		expect(screen.getByText("Pro")).toBeTruthy();
		expect(screen.queryByText("Pick a plan")).toBeNull();
	});

	it("keeps the option list closed until the trigger is pressed", async () => {
		await render(fixture(undefined, () => undefined));
		expect(screen.queryByText("Free")).toBeNull();
	});

	it("marks the trigger expanded once open", async () => {
		const onValueChange = jest.fn();
		await render(fixture(undefined, onValueChange));
		const trigger = screen.getByRole("combobox", { name: "Plan" });
		await fireEvent.press(trigger);
		expect(trigger.props.accessibilityState.expanded).toBe(true);
	});
});
