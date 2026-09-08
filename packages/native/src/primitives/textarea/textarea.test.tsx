import { describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { Textarea } from "./textarea.js";

describe("Textarea", () => {
	it("is multiline", async () => {
		await render(<Textarea testID="field" />);
		expect(screen.getByTestId("field").props.multiline).toBe(true);
	});

	it("starts text at the top rather than the vertical centre", async () => {
		await render(<Textarea testID="field" />);
		expect(screen.getByTestId("field").props.textAlignVertical).toBe("top");
	});

	it("reports edits through onChangeText", async () => {
		const onChangeText = jest.fn();
		await render(<Textarea testID="field" onChangeText={onChangeText} />);
		await fireEvent.changeText(screen.getByTestId("field"), "some notes");
		expect(onChangeText).toHaveBeenCalledWith("some notes");
	});

	it("dims itself when not editable", async () => {
		await render(<Textarea testID="field" editable={false} />);
		const field = screen.getByTestId("field");
		expect(field.props.editable).toBe(false);
		expect(field.props.className).toContain("opacity-50");
	});

	it("merges a consumer className over the defaults", async () => {
		await render(<Textarea testID="field" className="min-h-40" />);
		const className: string = screen.getByTestId("field").props.className;
		expect(className).toContain("min-h-40");
		expect(className).not.toContain("min-h-20");
	});
});
