import { toolCallSchema } from "@hex-core/components/schemas";
import { deriveNativeSchema } from "@hex-core/registry";

export const nativeToolCallSchema = deriveNativeSchema(toolCallSchema, {
	description:
		"A collapsible record of one tool invocation — name, status, and the arguments and result behind a tap. Collapsed by default so a transcript stays scannable on a phone.",
	// The web schema's terminal state is `result`; this component's union is
	// `success`. Inheriting the enum shipped a prop table whose own examples
	// contradicted it, and `state="result"` renders an empty status cell.
	removeProps: ["state"],
	addProps: [
		{
			name: "state",
			type: "enum",
			required: true,
			description: "Where the invocation is in its lifecycle. Drives the status label and its colour.",
			enumValues: ["pending", "running", "success", "error"],
		},
	],
	dependencies: {
		npm: ["clsx", "tailwind-merge"],
		internal: ["lib/utils", "primitives/text/text"],
		peer: ["react", "react-native", "nativewind"],
	},
	examples: [
		{
			title: "A completed call",
			description: "Name and status on one row; details open on tap",
			code: '<ToolCall\n  name="search_flights"\n  state="success"\n  args={{ from: "LHR", to: "JFK" }}\n  result={{ count: 12 }}\n/>',
			composition: ["chat", "agent"],
		},
		{
			title: "In flight",
			description: "Show the call as soon as it starts, before a result exists",
			code: '<ToolCall name="search_flights" state="running" args={args} />',
			composition: ["chat", "streaming"],
		},
		{
			title: "A failure",
			description: "The error state colours the status and keeps the detail available",
			code: '<ToolCall\n  name="book_flight"\n  state="error"\n  args={args}\n  result={error.message}\n  defaultOpen\n/>',
			composition: ["chat", "error"],
		},
	],
	ai: {
		whenToUse:
			"Use in a transcript to show that the model called a tool and how it went. Render it as soon as the call starts, then update the state as the result arrives.",
		whenNotToUse:
			"Don't use it for the model's prose (use Message). Don't use it for a progress bar over a long job (use Progress). Don't expand every call by default; a screen of JSON hides the conversation.",
		commonMistakes: [
			"Leaving the state at 'pending' after the call finishes, so a completed tool reads as still queued",
			"Passing defaultOpen on every call, which buries the conversation under argument dumps",
			"Rendering it only after the result arrives, which hides the fact that anything is happening during the slowest part of a turn",
			"Passing a value that cannot be serialised and expecting it to render — the component falls back to the string form, which is rarely useful; format it yourself first",
		],
		relatedComponents: ["native-message", "native-message-list", "native-text"],
		accessibilityNotes:
			"The header row is a button whose accessible name carries both the tool name and its status, so a screen-reader user hears \"search_flights, Done\" without needing the colour. It reports its expanded state, and is disabled outright when there is nothing to expand. The error state pairs the destructive colour with the word Failed, so the status never rests on colour alone. Argument and result blocks are selectable for copying.",
	},
});
