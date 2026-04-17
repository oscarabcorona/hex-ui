"use client";

import { ToggleGroup, ToggleGroupItem } from "../../components/ui";

/** ToggleGroup demo: single-select text alignment + multi-select formatting. */
export function ToggleGroupDemo() {
	return (
		<div className="flex flex-col gap-6">
			<div>
				<p className="mb-2 text-sm font-medium">Text alignment (single)</p>
				<ToggleGroup type="single" defaultValue="left" variant="outline">
					<ToggleGroupItem value="left" aria-label="Left align">
						L
					</ToggleGroupItem>
					<ToggleGroupItem value="center" aria-label="Center align">
						C
					</ToggleGroupItem>
					<ToggleGroupItem value="right" aria-label="Right align">
						R
					</ToggleGroupItem>
				</ToggleGroup>
			</div>
			<div>
				<p className="mb-2 text-sm font-medium">Formatting (multiple)</p>
				<ToggleGroup type="multiple">
					<ToggleGroupItem value="bold" aria-label="Bold">
						<span className="font-bold">B</span>
					</ToggleGroupItem>
					<ToggleGroupItem value="italic" aria-label="Italic">
						<span className="italic">I</span>
					</ToggleGroupItem>
					<ToggleGroupItem value="underline" aria-label="Underline">
						<span className="underline">U</span>
					</ToggleGroupItem>
				</ToggleGroup>
			</div>
		</div>
	);
}
