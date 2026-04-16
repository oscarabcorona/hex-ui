import * as React from "react";
import { cn } from "../../lib/utils.js";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, type, ...props }, ref) => {
		return (
			<input
				type={type}
				className={cn(
					"flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
					"transition-all duration-200 ease-out",
					"shadow-sm",
					"file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
					"placeholder:text-muted-foreground",
					"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
					"focus-visible:shadow-md focus-visible:border-ring/50",
					"hover:border-ring/30 hover:shadow-md",
					"disabled:cursor-not-allowed disabled:opacity-50",
					className,
				)}
				ref={ref}
				{...props}
			/>
		);
	},
);
Input.displayName = "Input";

export { Input };
