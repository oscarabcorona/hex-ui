"use client";

import { ComponentPage } from "../../../../components/component-page";
import { CardDemo } from "../../../demos/card-demo";

export default function CardPage() {
	return (
		<ComponentPage
			name="Card"
			description="A container component with header, content, and footer sections. Includes subtle shadow and hover effects."
			preview={<CardDemo />}
			previewCode={`<Card>
  <CardHeader>
    <CardTitle>Create project</CardTitle>
    <CardDescription>Deploy in one click.</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Your configuration here.</p>
  </CardContent>
  <CardFooter>
    <Button>Deploy</Button>
  </CardFooter>
</Card>`}
			installCommand="pnpm dlx @hex-ui/cli add card"
			usageCode={`import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"

export default function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Title</CardTitle>
        <CardDescription>Description</CardDescription>
      </CardHeader>
      <CardContent>Content</CardContent>
    </Card>
  )
}`}
			props={[
				{ name: "className", type: "string", description: "Additional CSS classes on root card" },
				{ name: "children", type: "ReactNode", description: "Use CardHeader, CardContent, CardFooter subcomponents" },
			]}
		/>
	);
}
