import { describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { PortalHost } from "@rn-primitives/portal";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Button } from "../../primitives/button/button.js";
import { Text } from "../../primitives/text/text.js";
import {
	BottomSheet,
	BottomSheetClose,
	BottomSheetContent,
	BottomSheetDescription,
	BottomSheetTitle,
} from "./bottom-sheet.js";

/** Frame the safe-area provider needs in a test environment. */
const FRAME = { x: 0, y: 0, width: 390, height: 844 };
const INSETS = { top: 59, bottom: 34, left: 0, right: 0 };

/**
 * Render a sheet with the providers it needs: a safe-area context for the
 * bottom inset, and the PortalHost every overlay renders through.
 * @param open - Whether the sheet is open
 * @param onOpenChange - Open-state handler
 * @returns The element tree
 */
function fixture(open: boolean, onOpenChange: (next: boolean) => void) {
	return (
		<SafeAreaProvider initialMetrics={{ frame: FRAME, insets: INSETS }}>
			<BottomSheet open={open} onOpenChange={onOpenChange}>
				<BottomSheetContent testID="sheet">
					<BottomSheetTitle>Sort by</BottomSheetTitle>
					<BottomSheetDescription>Choose an order.</BottomSheetDescription>
					<BottomSheetClose asChild>
						<Button>
							<Text>Done</Text>
						</Button>
					</BottomSheetClose>
				</BottomSheetContent>
			</BottomSheet>
			<PortalHost />
		</SafeAreaProvider>
	);
}

describe("BottomSheet", () => {
	it("renders nothing while closed", async () => {
		await render(fixture(false, () => undefined));
		expect(screen.queryByText("Sort by")).toBeNull();
	});

	it("renders its title and description when open", async () => {
		await render(fixture(true, () => undefined));
		expect(screen.getByText("Sort by")).toBeTruthy();
		expect(screen.getByText("Choose an order.")).toBeTruthy();
	});

	it("closes from an explicit close control", async () => {
		const onOpenChange = jest.fn();
		await render(fixture(true, onOpenChange));
		await fireEvent.press(screen.getByText("Done"));
		expect(onOpenChange).toHaveBeenCalledWith(false);
	});

	// The last control must clear the home indicator, so the panel pads past
	// the bottom safe-area inset rather than sitting flush with the edge.
	it("pads its bottom past the safe-area inset", async () => {
		await render(fixture(true, () => undefined));
		const style: Array<Record<string, unknown>> = [screen.getByTestId("sheet").props.style].flat();
		const paddingBottom = style.find((s) => s && "paddingBottom" in s)?.paddingBottom;
		expect(paddingBottom).toBe(INSETS.bottom + 24);
	});

	it("anchors the panel to the bottom edge", async () => {
		await render(fixture(true, () => undefined));
		expect(screen.getByTestId("sheet").props.className).toContain("rounded-t-2xl");
	});
});
