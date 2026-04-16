import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge class names with Tailwind CSS conflict resolution.
 * @param inputs - Class values (strings, arrays, objects) to merge
 * @returns A single merged class string with Tailwind conflicts resolved
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
