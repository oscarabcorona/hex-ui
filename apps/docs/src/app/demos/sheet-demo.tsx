"use client";

import {
	Button,
	Input,
	Label,
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "../../components/ui";

/** Sheet demo: right-side slide-in edit panel. */
export function SheetDemo() {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="outline">Open sheet</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Edit profile</SheetTitle>
					<SheetDescription>Make changes and save when done.</SheetDescription>
				</SheetHeader>
				<div className="grid gap-4 py-4">
					<div className="grid gap-2">
						<Label htmlFor="sheet-name">Name</Label>
						<Input id="sheet-name" defaultValue="Jane Doe" />
					</div>
					<div className="grid gap-2">
						<Label htmlFor="sheet-email">Email</Label>
						<Input id="sheet-email" defaultValue="jane@example.com" />
					</div>
				</div>
				<SheetFooter>
					<SheetClose asChild>
						<Button>Save changes</Button>
					</SheetClose>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
