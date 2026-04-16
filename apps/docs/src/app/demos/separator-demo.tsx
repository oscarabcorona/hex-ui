import { Separator } from "../../components/ui";

export function SeparatorDemo() {
	return (
		<div className="w-full space-y-4">
			<div>
				<h4 className="mb-2 text-sm font-medium">Horizontal</h4>
				<Separator />
			</div>
			<div>
				<h4 className="mb-2 text-sm font-medium">Vertical (in flex row)</h4>
				<div className="flex h-5 items-center gap-4 text-sm">
					<span>Blog</span>
					<Separator orientation="vertical" />
					<span>Docs</span>
					<Separator orientation="vertical" />
					<span>Source</span>
				</div>
			</div>
		</div>
	);
}
