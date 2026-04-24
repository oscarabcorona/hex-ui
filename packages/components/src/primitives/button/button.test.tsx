import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./button.js";

describe("Button", () => {
	it("renders its children as accessible button text", () => {
		render(<Button>Save</Button>);
		expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
	});

	it("applies the default variant class when no variant is passed", () => {
		render(<Button>Save</Button>);
		expect(screen.getByRole("button")).toHaveClass("bg-primary");
	});

	it("applies the destructive variant class", () => {
		render(<Button variant="destructive">Delete</Button>);
		expect(screen.getByRole("button")).toHaveClass("bg-destructive");
	});

	it("applies the small size class", () => {
		render(<Button size="sm">Small</Button>);
		expect(screen.getByRole("button")).toHaveClass("h-9");
	});

	it("disables the button and sets aria-busy when loading", () => {
		render(<Button loading>Saving</Button>);
		const btn = screen.getByRole("button", { name: "Saving" });
		expect(btn).toBeDisabled();
		expect(btn).toHaveAttribute("aria-busy", "true");
	});

	it("fires onClick when activated by keyboard", async () => {
		const onClick = vi.fn();
		render(<Button onClick={onClick}>Go</Button>);
		await userEvent.tab();
		await userEvent.keyboard("{Enter}");
		expect(onClick).toHaveBeenCalledOnce();
	});

	it("does not fire onClick when disabled", async () => {
		const onClick = vi.fn();
		render(
			<Button onClick={onClick} disabled>
				Nope
			</Button>,
		);
		await userEvent.click(screen.getByRole("button"));
		expect(onClick).not.toHaveBeenCalled();
	});

	it("forwards ref to the underlying button element", () => {
		const ref = { current: null } as React.MutableRefObject<HTMLButtonElement | null>;
		render(<Button ref={ref}>Ref</Button>);
		expect(ref.current).toBeInstanceOf(HTMLButtonElement);
	});

	it("renders as child component when asChild is true", () => {
		render(
			<Button asChild>
				<a href="/home">Home</a>
			</Button>,
		);
		expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
	});
});
