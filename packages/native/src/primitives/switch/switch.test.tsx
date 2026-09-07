import { describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { Switch } from "./switch.js";

describe("Switch", () => {
	it("exposes a switch role with its state", async () => {
		await render(
			<Switch aria-label="Notifications" checked onCheckedChange={() => undefined} />,
		);
		expect(screen.getByRole("switch", { name: "Notifications", checked: true })).toBeTruthy();
	});

	it("reports the next value on press", async () => {
		const onCheckedChange = jest.fn();
		await render(
			<Switch aria-label="Notifications" checked={false} onCheckedChange={onCheckedChange} />,
		);
		await fireEvent.press(screen.getByRole("switch"));
		expect(onCheckedChange).toHaveBeenCalledWith(true);
	});

	it("does not fire when disabled", async () => {
		const onCheckedChange = jest.fn();
		await render(
			<Switch
				aria-label="Notifications"
				checked={false}
				disabled
				onCheckedChange={onCheckedChange}
			/>,
		);
		await fireEvent.press(screen.getByRole("switch"));
		expect(onCheckedChange).not.toHaveBeenCalled();
	});

	it("fills the track when on", async () => {
		await render(
			<Switch aria-label="Notifications" checked onCheckedChange={() => undefined} />,
		);
		expect(screen.getByRole("switch").props.className).toContain("bg-primary");
	});

	it("uses the input track colour when off", async () => {
		await render(
			<Switch aria-label="Notifications" checked={false} onCheckedChange={() => undefined} />,
		);
		expect(screen.getByRole("switch").props.className).toContain("bg-input");
	});
});
