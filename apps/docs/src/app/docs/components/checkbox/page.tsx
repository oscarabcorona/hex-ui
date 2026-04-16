"use client";

import { ComponentPage } from "../../../../components/component-page";
import { CheckboxDemo } from "../../../demos/checkbox-demo";

export default function CheckboxPage() {
	return (
		<ComponentPage
			name="Checkbox"
			description="An accessible checkbox with checked, unchecked, and indeterminate states. Built on Radix UI."
			preview={<CheckboxDemo />}
			previewCode={`<div className="flex items-center gap-2">
  <Checkbox id="terms" />
  <Label htmlFor="terms">Accept terms</Label>
</div>`}
			installCommand="pnpm dlx @hex-ui/cli add checkbox"
			usageCode={`import { Checkbox } from "@/components/ui/checkbox"

export default function Example() {
  return (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" />
      <label htmlFor="terms">Accept terms</label>
    </div>
  )
}`}
			props={[
				{ name: "checked", type: "boolean", description: "Controlled checked state" },
				{ name: "defaultChecked", type: "boolean", description: "Default for uncontrolled" },
				{ name: "onCheckedChange", type: "(checked: boolean | 'indeterminate') => void", description: "Change callback" },
				{ name: "disabled", type: "boolean", default: "false", description: "Disable the checkbox" },
				{ name: "required", type: "boolean", default: "false", description: "Mark as required" },
				{ name: "className", type: "string", description: "Additional CSS classes" },
			]}
		/>
	);
}
