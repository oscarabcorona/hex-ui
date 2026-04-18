"use client";

import { useState } from "react";
import { DatePicker } from "../../components/ui";

/** DatePicker demo: popover-hosted calendar bound to a Date state. */
export function DatePickerDemo() {
	const [date, setDate] = useState<Date | undefined>();
	return <DatePicker value={date} onChange={setDate} />;
}
