"use client";

import { ComponentPage } from "../../../../components/component-page";
import { Input, Label } from "../../../../components/ui";

export default function LabelPage() {
	return (
		<ComponentPage
			name="Label"
			description="An accessible label component built on Radix UI. Associates with form controls via htmlFor."
			preview={
				<div className="grid w-full max-w-sm gap-1.5">
					<Label htmlFor="email">Email</Label>
					<Input id="email" type="email" placeholder="you@example.com" />
				</div>
			}
			previewCode={`<div className="grid gap-1.5">
  <Label htmlFor="email">Email</Label>
  <Input id="email" placeholder="you@example.com" />
</div>`}
			installCommand="pnpm dlx @hex-ui/cli add label"
			usageCode={`import { Label } from "@/components/ui/label"

export default function Example() {
  return <Label htmlFor="name">Name</Label>
}`}
			props={[
				{ name: "htmlFor", type: "string", description: "ID of the associated form control" },
				{ name: "className", type: "string", description: "Additional CSS classes" },
			]}
		/>
	);
}
