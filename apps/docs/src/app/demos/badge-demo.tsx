import { Badge } from "../../components/ui";

export function BadgeDemo() {
	return (
		<div className="flex flex-wrap items-center gap-3">
			<Badge>Default</Badge>
			<Badge variant="secondary">Secondary</Badge>
			<Badge variant="destructive">Error</Badge>
			<Badge variant="outline">Outline</Badge>
		</div>
	);
}
