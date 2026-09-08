/**
 * The demo registry the playground routes render.
 *
 * `demos.generated.tsx` is written by `scripts/build-barrels.ts` from the
 * `<slug>.demo.tsx` files in `@hex-core/native`, so this list never drifts
 * from the package.
 */
export { demos, getDemo } from "./demos.generated";

import { demos } from "./demos.generated";

/**
 * Every demo slug, sorted — the index screen's list and the screenshot
 * script both iterate this.
 * @returns Sorted demo slugs
 */
export function demoSlugs(): string[] {
	return Object.keys(demos).sort();
}
