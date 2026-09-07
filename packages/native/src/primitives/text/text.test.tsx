import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react-native";
import { TextClassContext } from "../../lib/text-context.js";
import { Text } from "./text.js";

// `render` is async in @testing-library/react-native 14 — it awaits `act`
// internally, so every call site must await it or `screen` stays unset.

describe("Text", () => {
	it("renders its children", async () => {
		await render(<Text>Hello</Text>);
		expect(screen.getByText("Hello")).toBeTruthy();
	});

	it("announces heading variants as headings", async () => {
		await render(<Text variant="h2">Account</Text>);
		expect(screen.getByRole("heading", { name: "Account" })).toBeTruthy();
	});

	it("gives body text no role", async () => {
		await render(<Text>Body</Text>);
		expect(screen.getByText("Body").props.role).toBeUndefined();
	});

	it("merges classes published by a styling parent", async () => {
		await render(
			<TextClassContext.Provider value="text-primary-foreground">
				<Text className="font-bold">Label</Text>
			</TextClassContext.Provider>,
		);
		const className: string = screen.getByText("Label").props.className;
		expect(className).toContain("text-primary-foreground");
		expect(className).toContain("font-bold");
	});

	it("lets an explicit className win over an inherited conflict", async () => {
		await render(
			<TextClassContext.Provider value="text-sm">
				<Text className="text-lg">Label</Text>
			</TextClassContext.Provider>,
		);
		const className: string = screen.getByText("Label").props.className;
		expect(className).toContain("text-lg");
		expect(className).not.toContain("text-sm");
	});

	it("forwards React Native Text props", async () => {
		await render(
			<Text numberOfLines={1} selectable>
				Row
			</Text>,
		);
		const element = screen.getByText("Row");
		expect(element.props.numberOfLines).toBe(1);
		expect(element.props.selectable).toBe(true);
	});
});
