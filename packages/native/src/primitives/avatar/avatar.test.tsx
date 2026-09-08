import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react-native";
import { Text } from "../text/text.js";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar.js";

// The primitive starts in the "error" state and only leaves it when an
// AvatarImage is given a valid source. So the fallback is the no-image state,
// and the image replaces it once a source is present.

// A data URI rather than an http one. The primitive only checks that
// `source.uri` is truthy and the jest preset mocks `Image`, so nothing here
// fetches either way — this just keeps a network address out of a test that
// has no business naming one.
const DATA_URI =
	"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

describe("Avatar", () => {
	it("shows the fallback when there is no image", async () => {
		await render(
			<Avatar alt="Ada Lovelace's profile picture">
				<AvatarFallback>
					<Text>AL</Text>
				</AvatarFallback>
			</Avatar>,
		);
		expect(screen.getByText("AL")).toBeTruthy();
	});

	it("names the fallback with the root's alt text", async () => {
		await render(
			<Avatar alt="Ada Lovelace's profile picture">
				<AvatarFallback testID="fallback">
					<Text>AL</Text>
				</AvatarFallback>
			</Avatar>,
		);
		const fallback = screen.getByTestId("fallback");
		expect(fallback.props["aria-label"]).toBe("Ada Lovelace's profile picture");
		expect(fallback.props.role).toBe("img");
	});

	it("renders the image instead of the fallback once a source is given", async () => {
		await render(
			<Avatar alt="Ada Lovelace's profile picture">
				<AvatarImage testID="image" source={{ uri: DATA_URI }} />
				<AvatarFallback>
					<Text>AL</Text>
				</AvatarFallback>
			</Avatar>,
		);
		expect(screen.getByTestId("image").props.alt).toBe("Ada Lovelace's profile picture");
		expect(screen.queryByText("AL")).toBeNull();
	});

	it("is circular and clips its contents by default", async () => {
		await render(
			<Avatar testID="avatar" alt="Ada Lovelace's profile picture">
				<AvatarFallback>
					<Text>AL</Text>
				</AvatarFallback>
			</Avatar>,
		);
		const className: string = screen.getByTestId("avatar").props.className;
		expect(className).toContain("rounded-full");
		expect(className).toContain("overflow-hidden");
	});

	it("styles fallback initials through the text context", async () => {
		await render(
			<Avatar alt="Ada Lovelace's profile picture">
				<AvatarFallback>
					<Text>AL</Text>
				</AvatarFallback>
			</Avatar>,
		);
		expect(screen.getByText("AL").props.className).toContain("text-muted-foreground");
	});

	it("accepts a size override on the root", async () => {
		await render(
			<Avatar testID="avatar" alt="Ada Lovelace's profile picture" className="size-16">
				<AvatarFallback>
					<Text>AL</Text>
				</AvatarFallback>
			</Avatar>,
		);
		const className: string = screen.getByTestId("avatar").props.className;
		expect(className).toContain("size-16");
		expect(className).not.toContain("size-10");
	});
});
