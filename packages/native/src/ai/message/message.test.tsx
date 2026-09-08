import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react-native";
import { Text } from "../../primitives/text/text.js";
import { Message } from "./message.js";

describe("Message", () => {
	it("renders its content", async () => {
		await render(
			<Message role="user">
				<Text>Hello</Text>
			</Message>,
		);
		expect(screen.getByText("Hello")).toBeTruthy();
	});

	it("aligns a user turn to the end and an assistant turn to the start", async () => {
		await render(
			<Message testID="bubble" role="user">
				<Text>Hi</Text>
			</Message>,
		);
		expect(screen.getByTestId("bubble").props.className).toContain("self-end");
	});

	it("publishes the role's text colour to its children", async () => {
		await render(
			<Message role="user">
				<Text>Hi</Text>
			</Message>,
		);
		expect(screen.getByText("Hi").props.className).toContain("text-primary-foreground");
	});

	it("defaults to the assistant role", async () => {
		await render(
			<Message testID="bubble">
				<Text>Hi</Text>
			</Message>,
		);
		expect(screen.getByTestId("bubble").props.className).toContain("self-start");
	});

	// Grouping matters: without it VoiceOver reads a bubble's fragments as
	// separate elements instead of one turn.
	it("groups the bubble as a single accessibility element", async () => {
		await render(
			<Message testID="bubble" role="assistant">
				<Text>Hi</Text>
			</Message>,
		);
		expect(screen.getByTestId("bubble").props.accessible).toBe(true);
	});
});
