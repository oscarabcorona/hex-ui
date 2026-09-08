import { describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { Text } from "../text/text.js";
import { Button } from "./button.js";

// `render` and `fireEvent` are both async in @testing-library/react-native 14.

describe("Button", () => {
	it("renders a button with its label as the accessible name", async () => {
		await render(
			<Button>
				<Text>Save</Text>
			</Button>,
		);
		expect(screen.getByRole("button", { name: "Save" })).toBeTruthy();
	});

	it("fires onPress", async () => {
		const onPress = jest.fn();
		await render(
			<Button onPress={onPress}>
				<Text>Save</Text>
			</Button>,
		);
		await fireEvent.press(screen.getByRole("button"));
		expect(onPress).toHaveBeenCalledTimes(1);
	});

	it("blocks presses and reports disabled when disabled", async () => {
		const onPress = jest.fn();
		await render(
			<Button disabled onPress={onPress}>
				<Text>Save</Text>
			</Button>,
		);
		const button = screen.getByRole("button");
		expect(button).toBeDisabled();
		await fireEvent.press(button);
		expect(onPress).not.toHaveBeenCalled();
	});

	it("treats loading as disabled and busy", async () => {
		const onPress = jest.fn();
		await render(
			<Button loading onPress={onPress}>
				<Text>Saving</Text>
			</Button>,
		);
		const button = screen.getByRole("button", { busy: true });
		expect(button).toBeDisabled();
		await fireEvent.press(button);
		expect(onPress).not.toHaveBeenCalled();
	});

	it("publishes the variant's label colour to its Text child", async () => {
		await render(
			<Button variant="destructive">
				<Text>Delete</Text>
			</Button>,
		);
		const className: string = screen.getByText("Delete").props.className;
		expect(className).toContain("text-destructive-foreground");
	});

	it("merges a consumer className after the variant classes", async () => {
		await render(
			<Button className="mt-4">
				<Text>Save</Text>
			</Button>,
		);
		const className: string = screen.getByRole("button").props.className;
		expect(className).toContain("bg-primary");
		expect(className).toContain("mt-4");
	});
});
