import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react-native";
import { Text } from "../../primitives/text/text.js";
import { Message } from "../message/message.js";
import { MessageList } from "./message-list.js";

interface Turn {
	id: string;
	role: "user" | "assistant";
	content: string;
}

const TURNS: Turn[] = [
	{ id: "1", role: "user", content: "First question" },
	{ id: "2", role: "assistant", content: "First answer" },
	{ id: "3", role: "user", content: "Second question" },
];

/**
 * Render the list over a fixture conversation.
 * @param footer - Optional footer element
 * @returns The element tree
 */
function fixture(footer?: React.ReactElement | null) {
	return (
		<MessageList
			messages={TURNS}
			keyExtractor={(turn) => turn.id}
			footer={footer}
			renderMessage={(turn) => (
				<Message role={turn.role}>
					<Text>{turn.content}</Text>
				</Message>
			)}
		/>
	);
}

describe("MessageList", () => {
	it("renders every turn", async () => {
		await render(fixture());
		expect(screen.getByText("First question")).toBeTruthy();
		expect(screen.getByText("First answer")).toBeTruthy();
		expect(screen.getByText("Second question")).toBeTruthy();
	});

	it("renders inverted so the newest turn sits at the bottom", async () => {
		await render(fixture());
		expect(screen.getByTestId("message-list").props.inverted).toBe(true);
	});

	// The caller passes messages oldest-first; the list reverses internally.
	// If that contract broke, the index handed to renderMessage would be wrong.
	it("hands renderMessage the index in the caller's ordering", async () => {
		const seen: Array<{ id: string; index: number }> = [];
		await render(
			<MessageList
				messages={TURNS}
				keyExtractor={(turn) => turn.id}
				renderMessage={(turn, index) => {
					seen.push({ id: turn.id, index });
					return (
						<Message role={turn.role}>
							<Text>{turn.content}</Text>
						</Message>
					);
				}}
			/>,
		);
		expect(seen.find((entry) => entry.id === "1")?.index).toBe(0);
		expect(seen.find((entry) => entry.id === "3")?.index).toBe(2);
	});

	it("renders a footer under the newest turn", async () => {
		await render(fixture(<Text>Typing…</Text>));
		expect(screen.getByText("Typing…")).toBeTruthy();
	});

	it("renders nothing extra without a footer", async () => {
		await render(fixture());
		expect(screen.queryByText("Typing…")).toBeNull();
	});
});
