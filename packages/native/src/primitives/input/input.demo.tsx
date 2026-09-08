import { useState } from "react";
import { View } from "react-native";
import { Label } from "../label/label.js";
import { Text } from "../text/text.js";
import { Input } from "./input.js";

/**
 * A labelled email field, a password field, and a read-only field.
 * @returns The rendered demo
 */
export function InputDemo() {
	const [email, setEmail] = useState("");

	return (
		<View className="w-full max-w-md gap-5">
			<View className="gap-1.5">
				<Label nativeID="demo-email">Email</Label>
				<Input
					aria-labelledby="demo-email"
					value={email}
					onChangeText={setEmail}
					keyboardType="email-address"
					autoCapitalize="none"
					autoComplete="email"
					placeholder="you@example.com"
				/>
			</View>

			<View className="gap-1.5">
				<Label nativeID="demo-password">Password</Label>
				<Input
					aria-labelledby="demo-password"
					secureTextEntry
					autoCapitalize="none"
					autoComplete="password"
					placeholder="••••••••"
				/>
			</View>

			<View className="gap-1.5">
				<Label nativeID="demo-plan" disabled>
					Plan
				</Label>
				<Input aria-labelledby="demo-plan" editable={false} value="Enterprise" />
				<Text variant="muted">Contact sales to change your plan.</Text>
			</View>
		</View>
	);
}
