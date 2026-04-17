"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	Button,
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
} from "../../components/ui";

const formSchema = z.object({
	username: z
		.string()
		.min(2, { message: "Username must be at least 2 characters." })
		.max(30, { message: "Username must be 30 characters or fewer." }),
});

type FormValues = z.infer<typeof formSchema>;

/** Form demo: username form with zod validation and per-field error display. */
export function FormDemo() {
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: { username: "" },
	});

	function onSubmit(values: FormValues) {
		window.alert(`Submitted: ${JSON.stringify(values)}`);
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex w-full max-w-sm flex-col gap-6"
			>
				<FormField
					control={form.control}
					name="username"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Username</FormLabel>
							<FormControl>
								<Input placeholder="shadcn" {...field} />
							</FormControl>
							<FormDescription>Your public display name.</FormDescription>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit">Submit</Button>
			</form>
		</Form>
	);
}
