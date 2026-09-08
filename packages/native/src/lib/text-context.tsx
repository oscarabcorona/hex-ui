import { createContext, useContext } from "react";

/**
 * Class names a parent wants applied to the `<Text>` elements inside it.
 *
 * React Native text does not inherit colour or size from its container the
 * way DOM text does, so a `Button` cannot make its label
 * `text-primary-foreground` by styling itself. Instead it provides that
 * class here and `Text` reads it. Same pattern React Native Reusables
 * uses; kept as a tiny shared module so every component agrees on it.
 */
export const TextClassContext = createContext<string | undefined>(undefined);

/**
 * Read the class names the nearest text-styling ancestor provided.
 * @returns The inherited class string, or undefined outside any provider
 */
export function useTextClass(): string | undefined {
	return useContext(TextClassContext);
}
