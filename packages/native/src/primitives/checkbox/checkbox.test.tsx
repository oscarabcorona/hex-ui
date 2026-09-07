import { describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { Checkbox } from "./checkbox.js";

describe("Checkbox", () => {
	it("exposes a checkbox role with its checked state", async () => {
		await render(<Checkbox aria-label="Accept" checked onCheckedChange={() => undefined} />);
		expect(screen.getByRole("checkbox", { name: "Accept", checked: true })).toBeTruthy();
	});

	it("reports the next value on press", async () => {
		const onCheckedChange = jest.fn();
		await render(
			<Checkbox aria-label="Accept" checked={false} onCheckedChange={onCheckedChange} />,
		);
		await fireEvent.press(screen.getByRole("checkbox"));
		expect(onCheckedChange).toHaveBeenCalledWith(true);
	});

	it("does not fire when disabled", async () => {
		const onCheckedChange = jest.fn();
		await render(
			<Checkbox aria-label="Accept" checked={false} disabled onCheckedChange={onCheckedChange} />,
		);
		await fireEvent.press(screen.getByRole("checkbox"));
		expect(onCheckedChange).not.toHaveBeenCalled();
	});

	it("extends its touch target past the 16pt box", async () => {
		await render(<Checkbox aria-label="Accept" checked onCheckedChange={() => undefined} />);
		expect(screen.getByRole("checkbox").props.hitSlop).toBe(12);
	});

	it("marks the border when checked", async () => {
		await render(<Checkbox aria-label="Accept" checked onCheckedChange={() => undefined} />);
		expect(screen.getByRole("checkbox").props.className).toContain("border-primary");
	});
});
