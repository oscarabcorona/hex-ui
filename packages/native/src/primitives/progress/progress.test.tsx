import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react-native";
import { Progress } from "./progress.js";

describe("Progress", () => {
	it("exposes a progressbar role with its name", async () => {
		await render(<Progress value={40} aria-label="Upload progress" />);
		expect(screen.getByRole("progressbar", { name: "Upload progress" })).toBeTruthy();
	});

	it("reports the current value and range", async () => {
		await render(<Progress value={40} aria-label="Upload progress" />);
		const bar = screen.getByRole("progressbar");
		expect(bar.props["aria-valuenow"]).toBe(40);
		expect(bar.props["aria-valuemax"]).toBe(100);
	});

	it("honours a custom max", async () => {
		await render(<Progress value={2} max={5} aria-label="Step 2 of 5" />);
		const bar = screen.getByRole("progressbar");
		expect(bar.props["aria-valuenow"]).toBe(2);
		expect(bar.props["aria-valuemax"]).toBe(5);
	});

	it("draws the track in the secondary colour", async () => {
		await render(<Progress value={40} aria-label="Upload progress" />);
		expect(screen.getByRole("progressbar").props.className).toContain("bg-secondary");
	});

	it("accepts a value of zero without error", async () => {
		await render(<Progress value={0} aria-label="Upload progress" />);
		expect(screen.getByRole("progressbar").props["aria-valuenow"]).toBe(0);
	});
});
