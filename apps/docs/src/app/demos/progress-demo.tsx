"use client";

import { useEffect, useState } from "react";
import { Progress } from "../../components/ui";

/** Progress demo: animated progress bar that ticks up to 66%. */
export function ProgressDemo() {
	const [value, setValue] = useState(13);

	useEffect(() => {
		const timer = setTimeout(() => setValue(66), 500);
		return () => clearTimeout(timer);
	}, []);

	return (
		<div className="w-full max-w-sm space-y-2">
			<div className="flex items-center justify-between text-sm">
				<span>Uploading</span>
				<span className="text-muted-foreground">{value}%</span>
			</div>
			<Progress value={value} aria-label="Upload progress" />
		</div>
	);
}
