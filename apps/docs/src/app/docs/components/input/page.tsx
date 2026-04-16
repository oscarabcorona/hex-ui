"use client";

import { ComponentPage } from "../../../../components/component-page";
import { InputDemo } from "../../../demos/input-demo";

export default function InputPage() {
	return (
		<ComponentPage
			name="Input"
			description="A styled text input with smooth focus transitions, shadow effects, and full HTML input compatibility."
			preview={<InputDemo />}
			previewCode={`<Input placeholder="Email address" />
<Input type="password" placeholder="Password" />
<Input disabled placeholder="Disabled" />`}
			installCommand="pnpm dlx @hex-ui/cli add input"
			usageCode={`import { Input } from "@/components/ui/input"

export default function Example() {
  return <Input placeholder="Email" type="email" />
}`}
			props={[
				{ name: "type", type: '"text" | "password" | "email" | "number" | ...', default: '"text"', description: "HTML input type" },
				{ name: "placeholder", type: "string", description: "Placeholder text" },
				{ name: "value", type: "string", description: "Controlled input value" },
				{ name: "onChange", type: "(e: ChangeEvent) => void", description: "Change handler" },
				{ name: "disabled", type: "boolean", default: "false", description: "Disable the input" },
				{ name: "className", type: "string", description: "Additional CSS classes" },
			]}
		/>
	);
}
