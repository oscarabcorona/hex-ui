import { Text } from "@hex-core/native";
import { Link, Stack } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";
import { demoSlugs } from "../src/demos";

/**
 * Index screen — one row per demo in the native package.
 * @returns The demo list
 */
export default function Index() {
	const slugs = demoSlugs();

	return (
		<>
			<Stack.Screen options={{ title: "Hex Native" }} />
			<ScrollView contentContainerClassName="p-4 gap-2">
				<Text variant="muted" className="mb-2">
					{slugs.length} components
				</Text>
				{slugs.map((slug) => (
					<Link key={slug} href={`/component/${slug}`} asChild>
						<Pressable
							role="button"
							aria-label={`Open ${slug}`}
							className="flex-row items-center justify-between rounded-lg border border-border bg-card px-4 py-3 active:bg-accent"
						>
							<Text>{slug}</Text>
							<Text variant="muted">›</Text>
						</Pressable>
					</Link>
				))}
			</ScrollView>
		</>
	);
}
