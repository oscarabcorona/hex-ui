import { gfmFromMarkdown } from "mdast-util-gfm";
import { fromMarkdown } from "mdast-util-from-markdown";
import { gfm } from "micromark-extension-gfm";
import { Fragment, type ReactNode, useMemo } from "react";
import { Linking, View } from "react-native";
import { cn } from "../../lib/utils.js";
import { Text } from "../../primitives/text/text.js";

/**
 * Markdown rendered natively, not through a DOM.
 *
 * `react-markdown` emits HTML element names, so it cannot be reused here.
 * The parser is the same one underneath it — micromark with the GitHub
 * extension — and only the render step is replaced: an mdast tree walked
 * into React Native `Text` and `View` elements.
 *
 * Streaming safety comes from the parser: an unterminated `**`, a half-typed
 * fence or a dangling `[link](` parses as literal text rather than throwing,
 * so a partial reply renders on every token without a guard.
 */

/** The mdast node shapes this renderer handles. */
interface MdastNode {
	type: string;
	value?: string;
	depth?: number;
	ordered?: boolean;
	lang?: string | null;
	url?: string;
	checked?: boolean | null;
	children?: MdastNode[];
}

/** Heading depth to the Text variant that renders it. */
const HEADING_VARIANT = ["h1", "h2", "h3", "h4", "h4", "h4"] as const;

/**
 * Open a link, ignoring failures.
 *
 * A markdown link in a model reply can be anything, including a scheme the
 * device has no handler for. Failing silently is better than crashing a
 * transcript on a bad URL.
 * @param url - The link target
 */
function openLink(url: string): void {
	void Linking.openURL(url).catch(() => undefined);
}

/**
 * Render the inline children of a block node into a single `Text` run.
 *
 * Inline formatting has to stay inside one `Text` so it wraps as prose;
 * nesting a `View` here would break the line.
 * @param nodes - Inline mdast nodes
 * @param keyPrefix - Key namespace for this run
 * @returns The rendered inline nodes
 */
function renderInline(nodes: readonly MdastNode[] | undefined, keyPrefix: string): ReactNode {
	if (!nodes) return null;
	return nodes.map((node, index) => {
		const key = `${keyPrefix}-${String(index)}`;
		switch (node.type) {
			case "text":
				return <Fragment key={key}>{node.value}</Fragment>;
			case "strong":
				return (
					<Text key={key} className="font-semibold">
						{renderInline(node.children, key)}
					</Text>
				);
			case "emphasis":
				return (
					<Text key={key} className="italic">
						{renderInline(node.children, key)}
					</Text>
				);
			case "delete":
				return (
					<Text key={key} className="line-through">
						{renderInline(node.children, key)}
					</Text>
				);
			case "inlineCode":
				return (
					<Text key={key} variant="code">
						{node.value}
					</Text>
				);
			case "break":
				return <Fragment key={key}>{"\n"}</Fragment>;
			case "link": {
				const url = node.url ?? "";
				return (
					<Text
						key={key}
						role="link"
						className="text-primary underline"
						onPress={() => {
							openLink(url);
						}}
					>
						{renderInline(node.children, key)}
					</Text>
				);
			}
			default:
				// An unhandled inline node still has text worth showing.
				return <Fragment key={key}>{renderInline(node.children, key)}</Fragment>;
		}
	});
}

/**
 * Render one list, ordered or bulleted, with its markers.
 * @param node - A `list` mdast node
 * @param keyPrefix - Key namespace
 * @returns The rendered list
 */
function renderList(node: MdastNode, keyPrefix: string): ReactNode {
	const ordered = node.ordered === true;
	return (
		<View key={keyPrefix} className="gap-1 pl-1">
			{(node.children ?? []).map((item, index) => {
				const key = `${keyPrefix}-${String(index)}`;
				const marker = item.checked === true ? "☑" : item.checked === false ? "☐" : ordered ? `${String(index + 1)}.` : "•";
				return (
					<View key={key} className="flex-row gap-2">
						<Text className="text-muted-foreground">{marker}</Text>
						<View className="flex-1 gap-1">
							{(item.children ?? []).map((child, childIndex) =>
								renderBlock(child, `${key}-${String(childIndex)}`),
							)}
						</View>
					</View>
				);
			})}
		</View>
	);
}

/**
 * Render one block-level node.
 * @param node - A block mdast node
 * @param key - React key
 * @returns The rendered block
 */
function renderBlock(node: MdastNode, key: string): ReactNode {
	switch (node.type) {
		case "paragraph":
			return <Text key={key}>{renderInline(node.children, key)}</Text>;
		case "heading": {
			const depth = Math.min(Math.max(node.depth ?? 1, 1), 6);
			return (
				<Text key={key} variant={HEADING_VARIANT[depth - 1]}>
					{renderInline(node.children, key)}
				</Text>
			);
		}
		case "list":
			return renderList(node, key);
		case "code":
			return (
				<View key={key} className="rounded-lg bg-muted p-3">
					<Text selectable className="font-mono text-sm text-foreground">
						{node.value ?? ""}
					</Text>
				</View>
			);
		case "blockquote":
			return (
				<View key={key} className="gap-2 border-l-2 border-border pl-3">
					{(node.children ?? []).map((child, index) =>
						renderBlock(child, `${key}-${String(index)}`),
					)}
				</View>
			);
		case "thematicBreak":
			return <View key={key} className="h-px w-full bg-border" />;
		case "html":
			// Raw HTML has no meaning here. Show it as text rather than
			// dropping content a model deliberately produced.
			return (
				<Text key={key} variant="muted">
					{node.value ?? ""}
				</Text>
			);
		default:
			if (!node.children) return null;
			return (
				<Fragment key={key}>
					{node.children.map((child, index) => renderBlock(child, `${key}-${String(index)}`))}
				</Fragment>
			);
	}
}

/** Props for {@link Markdown}. */
export interface MarkdownProps {
	/** The markdown source. Safe to pass a partially-streamed string. */
	children: string;
	/** Additional classes on the container. */
	className?: string;
}

/**
 * Render markdown as React Native elements.
 *
 * Handles paragraphs, headings, ordered and bulleted lists, task lists,
 * fenced and inline code, links, blockquotes, rules, bold, italic and
 * strikethrough. Tables and images fall back to their text content.
 * @param props - {@link MarkdownProps}
 * @returns The rendered document
 * @example
 * ```tsx
 * <Message role="assistant">
 *   <Markdown>{message.content}</Markdown>
 * </Message>
 * ```
 */
export function Markdown({ children, className }: MarkdownProps) {
	const tree = useMemo(() => {
		const parsed: unknown = fromMarkdown(children, {
			extensions: [gfm()],
			mdastExtensions: [gfmFromMarkdown()],
		});
		return parsed as MdastNode;
	}, [children]);

	return (
		<View className={cn("gap-2", className)}>
			{(tree.children ?? []).map((node, index) => renderBlock(node, `md-${String(index)}`))}
		</View>
	);
}
