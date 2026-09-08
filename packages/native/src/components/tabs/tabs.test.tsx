import { describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { Text } from "../../primitives/text/text.js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs.js";

/**
 * Render a two-tab fixture with the given selection.
 * @param value - The selected tab value
 * @param onValueChange - Selection handler
 * @returns The element tree
 */
function fixture(value: string, onValueChange: (next: string) => void) {
	return (
		<Tabs value={value} onValueChange={onValueChange}>
			<TabsList>
				<TabsTrigger value="account">
					<Text>Account</Text>
				</TabsTrigger>
				<TabsTrigger value="billing">
					<Text>Billing</Text>
				</TabsTrigger>
			</TabsList>
			<TabsContent value="account">
				<Text>Account panel</Text>
			</TabsContent>
			<TabsContent value="billing">
				<Text>Billing panel</Text>
			</TabsContent>
		</Tabs>
	);
}

describe("Tabs", () => {
	it("renders only the selected panel", async () => {
		await render(fixture("account", () => undefined));
		expect(screen.getByText("Account panel")).toBeTruthy();
		expect(screen.queryByText("Billing panel")).toBeNull();
	});

	it("reports the next value when another tab is pressed", async () => {
		const onValueChange = jest.fn();
		await render(fixture("account", onValueChange));
		await fireEvent.press(screen.getByText("Billing"));
		expect(onValueChange).toHaveBeenCalledWith("billing");
	});

	it("styles the selected trigger's label with the foreground token", async () => {
		await render(fixture("account", () => undefined));
		expect(screen.getByText("Account").props.className).toContain("text-foreground");
		expect(screen.getByText("Billing").props.className).toContain("text-muted-foreground");
	});

	it("swaps the panel when the value changes", async () => {
		await render(fixture("billing", () => undefined));
		expect(screen.getByText("Billing panel")).toBeTruthy();
		expect(screen.queryByText("Account panel")).toBeNull();
	});
});
