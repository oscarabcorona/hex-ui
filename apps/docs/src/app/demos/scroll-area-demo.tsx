import { ScrollArea } from "../../components/ui";

const tags = Array.from({ length: 50 }).map((_, i) => `v1.2.0-beta.${50 - i}`);

/** ScrollArea demo: tag list in a fixed-height scrollable region. */
export function ScrollAreaDemo() {
	return (
		<ScrollArea className="h-72 w-48 rounded-md border">
			<div className="p-4">
				<h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
				{tags.map((tag) => (
					<div key={tag} className="text-sm">
						{tag}
						<div className="my-2 h-px w-full bg-border" />
					</div>
				))}
			</div>
		</ScrollArea>
	);
}
