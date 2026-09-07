import { describe, expect, it } from "@jest/globals";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { ToolCall } from "./tool-call.js";

describe("ToolCall", () => {
	it("shows the tool name and its status", async () => {
		await render(<ToolCall name="search_flights" state="success" />);
		expect(screen.getByText("search_flights")).toBeTruthy();
		expect(screen.getByText("Done")).toBeTruthy();
	});

	// The status must not rest on colour alone, so the accessible name carries
	// both the tool and its state.
	it("names the row with the tool and its status", async () => {
		await render(<ToolCall name="search_flights" state="running" args={{}} />);
		expect(screen.getByRole("button", { name: "search_flights, Running" })).toBeTruthy();
	});

	it("hides the detail until expanded", async () => {
		await render(<ToolCall name="search_flights" state="success" args={{ from: "LHR" }} />);
		expect(screen.queryByText("Arguments")).toBeNull();
		await fireEvent.press(screen.getByRole("button"));
		expect(screen.getByText("Arguments")).toBeTruthy();
	});

	it("can start expanded", async () => {
		await render(
			<ToolCall name="book_flight" state="error" args={{ id: "BA117" }} defaultOpen />,
		);
		expect(screen.getByText("Arguments")).toBeTruthy();
	});

	it("is not pressable when there is nothing to expand", async () => {
		await render(<ToolCall name="search_flights" state="pending" />);
		expect(screen.getByRole("button")).toBeDisabled();
	});

	it("renders a result that is a plain string", async () => {
		await render(
			<ToolCall name="book_flight" state="error" result="Payment declined" defaultOpen />,
		);
		expect(screen.getByText("Payment declined")).toBeTruthy();
	});

	it("colours the failed status with the destructive token", async () => {
		await render(<ToolCall name="book_flight" state="error" />);
		expect(screen.getByText("Failed").props.className).toContain("text-destructive");
	});
});
