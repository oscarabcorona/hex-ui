import { View } from "react-native";
import { Text } from "../text/text.js";
import { Skeleton } from "./skeleton.js";

/**
 * A loading list row and a loading card body.
 */
export function SkeletonDemo() {
	return (
		<View className="w-full max-w-md gap-6">
			<View className="gap-2">
				<Text variant="muted">List row</Text>
				<View className="flex-row items-center gap-3" aria-busy>
					<Skeleton className="h-10 w-10 rounded-full" />
					<View className="flex-1 gap-2">
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-3 w-40" />
					</View>
				</View>
			</View>

			<View className="gap-2">
				<Text variant="muted">Paragraph</Text>
				<View className="gap-2" aria-busy>
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-2/3" />
				</View>
			</View>
		</View>
	);
}
