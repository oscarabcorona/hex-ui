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
	// A GFM table's leaves are inline `text` nodes. The block renderer used to
	// recurse into them with renderBlock, which returns null for a childless
	// node, so a table in a streamed reply rendered as an empty gap.
	it("renders a GFM table's cell content", async () => {
		await render(<Markdown>{"| City | Temp |\n| --- | --- |\n| Oslo | 4 |"}</Markdown>);
		expect(screen.getByText(/Oslo/)).toBeTruthy();
		expect(screen.getByText(/City/)).toBeTruthy();
	});

	// An image carries its text in `alt`, not in children.
	it("renders an image's alt text", async () => {
		await render(<Markdown>{"![A bar chart of sales](https://example.com/c.png)"}</Markdown>);
		expect(screen.getByText("A bar chart of sales")).toBeTruthy();
	});

	// mdast records the first number in `start`; numbering from the index
	// silently renumbered a list the model deliberately began at 5.
	it("honours an ordered list's starting number", async () => {
		await render(<Markdown>{"5. five\n6. six"}</Markdown>);
		expect(screen.getByText("5.")).toBeTruthy();
		expect(screen.getByText("6.")).toBeTruthy();
	});
});
