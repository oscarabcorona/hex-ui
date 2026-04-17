"use client";

import { Toggle } from "../../components/ui";

/** Toggle demo: individual bold/italic/underline toggles in both variants. */
export function ToggleDemo() {
	return (
		<div className="flex flex-wrap items-center gap-3">
			<Toggle aria-label="Toggle bold">
				<span className="font-bold">B</span>
			</Toggle>
			<Toggle aria-label="Toggle italic" variant="outline">
				<span className="italic">I</span>
			</Toggle>
			<Toggle aria-label="Toggle underline" size="lg">
				<span className="underline">U</span>
			</Toggle>
			<Toggle aria-label="Disabled" disabled>
				<span>D</span>
			</Toggle>
		</div>
	);
}
