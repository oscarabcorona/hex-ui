import { Skeleton } from "../../components/ui";

/** Skeleton demo: avatar + two lines of text placeholder. */
export function SkeletonDemo() {
	return (
		<div className="flex items-center gap-4" aria-busy="true">
			<Skeleton className="h-12 w-12 rounded-full" />
			<div className="space-y-2">
				<Skeleton className="h-4 w-[250px]" />
				<Skeleton className="h-4 w-[200px]" />
			</div>
		</div>
	);
}
