"use client";

import { Label, RadioGroup, RadioGroupItem } from "../../components/ui";

/** RadioGroup demo: spacing preference. */
export function RadioGroupDemo() {
	return (
		<RadioGroup defaultValue="comfortable">
			<div className="flex items-center gap-2">
				<RadioGroupItem value="default" id="rg-r1" />
				<Label htmlFor="rg-r1">Default</Label>
			</div>
			<div className="flex items-center gap-2">
				<RadioGroupItem value="comfortable" id="rg-r2" />
				<Label htmlFor="rg-r2">Comfortable</Label>
			</div>
			<div className="flex items-center gap-2">
				<RadioGroupItem value="compact" id="rg-r3" />
				<Label htmlFor="rg-r3">Compact</Label>
			</div>
		</RadioGroup>
	);
}
