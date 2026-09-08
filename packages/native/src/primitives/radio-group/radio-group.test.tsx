import { describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { View } from "react-native";
import { Label } from "../label/label.js";
import { RadioGroup, RadioGroupItem } from "./radio-group.js";

/**
 * Render a two-option group with the given selection.
 * @param value - Selected option id
 * @param onValueChange - Selection handler
 * @returns The element tree
 */
function fixture(value: string, onValueChange: (next: string) => void) {
	return (
		<RadioGroup value={value} onValueChange={onValueChange}>
			<View className="flex-row items-center gap-2">
				<RadioGroupItem value="free" aria-labelledby="plan-free" testID="item-free" />
				<Label nativeID="plan-free">Free</Label>
			</View>
			<View className="flex-row items-center gap-2">
				<RadioGroupItem value="pro" aria-labelledby="plan-pro" testID="item-pro" />
				<Label nativeID="plan-pro">Pro</Label>
			</View>
		</RadioGroup>
	);
}

describe("RadioGroup", () => {
	// The root carries role="radiogroup" but is not an accessibility element,
	// so it is not queryable — and not announced on a device either. The
	// items are Pressables, and they are what assistive tech reads.
	it("exposes each option as a radio", async () => {
		await render(fixture("free", () => undefined));
		expect(screen.getAllByRole("radio")).toHaveLength(2);
	});

	// The primitive reports state through the legacy `accessibilityState`
	// rather than the `aria-checked` alias.
	it("reports the selected option", async () => {
		await render(fixture("free", () => undefined));
		expect(screen.getByTestId("item-free").props.accessibilityState.checked).toBe(true);
		expect(screen.getByTestId("item-pro").props.accessibilityState.checked).toBe(false);
	});

	it("marks the selected item as checked for assistive tech", async () => {
		await render(fixture("pro", () => undefined));
		expect(screen.getByRole("radio", { checked: true })).toBeTruthy();
	});

	it("reports the next value when another option is pressed", async () => {
		const onValueChange = jest.fn();
		await render(fixture("free", onValueChange));
		await fireEvent.press(screen.getByTestId("item-pro"));
		expect(onValueChange).toHaveBeenCalledWith("pro");
	});

	it("carries the label association for assistive tech", async () => {
		await render(fixture("free", () => undefined));
		expect(screen.getByTestId("item-free").props["aria-labelledby"]).toBe("plan-free");
	});

	it("extends the touch target past the 20pt dot", async () => {
		await render(fixture("free", () => undefined));
		expect(screen.getByTestId("item-free").props.hitSlop).toBe(10);
	});
});
