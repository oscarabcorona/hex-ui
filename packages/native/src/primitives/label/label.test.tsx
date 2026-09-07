import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react-native";
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
});
