import { describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { Label } from "./label.js";

describe("Label", () => {
	it("renders its text", async () => {
		await render(<Label nativeID="email">Email address</Label>);
		expect(screen.getByText("Email address")).toBeTruthy();
	});

	it("carries the nativeID a control points at", async () => {
		await render(<Label nativeID="email">Email address</Label>);
		expect(screen.getByText("Email address").props.nativeID).toBe("email");
	});

	it("uses the foreground colour at label weight", async () => {
		await render(<Label nativeID="email">Email address</Label>);
		const className: string = screen.getByText("Email address").props.className;
		expect(className).toContain("text-foreground");
		expect(className).toContain("font-medium");
	});

	it("merges a consumer className", async () => {
		await render(
			<Label nativeID="email" className="text-destructive">
				Email address
			</Label>,
		);
		expect(screen.getByText("Email address").props.className).toContain("text-destructive");
	});

	it("renders a disabled label", async () => {
		await render(
			<Label nativeID="plan" disabled>
				Plan
			</Label>,
		);
		expect(screen.getByText("Plan")).toBeTruthy();
	});

	// aria-labelledby carries the accessible name and nothing else, so three
	// schemas used to promise a label tap that no code delivered. The press is
	// now explicit, and these two lock it.
	it("calls onPress when the caption is tapped", async () => {
		const onPress = jest.fn();
		await render(
			<Label nativeID="terms" onPress={onPress}>
				I agree
			</Label>,
		);
		await fireEvent.press(screen.getByText("I agree"));
		expect(onPress).toHaveBeenCalledTimes(1);
	});

	it("does not call onPress while disabled", async () => {
		const onPress = jest.fn();
		await render(
			<Label nativeID="terms" onPress={onPress} disabled>
				I agree
			</Label>,
		);
		await fireEvent.press(screen.getByText("I agree"));
		expect(onPress).not.toHaveBeenCalled();
	});
});
