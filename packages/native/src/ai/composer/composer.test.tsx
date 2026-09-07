import { describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { Composer } from "./composer.js";

describe("Composer", () => {
	it("reports edits through onChangeText", async () => {
		const onChangeText = jest.fn();
		await render(<Composer value="" onChangeText={onChangeText} onSubmit={() => undefined} />);
		await fireEvent.changeText(screen.getByPlaceholderText("Message…"), "hello");
		expect(onChangeText).toHaveBeenCalledWith("hello");
	});

	it("disables send while the draft is empty", async () => {
		await render(<Composer value="   " onChangeText={() => undefined} onSubmit={() => undefined} />);
		expect(screen.getByRole("button", { name: "Send message" })).toBeDisabled();
	});

	it("sends the trimmed draft", async () => {
		const onSubmit = jest.fn();
		await render(<Composer value="  hello  " onChangeText={() => undefined} onSubmit={onSubmit} />);
		await fireEvent.press(screen.getByRole("button", { name: "Send message" }));
		expect(onSubmit).toHaveBeenCalledWith("hello");
	});

	it("blocks input and send while busy", async () => {
		const onSubmit = jest.fn();
		await render(<Composer value="hello" onChangeText={() => undefined} onSubmit={onSubmit} busy />);
		const send = screen.getByRole("button", { name: "Send message" });
		expect(send).toBeDisabled();
		await fireEvent.press(send);
		expect(onSubmit).not.toHaveBeenCalled();
		expect(screen.getByPlaceholderText("Message…").props.editable).toBe(false);
	});

	it("takes a custom send label", async () => {
		await render(
			<Composer value="hi" onChangeText={() => undefined} onSubmit={() => undefined} sendLabel="Ask" />,
		);
		expect(screen.getByRole("button", { name: "Ask" })).toBeTruthy();
	});

	// Return inserts a newline: a phone keyboard has no modifier to tell send
	// from newline, so the button is the only send affordance.
	it("keeps the field multiline so Return inserts a newline", async () => {
		await render(<Composer value="" onChangeText={() => undefined} onSubmit={() => undefined} />);
		expect(screen.getByPlaceholderText("Message…").props.multiline).toBe(true);
	});
});
