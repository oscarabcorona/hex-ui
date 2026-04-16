"use client";

import { ComponentPage } from "../../../../components/component-page";
import { SwitchDemo } from "../../../demos/switch-demo";

export default function SwitchPage() {
	return (
		<ComponentPage
			name="Switch"
			description="An accessible toggle switch for instant on/off settings. Built on Radix UI."
			preview={<SwitchDemo />}
			previewCode={`<div className="flex items-center gap-2">
  <Switch id="airplane" />
  <Label htmlFor="airplane">Airplane Mode</Label>
</div>`}
			installCommand="pnpm dlx @hex-ui/cli add switch"
			usageCode={`import { Switch } from "@/components/ui/switch"

export default function Example() {
  return (
    <div className="flex items-center gap-2">
      <Switch id="mode" />
      <label htmlFor="mode">Dark Mode</label>
    </div>
  )
}`}
			props={[
				{ name: "checked", type: "boolean", description: "Controlled checked state" },
				{ name: "defaultChecked", type: "boolean", description: "Default for uncontrolled" },
				{ name: "onCheckedChange", type: "(checked: boolean) => void", description: "Change callback" },
				{ name: "disabled", type: "boolean", default: "false", description: "Disable the switch" },
				{ name: "className", type: "string", description: "Additional CSS classes" },
			]}
		/>
	);
}
