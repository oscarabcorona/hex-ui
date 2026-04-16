"use client";

import { ComponentPage } from "../../../../components/component-page";
import { SeparatorDemo } from "../../../demos/separator-demo";

export default function SeparatorPage() {
	return (
		<ComponentPage
			name="Separator"
			description="A visual divider between content sections with horizontal or vertical orientation."
			preview={<SeparatorDemo />}
			previewCode={`<Separator />
<Separator orientation="vertical" />`}
			installCommand="pnpm dlx @hex-ui/cli add separator"
			usageCode={`import { Separator } from "@/components/ui/separator"

export default function Example() {
  return <Separator />
}`}
			props={[
				{ name: "orientation", type: '"horizontal" | "vertical"', default: '"horizontal"', description: "Direction" },
				{ name: "decorative", type: "boolean", default: "true", description: "If true, hidden from screen readers" },
				{ name: "className", type: "string", description: "Additional CSS classes" },
			]}
		/>
	);
}
