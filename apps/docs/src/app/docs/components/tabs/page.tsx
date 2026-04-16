"use client";

import { ComponentPage } from "../../../../components/component-page";
import { TabsDemo } from "../../../demos/tabs-demo";

export default function TabsPage() {
	return (
		<ComponentPage
			name="Tabs"
			description="A tabbed interface with accessible keyboard navigation. Built on Radix UI Tabs."
			preview={<TabsDemo />}
			previewCode={`<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">Account settings</TabsContent>
  <TabsContent value="password">Password settings</TabsContent>
</Tabs>`}
			installCommand="pnpm dlx @hex-ui/cli add tabs"
			usageCode={`import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export default function Example() {
  return (
    <Tabs defaultValue="tab1">
      <TabsList>
        <TabsTrigger value="tab1">Tab 1</TabsTrigger>
        <TabsTrigger value="tab2">Tab 2</TabsTrigger>
      </TabsList>
      <TabsContent value="tab1">Content 1</TabsContent>
      <TabsContent value="tab2">Content 2</TabsContent>
    </Tabs>
  )
}`}
			props={[
				{ name: "defaultValue", type: "string", description: "Default active tab (uncontrolled)" },
				{ name: "value", type: "string", description: "Controlled active tab" },
				{ name: "onValueChange", type: "(value: string) => void", description: "Change callback" },
				{ name: "className", type: "string", description: "Additional CSS classes" },
			]}
		/>
	);
}
