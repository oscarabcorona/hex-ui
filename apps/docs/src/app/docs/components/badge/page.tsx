"use client";

import { ComponentPage } from "../../../../components/component-page";
import { BadgeDemo } from "../../../demos/badge-demo";

export default function BadgePage() {
	return (
		<ComponentPage
			name="Badge"
			description="A small status indicator with multiple style variants. Used for tags, statuses, and categorization."
			preview={<BadgeDemo />}
			previewCode={`<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Outline</Badge>`}
			installCommand="pnpm dlx @hex-ui/cli add badge"
			usageCode={`import { Badge } from "@/components/ui/badge"

export default function Example() {
  return <Badge variant="secondary">New</Badge>
}`}
			props={[
				{ name: "variant", type: '"default" | "secondary" | "destructive" | "outline"', default: '"default"', description: "Visual style" },
				{ name: "className", type: "string", description: "Additional CSS classes" },
			]}
		/>
	);
}
