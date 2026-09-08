import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react-native";
import { Skeleton } from "./skeleton.js";

describe("Skeleton", () => {
	it("renders with the muted background", async () => {
		await render(<Skeleton testID="sk" className="h-4 w-32" />);
		const className: string = screen.getByTestId("sk").props.className;
		expect(className).toContain("bg-muted");
		expect(className).toContain("h-4");
	});

	it("merges a consumer className over the defaults", async () => {
		await render(<Skeleton testID="sk" className="rounded-full" />);
		const className: string = screen.getByTestId("sk").props.className;
		expect(className).toContain("rounded-full");
		expect(className).not.toContain("rounded-md");
	});

	it("renders without animation when asked", async () => {
		await render(<Skeleton testID="sk" animated={false} />);
		expect(screen.getByTestId("sk")).toBeTruthy();
	});
});
