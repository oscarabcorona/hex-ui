import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react-native";
import { Text } from "../../primitives/text/text.js";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "./card.js";

describe("Card", () => {
	it("renders every slot's content", async () => {
		await render(
			<Card>
				<CardHeader>
					<CardTitle>Storage</CardTitle>
					<CardDescription>94% of 10 GB used</CardDescription>
				</CardHeader>
				<CardContent>
					<Text>Body</Text>
				</CardContent>
				<CardFooter>
					<Text>Footer</Text>
				</CardFooter>
			</Card>,
		);
		expect(screen.getByText("Storage")).toBeTruthy();
		expect(screen.getByText("94% of 10 GB used")).toBeTruthy();
		expect(screen.getByText("Body")).toBeTruthy();
		expect(screen.getByText("Footer")).toBeTruthy();
	});

	it("announces the title as a heading", async () => {
		await render(
			<Card>
				<CardHeader>
					<CardTitle>Storage</CardTitle>
				</CardHeader>
			</Card>,
		);
		expect(screen.getByRole("heading", { name: "Storage" })).toBeTruthy();
	});

	it("draws a bordered card surface", async () => {
		await render(
			<Card testID="card">
				<CardContent>
					<Text>Body</Text>
				</CardContent>
			</Card>,
		);
		const className: string = screen.getByTestId("card").props.className;
		expect(className).toContain("bg-card");
		expect(className).toContain("border-border");
	});

	it("publishes the card foreground colour to plain body text", async () => {
		await render(
			<Card>
				<CardContent>
					<Text>Body</Text>
				</CardContent>
			</Card>,
		);
		expect(screen.getByText("Body").props.className).toContain("text-card-foreground");
	});

	it("keeps the description muted", async () => {
		await render(
			<Card>
				<CardHeader>
					<CardDescription>Subtitle</CardDescription>
				</CardHeader>
			</Card>,
		);
		expect(screen.getByText("Subtitle").props.className).toContain("text-muted-foreground");
	});
});
