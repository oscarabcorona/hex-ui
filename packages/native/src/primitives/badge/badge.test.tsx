import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react-native";
import { Text } from "../text/text.js";
import { Badge } from "./badge.js";

describe("Badge", () => {
	it("renders its label", async () => {
		await render(
			<Badge>
				<Text>New</Text>
			</Badge>,
		);
		expect(screen.getByText("New")).toBeTruthy();
	});

	it("publishes the variant's label colour to its Text child", async () => {
		await render(
			<Badge variant="secondary">
				<Text>Beta</Text>
			</Badge>,
		);
		expect(screen.getByText("Beta").props.className).toContain("text-secondary-foreground");
	});

	it("uses the foreground colour for the outline variant", async () => {
		await render(
			<Badge variant="outline">
				<Text>Draft</Text>
			</Badge>,
		);
		expect(screen.getByText("Draft").props.className).toContain("text-foreground");
	});

	// React Native only exposes a View to assistive tech when `accessible` is
	// set, so a live badge needs both props — the role alone is inert.
	it("exposes a status role when marked accessible", async () => {
		await render(
			<Badge accessible role="status">
				<Text>Running</Text>
			</Badge>,
		);
		expect(screen.getByRole("status")).toBeTruthy();
	});
});
