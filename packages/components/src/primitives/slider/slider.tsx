import * as SliderPrimitive from "@radix-ui/react-slider";
import * as React from "react";
import { cn } from "../../lib/utils.js";

/**
 * A range input with one or more draggable thumbs.
 * Built on Radix UI Slider with keyboard controls (arrows, Home, End, PageUp/Down).
 */
const Slider = React.forwardRef<
	React.ComponentRef<typeof SliderPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
	<SliderPrimitive.Root
		ref={ref}
		className={cn("relative flex w-full touch-none select-none items-center", className)}
		{...props}
	>
		<SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
			<SliderPrimitive.Range className="absolute h-full bg-primary" />
		</SliderPrimitive.Track>
		{(props.value ?? props.defaultValue ?? [0]).map((_, i) => (
			<SliderPrimitive.Thumb
				// biome-ignore lint/suspicious/noArrayIndexKey: Radix renders one thumb per value by index
				key={i}
				className={cn(
					"block h-5 w-5 rounded-full border-2 border-primary bg-background",
					"transition-all duration-200 ease-out shadow-md",
					"hover:shadow-lg hover:scale-110",
					"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
					"disabled:pointer-events-none disabled:opacity-50",
				)}
			/>
		))}
	</SliderPrimitive.Root>
));
Slider.displayName = "Slider";

export { Slider };
