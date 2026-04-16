"use client";

import { ComponentPage } from "../../../../components/component-page";
import { ButtonDemo } from "../../../demos/button-demo";

export default function ButtonPage() {
	return (
		<ComponentPage
			name="Button"
			description="Displays a button or a component that looks like a button. Supports multiple variants, sizes, loading state, and asChild composition."
			preview={<ButtonDemo />}
			previewCode={`<Button>Default</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>
<Button variant="link">Link</Button>`}
			installCommand="pnpm dlx @hex-ui/cli add button"
			usageCode={`import { Button } from "@/components/ui/button"

export default function Example() {
  return <Button>Click me</Button>
}`}
			examples={[
				{
					title: "Sizes",
					preview: (
						<div className="flex items-center gap-4">
							<button className="inline-flex items-center justify-center rounded-md bg-primary px-3 h-9 text-sm font-medium text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary/90 active:scale-[0.98]">Small</button>
							<button className="inline-flex items-center justify-center rounded-md bg-primary px-4 h-10 text-sm font-medium text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary/90 active:scale-[0.98]">Default</button>
							<button className="inline-flex items-center justify-center rounded-md bg-primary px-8 h-11 text-base font-medium text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary/90 active:scale-[0.98]">Large</button>
						</div>
					),
					code: `<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>`,
				},
				{
					title: "Loading",
					preview: (
						<button className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 h-10 text-sm font-medium text-primary-foreground shadow-sm opacity-80" disabled>
							<svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
								<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
								<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
							</svg>
							Submitting...
						</button>
					),
					code: `<Button loading>Submitting...</Button>`,
				},
				{
					title: "As Link",
					preview: (
						<a href="#" className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 h-10 text-sm font-medium shadow-sm transition-all duration-200 hover:bg-accent hover:shadow-md active:scale-[0.98]">
							Login
						</a>
					),
					code: `<Button variant="outline" asChild>
  <a href="/login">Login</a>
</Button>`,
				},
			]}
			props={[
				{ name: "variant", type: '"default" | "destructive" | "outline" | "secondary" | "ghost" | "link"', default: '"default"', description: "The visual style of the button" },
				{ name: "size", type: '"default" | "sm" | "lg" | "icon"', default: '"default"', description: "The size of the button" },
				{ name: "asChild", type: "boolean", default: "false", description: "Render as child element via Radix Slot" },
				{ name: "loading", type: "boolean", default: "false", description: "Show spinner and disable interaction" },
				{ name: "disabled", type: "boolean", default: "false", description: "Disable the button" },
				{ name: "className", type: "string", description: "Additional CSS classes" },
			]}
		/>
	);
}
