import { useState } from "react";
import { View } from "react-native";
import { Text } from "../../primitives/text/text.js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs.js";

/**
 * Two panels switched by a controlled value.
 * @returns The rendered demo
 */
export function TabsDemo() {
	const [tab, setTab] = useState("account");

	return (
		<View className="w-full max-w-md">
			<Tabs value={tab} onValueChange={setTab}>
				<TabsList>
					<TabsTrigger value="account">
						<Text>Account</Text>
					</TabsTrigger>
					<TabsTrigger value="billing">
						<Text>Billing</Text>
					</TabsTrigger>
				</TabsList>
				<TabsContent value="account">
					<View className="gap-1 py-2">
						<Text variant="h4">Account</Text>
						<Text variant="muted">Update your name and email address.</Text>
					</View>
				</TabsContent>
				<TabsContent value="billing">
					<View className="gap-1 py-2">
						<Text variant="h4">Billing</Text>
						<Text variant="muted">Visa ending 4242, renews in 12 days.</Text>
					</View>
				</TabsContent>
			</Tabs>
		</View>
	);
}
