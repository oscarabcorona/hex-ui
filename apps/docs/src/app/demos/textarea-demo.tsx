import { Textarea } from "../../components/ui";

export function TextareaDemo() {
	return (
		<div className="flex w-full max-w-sm flex-col gap-3">
			<Textarea placeholder="Write your message..." />
			<Textarea disabled placeholder="Disabled" />
		</div>
	);
}
