import { Input, Label } from "../../components/ui";

/** Label paired with an Input, demonstrating form field composition. */
export function LabelDemo() {
	return (
		<div className="grid w-full max-w-sm gap-1.5">
			<Label htmlFor="email">Email</Label>
			<Input id="email" type="email" placeholder="you@example.com" />
		</div>
	);
}
