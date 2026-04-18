"use client";

import { useState } from "react";
import { Calendar } from "../../components/ui";

/** Calendar demo: single-date selection bound to local state. */
export function CalendarDemo() {
	const [date, setDate] = useState<Date | undefined>(new Date());

	return (
		<Calendar
			mode="single"
			selected={date}
			onSelect={setDate}
			className="rounded-md border"
		/>
	);
}
