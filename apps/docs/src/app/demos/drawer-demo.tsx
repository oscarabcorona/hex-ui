"use client";

import {
	Button,
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "../../components/ui";

/** Drawer demo: bottom-sheet with drag-to-dismiss and footer actions. */
export function DrawerDemo() {
	return (
		<Drawer>
			<DrawerTrigger asChild>
				<Button variant="outline">Open drawer</Button>
			</DrawerTrigger>
			<DrawerContent>
				<div className="mx-auto w-full max-w-sm">
					<DrawerHeader>
						<DrawerTitle>Are you sure?</DrawerTitle>
						<DrawerDescription>This action cannot be undone.</DrawerDescription>
					</DrawerHeader>
					<DrawerFooter>
						<Button>Confirm</Button>
						<DrawerClose asChild>
							<Button variant="outline">Cancel</Button>
						</DrawerClose>
					</DrawerFooter>
				</div>
			</DrawerContent>
		</Drawer>
	);
}
