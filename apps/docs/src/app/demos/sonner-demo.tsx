"use client";

import { Button, Toaster, toast } from "../../components/ui";

/** Sonner demo: Toaster portal + buttons to trigger different toast variants. */
export function SonnerDemo() {
	return (
		<div className="flex flex-wrap gap-2">
			<Toaster position="bottom-right" richColors />
			<Button
				variant="outline"
				onClick={() =>
					toast("Event created", {
						description: "Friday, Dec 11 at 10:00 AM",
					})
				}
			>
				Show toast
			</Button>
			<Button variant="outline" onClick={() => toast.success("Profile saved")}>
				Success
			</Button>
			<Button variant="outline" onClick={() => toast.error("Failed to save")}>
				Error
			</Button>
		</div>
	);
}
