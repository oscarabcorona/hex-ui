import { type ComponentProps, useState } from "react";
import { Pressable, View } from "react-native";
import { cn } from "../../lib/utils.js";
import { Text } from "../../primitives/text/text.js";

/** Lifecycle of a tool invocation. */
export type ToolCallState = "pending" | "running" | "success" | "error";

/** Short status label per state. */
const STATE_LABEL: Record<ToolCallState, string> = {
	pending: "Queued",
	running: "Running",
	success: "Done",
	error: "Failed",
};

/** Status colour per state. */
const STATE_CLASS: Record<ToolCallState, string> = {
	pending: "text-muted-foreground",
	running: "text-muted-foreground",
	success: "text-foreground",
	error: "text-destructive",
};

/** Props for {@link ToolCall}. */
export interface ToolCallProps extends ComponentProps<typeof View> {
	/** The tool's name, as the model called it. */
	name: string;
	/** Where the invocation is in its lifecycle. */
	state: ToolCallState;
	/** Arguments the model passed, shown when expanded. */
	args?: unknown;
	/** What the tool returned, shown when expanded. */
	result?: unknown;
	/** Start expanded. Collapsed by default so a transcript stays scannable. */
	defaultOpen?: boolean;
}

/**
 * Serialise a value for display, tolerating anything the model produced.
 * @param value - Arguments or a result
 * @returns Pretty-printed JSON, or the string form when that fails
 */
function format(value: unknown): string {
	if (typeof value === "string") return value;
	try {
		return JSON.stringify(value, null, 2);
	} catch {
		return String(value);
	}
}

/**
 * The name-and-status row, pressable only when there is something to reveal.
 *
 * A `Pressable` with `disabled` announces itself as a disabled button, which
 * is wrong for a call that simply took no arguments — nothing is unavailable,
 * there is just nothing to expand. A plain `View` carries no button semantics
 * and no `aria-expanded` at all.
 * @param props - Row configuration
 * @param props.expandable - Whether there is detail to disclose
 * @param props.open - Current disclosure state
 * @param props.label - Accessible name, carrying both tool name and status
 * @param props.onToggle - Flip the disclosure
 * @param props.children - The row's visible content
 * @returns The header row
 */
function ToolCallHeader({
	expandable,
	open,
	label,
	onToggle,
	children,
}: {
	expandable: boolean;
	open: boolean;
	label: string;
	onToggle: () => void;
	children: React.ReactNode;
}) {
	if (!expandable) {
		return <View className="flex-row items-center justify-between gap-3">{children}</View>;
	}
	return (
		<Pressable
			role="button"
			aria-label={label}
			aria-expanded={open}
			onPress={onToggle}
			className="flex-row items-center justify-between gap-3"
		>
			{children}
		</Pressable>
	);
}

/**
 * A collapsible record of one tool invocation.
 *
 * Collapsed to a single row by default: a transcript full of expanded JSON
 * is unreadable on a phone, and the arguments matter only when someone is
 * debugging a turn.
 * @param props - {@link ToolCallProps}
 * @returns The tool-call row
 * @example
 * ```tsx
 * <ToolCall name="search_flights" state="success" args={args} result={result} />
 * ```
 */
export function ToolCall({
	className,
	name,
	state,
	args,
	result,
	defaultOpen = false,
	...props
}: ToolCallProps) {
	const [open, setOpen] = useState(defaultOpen);
	const hasDetail = args !== undefined || result !== undefined;

	return (
		<View
			className={cn("gap-2 rounded-xl border border-border bg-card p-3", className)}
			{...props}
		>
			{/*
			 * A call with nothing to expand is a plain row, not a disabled
			 * button. `disabled` sets accessibilityState.disabled, so a
			 * perfectly normal argument-free tool call was announced as
			 * "disabled button", and it carried an aria-expanded for a
			 * disclosure that does not exist.
			 */}
			<ToolCallHeader
				expandable={hasDetail}
				open={open}
				label={`${name}, ${STATE_LABEL[state]}`}
				onToggle={() => {
					setOpen((current) => !current);
				}}
			>
				<Text variant="small" className="flex-1 font-mono text-card-foreground" numberOfLines={1}>
					{name}
				</Text>
				<Text variant="small" className={STATE_CLASS[state]}>
					{STATE_LABEL[state]}
				</Text>
			</ToolCallHeader>

			{open && hasDetail ? (
				<View className="gap-2 border-t border-border pt-2">
					{args !== undefined ? (
						<View className="gap-1">
							<Text variant="muted">Arguments</Text>
							<Text variant="code" selectable>
								{format(args)}
							</Text>
						</View>
					) : null}
					{result !== undefined ? (
						<View className="gap-1">
							<Text variant="muted">Result</Text>
							<Text variant="code" selectable>
								{format(result)}
							</Text>
						</View>
					) : null}
				</View>
			) : null}
		</View>
	);
}
