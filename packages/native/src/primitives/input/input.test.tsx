import { describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { Input } from "./input.js";

describe("Input", () => {
	it("reports edits as a plain string through onChangeText", async () => {
		const onChangeText = jest.fn();
		await render(<Input testID="field" onChangeText={onChangeText} />);
		await fireEvent.changeText(screen.getByTestId("field"), "ada@example.test");
		expect(onChangeText).toHaveBeenCalledWith("ada@example.test");
	});

	it("is editable by default", async () => {
		await render(<Input testID="field" />);
		expect(screen.getByTestId("field").props.editable).toBe(true);
	});

	it("dims itself when not editable", async () => {
		await render(<Input testID="field" editable={false} />);
		const field = screen.getByTestId("field");
		expect(field.props.editable).toBe(false);
		expect(field.props.className).toContain("opacity-50");
	});

	it("takes its accessible name from a label id", async () => {
		await render(<Input testID="field" aria-labelledby="email" />);
		expect(screen.getByTestId("field").props["aria-labelledby"]).toBe("email");
	});

	it("forwards the mobile keyboard hints", async () => {
		await render(
			<Input
				testID="field"
				keyboardType="email-address"
				autoCapitalize="none"
				secureTextEntry={false}
			/>,
		);
		const field = screen.getByTestId("field");
		expect(field.props.keyboardType).toBe("email-address");
		expect(field.props.autoCapitalize).toBe("none");
	});

	it("merges a consumer className over the defaults", async () => {
		await render(<Input testID="field" className="border-destructive" />);
		const className: string = screen.getByTestId("field").props.className;
		expect(className).toContain("border-destructive");
		expect(className).not.toContain("border-input");
	});
});
