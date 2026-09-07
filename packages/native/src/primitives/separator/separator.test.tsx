import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react-native";
import { Separator } from "./separator.js";

// A decorative separator sets aria-hidden, and RNTL excludes hidden elements
// from queries — hence `includeHiddenElements` on the default-state lookups.
describe("Separator", () => {
	it("renders a full-width hairline by default", async () => {
		await render(<Separator testID="sep" />);
		const className: string = screen.getByTestId("sep", { includeHiddenElements: true }).props
			.className;
		expect(className).toContain("h-px");
		expect(className).toContain("w-full");
		expect(className).toContain("bg-border");
	});

	it("switches to a vertical hairline", async () => {
		await render(<Separator testID="sep" orientation="vertical" className="h-4" />);
		const className: string = screen.getByTestId("sep", { includeHiddenElements: true }).props
			.className;
		expect(className).toContain("w-px");
		expect(className).toContain("h-4");
	});

	it("is hidden from assistive tech by default", async () => {
		await render(<Separator testID="sep" />);
		expect(screen.queryByRole("separator")).toBeNull();
	});

	it("stops hiding itself when not decorative", async () => {
		await render(<Separator testID="sep" decorative={false} />);
		const element = screen.getByTestId("sep");
		expect(element.props["aria-hidden"]).toBe(false);
		expect(element.props.role).toBe("separator");
	});
});
