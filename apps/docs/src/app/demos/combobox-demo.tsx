"use client";

import { useState } from "react";
import { Combobox } from "../../components/ui";

const frameworks = [
	{ value: "next", label: "Next.js" },
	{ value: "remix", label: "Remix" },
	{ value: "astro", label: "Astro" },
	{ value: "nuxt", label: "Nuxt" },
	{ value: "sveltekit", label: "SvelteKit" },
];

/** Combobox demo: searchable single-select with a small static list. */
export function ComboboxDemo() {
	const [value, setValue] = useState<string>();

	return (
		<Combobox
			options={frameworks}
			value={value}
			onChange={setValue}
			placeholder="Select a framework"
			searchPlaceholder="Search framework…"
		/>
	);
}
