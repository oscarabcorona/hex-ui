"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "../../components/ui";

export function AccordionDemo() {
	return (
		<Accordion type="single" collapsible className="w-full max-w-md">
			<AccordionItem value="item-1">
				<AccordionTrigger>Is it accessible?</AccordionTrigger>
				<AccordionContent>
					Yes. It adheres to the WAI-ARIA design pattern for accordions.
				</AccordionContent>
			</AccordionItem>
			<AccordionItem value="item-2">
				<AccordionTrigger>Is it styled?</AccordionTrigger>
				<AccordionContent>
					Yes. It comes with Hex UI&apos;s refined modern styling with smooth transitions.
				</AccordionContent>
			</AccordionItem>
			<AccordionItem value="item-3">
				<AccordionTrigger>Is it animated?</AccordionTrigger>
				<AccordionContent>
					Yes. The content expands and collapses with smooth CSS transitions.
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}
