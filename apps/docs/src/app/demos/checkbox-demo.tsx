"use client";

import { useState } from "react";
import { Checkbox, Label } from "../../components/ui";

export function CheckboxDemo() {
	const [checked, setChecked] = useState(false);
	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center gap-2">
				<Checkbox
					id="terms"
					checked={checked}
					onCheckedChange={(v) => setChecked(v === true)}
				/>
				<Label htmlFor="terms">Accept terms and conditions</Label>
			</div>
			<div className="flex items-center gap-2">
				<Checkbox id="disabled" disabled />
				<Label htmlFor="disabled" className="text-muted-foreground">
					Disabled
				</Label>
			</div>
		</div>
	);
}
