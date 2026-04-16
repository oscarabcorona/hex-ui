"use client";

import { useState } from "react";
import { Label, Switch } from "../../components/ui";

export function SwitchDemo() {
	const [enabled, setEnabled] = useState(false);
	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center gap-2">
				<Switch id="airplane" checked={enabled} onCheckedChange={setEnabled} />
				<Label htmlFor="airplane">
					Airplane Mode {enabled ? "(on)" : "(off)"}
				</Label>
			</div>
			<div className="flex items-center gap-2">
				<Switch id="disabled-switch" disabled />
				<Label htmlFor="disabled-switch" className="text-muted-foreground">
					Disabled
				</Label>
			</div>
		</div>
	);
}
