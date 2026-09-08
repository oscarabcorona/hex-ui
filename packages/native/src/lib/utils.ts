import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge class names with Tailwind-aware conflict resolution.
 *
 * Deliberately a copy of the web helper rather than an import from
 * `@hex-core/components`: that package is React DOM, and `hex add` ships
 * this file into the consumer's project alongside each component anyway.
 * NativeWind's platform prefixes (`ios:`, `android:`, `native:`) are
 * unknown to tailwind-merge and pass through untouched.
 * @param inputs - Class values (strings, arrays, conditionals) to merge
 * @returns The merged class string with later Tailwind utilities winning
 */
export function cn(...inputs: ClassValue[]): string {
	return twMerge(clsx(inputs));
}
