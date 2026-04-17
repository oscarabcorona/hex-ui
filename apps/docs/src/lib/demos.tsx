import type { ComponentType } from "react";
import { AccordionDemo } from "../app/demos/accordion-demo";
import { AlertDialogDemo } from "../app/demos/alert-dialog-demo";
import { BadgeDemo } from "../app/demos/badge-demo";
import { ButtonDemo } from "../app/demos/button-demo";
import { CardDemo } from "../app/demos/card-demo";
import { CheckboxDemo } from "../app/demos/checkbox-demo";
import { DialogDemo } from "../app/demos/dialog-demo";
import { DropdownMenuDemo } from "../app/demos/dropdown-menu-demo";
import { InputDemo } from "../app/demos/input-demo";
import { LabelDemo } from "../app/demos/label-demo";
import { PopoverDemo } from "../app/demos/popover-demo";
import { SeparatorDemo } from "../app/demos/separator-demo";
import { SwitchDemo } from "../app/demos/switch-demo";
import { TabsDemo } from "../app/demos/tabs-demo";
import { TextareaDemo } from "../app/demos/textarea-demo";
import { TooltipDemo } from "../app/demos/tooltip-demo";

/**
 * Map of component slug → rendered demo component.
 * Used by the dynamic docs route to render live previews alongside schema metadata.
 */
export const demos: Record<string, ComponentType> = {
	accordion: AccordionDemo,
	"alert-dialog": AlertDialogDemo,
	badge: BadgeDemo,
	button: ButtonDemo,
	card: CardDemo,
	checkbox: CheckboxDemo,
	dialog: DialogDemo,
	"dropdown-menu": DropdownMenuDemo,
	input: InputDemo,
	label: LabelDemo,
	popover: PopoverDemo,
	separator: SeparatorDemo,
	switch: SwitchDemo,
	tabs: TabsDemo,
	textarea: TextareaDemo,
	tooltip: TooltipDemo,
};

/**
 * Look up a demo component by registry slug.
 * @param slug - The component's registry name (e.g. "button")
 * @returns The demo component, or undefined if no demo exists
 */
export function getDemo(slug: string): ComponentType | undefined {
	return demos[slug];
}
