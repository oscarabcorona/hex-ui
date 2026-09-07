import { alertDialogSchema } from "@hex-core/components/schemas";
import { deriveNativeSchema } from "@hex-core/registry";

export const nativeAlertDialogSchema = deriveNativeSchema(alertDialogSchema, {
	description:
		"A confirmation modal the user must answer. The scrim does not dismiss it. Renders through a PortalHost mounted in the app's root layout.",
	addProps: [
		{
			name: "portalHost",
			type: "string",
			required: false,
			description: "Name of the PortalHost to render into. Only needed when the app mounts more than one.",
		},
	],
	dependencies: {
		npm: ["@rn-primitives/alert-dialog", "@rn-primitives/portal", "clsx", "tailwind-merge"],
		internal: ["lib/utils"],
		peer: ["react", "react-native", "nativewind"],
	},
	examples: [
		{
			title: "Destructive confirmation",
			description: "Cancel first, destructive action second — the phone convention",
			code: '<AlertDialog open={open} onOpenChange={setOpen}>\n  <AlertDialogContent>\n    <AlertDialogTitle>Delete account?</AlertDialogTitle>\n    <AlertDialogDescription>\n      Everything in this account is removed. This cannot be undone.\n    </AlertDialogDescription>\n    <View className="flex-row justify-end gap-2">\n      <AlertDialogCancel asChild>\n        <Button variant="secondary"><Text>Cancel</Text></Button>\n      </AlertDialogCancel>\n      <AlertDialogAction asChild>\n        <Button variant="destructive" onPress={remove}><Text>Delete</Text></Button>\n      </AlertDialogAction>\n    </View>\n  </AlertDialogContent>\n</AlertDialog>',
			composition: ["overlay", "destructive", "confirm"],
		},
		{
			title: "Opened from a trigger",
			description: "Let the alert own its state",
			code: '<AlertDialog>\n  <AlertDialogTrigger asChild>\n    <Button variant="destructive"><Text>Leave team</Text></Button>\n  </AlertDialogTrigger>\n  <AlertDialogContent>\n    <AlertDialogTitle>Leave this team?</AlertDialogTitle>\n    <AlertDialogDescription>You will lose access to its projects.</AlertDialogDescription>\n    <View className="flex-row justify-end gap-2">\n      <AlertDialogCancel asChild>\n        <Button variant="secondary"><Text>Stay</Text></Button>\n      </AlertDialogCancel>\n      <AlertDialogAction asChild>\n        <Button variant="destructive"><Text>Leave</Text></Button>\n      </AlertDialogAction>\n    </View>\n  </AlertDialogContent>\n</AlertDialog>',
			composition: ["overlay", "confirm"],
		},
	],
	ai: {
		whenToUse:
			"Use to confirm something irreversible before it happens: delete, archive, leave, revoke. Always pair a Cancel with the confirming Action, and say the consequence in the description.",
		whenNotToUse:
			"Don't use for anything the user can undo — show the result with an undo affordance instead of asking first. Don't use it to carry a form (that is Dialog). Don't use it for information with only one button; that is a message, not a question.",
		commonMistakes: [
			"Forgetting <PortalHost /> in the root layout — the alert mounts but renders nothing at all",
			"Expecting a scrim tap to dismiss it: an alert dialog deliberately ignores that, so a missing Cancel leaves the user stuck",
			"Confirming a recoverable action, which trains users to dismiss the dialog without reading it",
			"Writing the title as a statement instead of a question, so the two buttons have no question to answer",
			"Labelling the buttons OK and Cancel rather than naming the action — Delete next to Cancel is unambiguous when read aloud out of context",
		],
		relatedComponents: ["native-button", "native-text", "native-dialog"],
		accessibilityNotes:
			"The panel is announced as an alert when it opens, with the title as its name — always include AlertDialogTitle, and put the consequence in AlertDialogDescription so it is read with the question. Because the scrim does not dismiss, a Cancel control is mandatory rather than a courtesy: it is the only exit for a screen-reader or keyboard user. Name buttons after their effect so each is unambiguous when announced alone.",
	},
});
