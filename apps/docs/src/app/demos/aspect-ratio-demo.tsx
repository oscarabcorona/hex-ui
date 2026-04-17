import { AspectRatio } from "../../components/ui";

/** AspectRatio demo: 16:9 placeholder image. */
export function AspectRatioDemo() {
	return (
		<div className="w-full max-w-md">
			<AspectRatio ratio={16 / 9} className="overflow-hidden rounded-md bg-muted">
				<div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-muted text-sm text-muted-foreground">
					16 : 9
				</div>
			</AspectRatio>
		</div>
	);
}
