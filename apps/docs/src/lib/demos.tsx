import type { ComponentType } from "react";
import { AccordionDemo } from "../app/demos/accordion-demo";
import { BadgeDemo } from "../app/demos/badge-demo";
import { ButtonDemo } from "../app/demos/button-demo";
import { CardDemo } from "../app/demos/card-demo";
import { CheckboxDemo } from "../app/demos/checkbox-demo";
import { InputDemo } from "../app/demos/input-demo";
import { LabelDemo } from "../app/demos/label-demo";
import { SeparatorDemo } from "../app/demos/separator-demo";
import { SwitchDemo } from "../app/demos/switch-demo";
import { TabsDemo } from "../app/demos/tabs-demo";
import { TextareaDemo } from "../app/demos/textarea-demo";

/**
 * Map of component slug → rendered demo component.
 * Used by the dynamic docs route to render live previews alongside schema metadata.
 */
export const demos: Record<string, ComponentType> = {
	accordion: AccordionDemo,
	badge: BadgeDemo,
	button: ButtonDemo,
	card: CardDemo,
	checkbox: CheckboxDemo,
	input: InputDemo,
	label: LabelDemo,
	separator: SeparatorDemo,
	switch: SwitchDemo,
	tabs: TabsDemo,
	textarea: TextareaDemo,
};

/**
 * Look up a demo component by registry slug.
 * @param slug - The component's registry name (e.g. "button")
 * @returns The demo component, or undefined if no demo exists
 */
export function getDemo(slug: string): ComponentType | undefined {
	return demos[slug];
}
