import { View } from "react-native";
import { Text } from "../text/text.js";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar.js";

/**
 * Sizes and the fallback state, plus a typical list row.
 */
export function AvatarDemo() {
	return (
		<View className="w-full max-w-md gap-6">
			<View className="gap-2">
				<Text variant="muted">Sizes</Text>
				<View className="flex-row items-center gap-3">
					<Avatar alt="Ada Lovelace's profile picture" className="size-8">
						<AvatarFallback>
							<Text variant="small">AL</Text>
						</AvatarFallback>
					</Avatar>
					<Avatar alt="Grace Hopper's profile picture">
						<AvatarFallback>
							<Text>GH</Text>
						</AvatarFallback>
					</Avatar>
					<Avatar alt="Alan Turing's profile picture" className="size-16">
						<AvatarFallback>
							<Text variant="large">AT</Text>
						</AvatarFallback>
					</Avatar>
				</View>
			</View>

			<View className="gap-2">
				<Text variant="muted">List row</Text>
				<View className="flex-row items-center gap-3">
					<Avatar alt="Ada Lovelace's profile picture">
						<AvatarImage source={{ uri: "https://github.com/github.png" }} />
						<AvatarFallback>
							<Text>AL</Text>
						</AvatarFallback>
					</Avatar>
					<View className="flex-1">
						<Text numberOfLines={1}>Ada Lovelace</Text>
						<Text variant="muted" numberOfLines={1}>
							Sent the analytical engine notes
						</Text>
					</View>
				</View>
			</View>
		</View>
	);
}
