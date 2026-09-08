import * as TabsPrimitive from "@rn-primitives/tabs";
import type { ComponentProps } from "react";
import { TextClassContext } from "../../lib/text-context.js";
import { cn } from "../../lib/utils.js";

/** Props for {@link Tabs}. */
export type TabsProps = ComponentProps<typeof TabsPrimitive.Root>;

/**
 * A tabbed panel switcher.
 *
 * Controlled only: pass `value` and `onValueChange`. Each `TabsTrigger` and
 * `TabsContent` pair is matched by a shared `value`.
 * @param props - {@link TabsProps}
 * @returns The tabs root
 * @example
 * ```tsx
 * <Tabs value={tab} onValueChange={setTab}>
 *   <TabsList>
 *     <TabsTrigger value="account"><Text>Account</Text></TabsTrigger>
 *     <TabsTrigger value="billing"><Text>Billing</Text></TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="account"><Text>Account settings</Text></TabsContent>
 *   <TabsContent value="billing"><Text>Billing settings</Text></TabsContent>
 * </Tabs>
 * ```
 */
export function Tabs({ className, ...props }: TabsProps) {
	return <TabsPrimitive.Root className={cn("flex-col gap-2", className)} {...props} />;
}

/** Props for {@link TabsList}. */
export type TabsListProps = ComponentProps<typeof TabsPrimitive.List>;

/**
 * The row of triggers.
 * @param props - {@link TabsListProps}
 * @returns The tab list
 */
export function TabsList({ className, ...props }: TabsListProps) {
	return (
		<TabsPrimitive.List
			className={cn("flex-row items-center rounded-lg bg-muted p-1", className)}
			{...props}
		/>
	);
}

/** Props for {@link TabsTrigger}. */
export type TabsTriggerProps = ComponentProps<typeof TabsPrimitive.Trigger>;

/**
 * One tab. Selected state is derived from the root's `value`.
 * @param props - {@link TabsTriggerProps}
 * @returns The trigger
 */
export function TabsTrigger({ className, value, ...props }: TabsTriggerProps) {
	const { value: selected } = TabsPrimitive.useRootContext();
	const active = selected === value;
	return (
		<TextClassContext.Provider
			value={cn("text-sm font-medium", active ? "text-foreground" : "text-muted-foreground")}
		>
			<TabsPrimitive.Trigger
				value={value}
				className={cn(
					"flex-1 flex-row items-center justify-center rounded-md px-3 py-1.5",
					active && "bg-background shadow-sm shadow-black/5",
					props.disabled && "opacity-50",
					className,
				)}
				{...props}
			/>
		</TextClassContext.Provider>
	);
}

/** Props for {@link TabsContent}. */
export type TabsContentProps = ComponentProps<typeof TabsPrimitive.Content>;

/**
 * The panel for one tab. Only the panel matching the root's `value` renders.
 * @param props - {@link TabsContentProps}
 * @returns The panel
 */
export function TabsContent({ className, ...props }: TabsContentProps) {
	return <TabsPrimitive.Content className={className} {...props} />;
}
