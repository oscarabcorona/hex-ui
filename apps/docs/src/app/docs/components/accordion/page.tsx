"use client";

import { ComponentPage } from "../../../../components/component-page";
import { AccordionDemo } from "../../../demos/accordion-demo";

export default function AccordionPage() {
	return (
		<ComponentPage
			name="Accordion"
			description="A vertically stacked set of collapsible content sections. Built on Radix UI Accordion."
			preview={<AccordionDemo />}
			previewCode={`<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent>Yes, WAI-ARIA compliant.</AccordionContent>
  </AccordionItem>
</Accordion>`}
			installCommand="pnpm dlx @hex-ui/cli add accordion"
			usageCode={`import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

export default function Example() {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>Question?</AccordionTrigger>
        <AccordionContent>Answer.</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}`}
			props={[
				{ name: "type", type: '"single" | "multiple"', description: "Single or multiple open items (required)" },
				{ name: "defaultValue", type: "string | string[]", description: "Default open items" },
				{ name: "value", type: "string | string[]", description: "Controlled open items" },
				{ name: "onValueChange", type: "(value) => void", description: "Change callback" },
				{ name: "collapsible", type: "boolean", default: "false", description: "Allow all items closed (single only)" },
				{ name: "className", type: "string", description: "Additional CSS classes" },
			]}
		/>
	);
}
