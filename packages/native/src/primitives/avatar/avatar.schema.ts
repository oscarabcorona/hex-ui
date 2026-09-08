import { avatarSchema } from "@hex-core/components/schemas";
import { deriveNativeSchema } from "@hex-core/registry";

export const nativeAvatarSchema = deriveNativeSchema(avatarSchema, {
	description:
		"A circular user image with an initials fallback for when there is no image or the image fails. The alt text is declared once on the root and applied to whichever of the two is showing.",
	addProps: [
		{
			name: "alt",
			type: "string",
			required: true,
			description:
				"What assistive tech announces. Declared once on the root and applied to whichever of AvatarImage / AvatarFallback is currently rendered, e.g. \"Ada Lovelace's profile picture\".",
		},
		{
			name: "source",
			type: "object",
			required: false,
			description: "Passed to AvatarImage — a React Native image source such as { uri: user.avatarUrl }",
		},
	],
	dependencies: {
		npm: ["@rn-primitives/avatar", "clsx", "tailwind-merge"],
		internal: ["lib/utils", "lib/text-context"],
		peer: ["react", "react-native", "nativewind"],
	},
	examples: [
		{
			title: "Image with initials fallback",
			description:
				"The image renders when the source is valid; the fallback takes over when there is no source or the load fails",
			code: '<Avatar alt="Ada Lovelace\'s profile picture">\n  <AvatarImage source={{ uri: user.avatarUrl }} />\n  <AvatarFallback>\n    <Text>AL</Text>\n  </AvatarFallback>\n</Avatar>',
			composition: ["user"],
		},
		{
			title: "In a list row",
			description: "Avatar plus name and subtitle, the standard conversation row",
			code: '<View className="flex-row items-center gap-3">\n  <Avatar alt={`${user.name}\'s profile picture`}>\n    <AvatarImage source={{ uri: user.avatarUrl }} />\n    <AvatarFallback><Text>{user.initials}</Text></AvatarFallback>\n  </Avatar>\n  <View className="flex-1">\n    <Text numberOfLines={1}>{user.name}</Text>\n    <Text variant="muted" numberOfLines={1}>{user.lastMessage}</Text>\n  </View>\n</View>',
			composition: ["list-row", "user"],
		},
		{
			title: "Sizing",
			description: "Override the default 40pt square with size classes on the root",
			code: '<Avatar alt="Ada Lovelace\'s profile picture" className="size-16">\n  <AvatarImage source={{ uri: user.avatarUrl }} />\n  <AvatarFallback><Text variant="large">AL</Text></AvatarFallback>\n</Avatar>',
			composition: ["sizing"],
		},
	],
	ai: {
		whenToUse:
			"Use for user profile images in headers, comment threads and user lists. Always include an AvatarFallback with initials so there is something to show while the image loads or if it fails.",
		whenNotToUse:
			"Don't use for decorative icons (render an icon component). Don't use for product or brand imagery (use a plain Image with the right aspect ratio). Don't use it as a button — wrap it in a Pressable or Button if it needs to be tappable.",
		commonMistakes: [
			"Omitting AvatarFallback — with no fallback the avatar is an empty circle whenever the source is missing or the request fails, and it has no accessible name either",
			"Expecting the fallback to cover the loading window — it renders when the image is absent or errored, not while bytes are in flight; render a Skeleton in the same circle for the loading state",
			"Passing alt to AvatarImage instead of the Avatar root — the root distributes it to whichever child is showing, so setting it lower down leaves the fallback unnamed",
			"Putting a bare string in AvatarFallback instead of a Text element — React Native throws",
			"Using an img-style URL string for source — React Native needs an object, { uri: url }, not a bare string",
		],
		relatedComponents: ["native-badge", "native-card", "native-text", "native-skeleton"],
		accessibilityNotes:
			"The root's alt is the accessible name, and the primitive applies it to whichever child is rendered: the image gets alt, the fallback gets role=\"img\" plus the same label. Write it as a description of the person, not \"avatar\". Keep the fallback initials meaningful, since they are also visible text. While an avatar list loads, render a Skeleton in the same 40pt circle so nothing shifts. The muted fallback background and its foreground token are contrast-audited in light and dark.",
	},
});
