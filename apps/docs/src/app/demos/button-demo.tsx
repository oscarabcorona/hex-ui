"use client";

import { Button } from "../../components/ui";

export function ButtonDemo() {
	return (
		<div className="flex flex-wrap items-center justify-center gap-3">
			<Button>Default</Button>
			<Button variant="outline">Outline</Button>
			<Button variant="secondary">Secondary</Button>
			<Button variant="ghost">Ghost</Button>
			<Button variant="destructive">Delete</Button>
			<Button variant="link">Link</Button>
			<Button size="sm">Small</Button>
			<Button size="lg">Large</Button>
			<Button loading>Loading...</Button>
		</div>
	);
}
