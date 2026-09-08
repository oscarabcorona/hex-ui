import { View } from "react-native";
import { Button } from "../../primitives/button/button.js";
import { Progress } from "../../primitives/progress/progress.js";
import { Text } from "../../primitives/text/text.js";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "./card.js";

/**
 * A full card with every slot, and a header-only empty state.
 * @returns The rendered demo
 */
export function CardDemo() {
	return (
		<View className="w-full max-w-md gap-4">
			<Card>
				<CardHeader>
					<CardTitle>Storage</CardTitle>
					<CardDescription>94% of 10 GB used</CardDescription>
				</CardHeader>
				<CardContent>
					<Progress value={94} aria-label="Storage used" indicatorClassName="bg-destructive" />
				</CardContent>
				<CardFooter className="justify-end">
					<Button variant="outline">
						<Text>Upgrade</Text>
					</Button>
				</CardFooter>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>No devices yet</CardTitle>
					<CardDescription>Pair a device to see it here.</CardDescription>
				</CardHeader>
			</Card>
		</View>
	);
}
