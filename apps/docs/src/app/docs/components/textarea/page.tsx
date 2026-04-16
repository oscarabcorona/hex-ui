"use client";

import { ComponentPage } from "../../../../components/component-page";
import { TextareaDemo } from "../../../demos/textarea-demo";

export default function TextareaPage() {
	return (
		<ComponentPage
			name="Textarea"
			description="A styled multi-line text input with smooth focus transitions and shadow effects."
			preview={<TextareaDemo />}
			previewCode={`<Textarea placeholder="Write your message..." />
<Textarea disabled placeholder="Disabled" />`}
			installCommand="pnpm dlx @hex-ui/cli add textarea"
			usageCode={`import { Textarea } from "@/components/ui/textarea"

export default function Example() {
  return <Textarea placeholder="Type your message..." />
}`}
			props={[
				{ name: "placeholder", type: "string", description: "Placeholder text" },
				{ name: "rows", type: "number", default: "3", description: "Visible text rows" },
				{ name: "value", type: "string", description: "Controlled value" },
				{ name: "onChange", type: "(e: ChangeEvent) => void", description: "Change handler" },
				{ name: "disabled", type: "boolean", default: "false", description: "Disable the textarea" },
				{ name: "className", type: "string", description: "Additional CSS classes" },
			]}
		/>
	);
}
