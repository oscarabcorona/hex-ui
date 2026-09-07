import { View } from "react-native";
import { Text } from "./text.js";

/**
 * The typographic scale, top to bottom, followed by inline code.
 */
export function TextDemo() {
	return (
		<View className="w-full max-w-md gap-3">
			<Text variant="h1">Heading 1</Text>
			<Text variant="h2">Heading 2</Text>
			<Text variant="h3">Heading 3</Text>
			<Text variant="h4">Heading 4</Text>
			<Text variant="lead">A lead sentence that introduces the screen.</Text>
			<Text variant="p">
				Body copy with relaxed line height for multi-line descriptions and onboarding text.
			</Text>
			<Text variant="large">Large emphasised value</Text>
			<Text variant="small">Small compact label</Text>
			<Text variant="muted">Muted helper text</Text>
			<Text variant="code">hex add native-text</Text>
		</View>
	);
}
