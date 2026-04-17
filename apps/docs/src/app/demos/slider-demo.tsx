"use client";

import { useState } from "react";
import { Slider } from "../../components/ui";

/** Slider demo: single-thumb volume control + live value readout. */
export function SliderDemo() {
	const [value, setValue] = useState([33]);
	return (
		<div className="flex w-full max-w-sm flex-col gap-4">
			<div className="flex items-center justify-between text-sm">
				<span>Volume</span>
				<span className="text-muted-foreground">{value[0]}%</span>
			</div>
			<Slider
				aria-label="Volume"
				value={value}
				onValueChange={setValue}
				max={100}
				step={1}
			/>
		</div>
	);
}
