import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react-native";
import { Markdown } from "./markdown.js";

describe("Markdown", () => {
	it("renders paragraph text", async () => {
		await render(<Markdown>{"Hello there."}</Markdown>);
		expect(screen.getByText("Hello there.")).toBeTruthy();
	});

	it("announces headings as headings", async () => {
		await render(<Markdown>{"## Setup"}</Markdown>);
		expect(screen.getByRole("heading", { name: "Setup" })).toBeTruthy();
	});

	it("renders bullet lists with markers", async () => {
		await render(<Markdown>{"- one\n- two"}</Markdown>);
		expect(screen.getByText("one")).toBeTruthy();
		expect(screen.getByText("two")).toBeTruthy();
		expect(screen.getAllByText("•")).toHaveLength(2);
	});

	it("numbers ordered lists", async () => {
		await render(<Markdown>{"1. first\n2. second"}</Markdown>);
		expect(screen.getByText("1.")).toBeTruthy();
		expect(screen.getByText("2.")).toBeTruthy();
	});

	it("renders fenced code selectably", async () => {
		await render(<Markdown>{"```ts\nconst x = 1;\n```"}</Markdown>);
		const block = screen.getByText("const x = 1;");
		expect(block.props.selectable).toBe(true);
	});

	it("renders links with a link role", async () => {
		await render(<Markdown>{"[docs](https://hex-core.dev)"}</Markdown>);
		expect(screen.getByRole("link")).toBeTruthy();
	});

	it("renders GitHub task lists", async () => {
		await render(<Markdown>{"- [x] done\n- [ ] todo"}</Markdown>);
		expect(screen.getByText("☑")).toBeTruthy();
		expect(screen.getByText("☐")).toBeTruthy();
	});

	// Streaming safety: the guarantee is that partial markup renders as text
	// rather than throwing, so a reply can be re-rendered on every token.
	it.each([
		["unterminated bold", "This is **partial"],
		["unterminated fence", "```ts\nconst x = 1;"],
		["dangling link", "See [the docs]("],
		["unterminated inline code", "Run `npm inst"],
		["empty string", ""],
	])("renders %s without throwing", async (_label, source) => {
		await expect(render(<Markdown>{source}</Markdown>)).resolves.toBeDefined();
	});

	it("shows raw HTML as text rather than interpreting it", async () => {
		await render(<Markdown>{"<script>alert(1)</script>"}</Markdown>);
		expect(screen.getByText("<script>alert(1)</script>")).toBeTruthy();
	});
});
