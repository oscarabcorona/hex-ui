"use client";

import { useState } from "react";
import { DatePicker } from "../../components/ui";

/**
 * DatePicker demo: three variants — uncontrolled-empty, pre-selected value, and
 * a disabled trigger.
 */
export function DatePickerDemo() {
	const [date, setDate] = useState<Date | undefined>();
	const [preset, setPreset] = useState<Date | undefined>(new Date());

	return (
		<div className="flex flex-col gap-4">
			<div>
				<p className="mb-2 text-xs font-medium text-muted-foreground">Empty</p>
				<DatePicker value={date} onChange={setDate} />
			</div>
			<div>
				<p className="mb-2 text-xs font-medium text-muted-foreground">
					Pre-selected
				</p>
				<DatePicker value={preset} onChange={setPreset} />
			</div>
			<div>
				<p className="mb-2 text-xs font-medium text-muted-foreground">Disabled</p>
				<DatePicker disabled />
			</div>
		</div>
	);
}
