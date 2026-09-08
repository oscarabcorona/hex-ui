/**
 * Schema-quality gate — the bar every registry item's `ai` block must clear
 * for the catalog's machine-readable intent metadata to stay trustworthy.
 *
 * Two tiers:
 *
 * - **ERROR** (exit 1): structural lies an agent would act on — a missing or
 *   placeholder `ai` field, prose too short to carry intent, an
 *   `insteadUse`/`relatedComponents` slug that resolves to nothing, an item
 *   with no example. These make `describe_intent` worse than silence.
 * - **WARN** (reported, never gating): coverage metrics for the 0.4.0
 *   AI-native extensions (`useWhen` per variant value, `antiPatterns` on
 *   variant-bearing items, `composition` tags on examples) and declared
 *   `tokenBudget` drift vs the measured `get_component_schema` wire shape.
 *   These are a backfill worklist, not merge blockers.
 *
 * Reads the committed repo-root `registry/` (the source of truth CI diffs
 * against), not the payload bundle. The wire shape is imported from the MCP
 * tool rather than re-derived — same rule as scripts/audit-tokens.ts.
 *
 * Convention follows scripts/audit-tokens.ts (ESM, no shebang, run via tsx).
 *
 *   pnpm run verify:schema-quality
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { encode } from "gpt-tokenizer/encoding/cl100k_base";

import { registryItemSchema, type RegistryItem } from "../packages/registry/src/schema.js";
import {
	internalDepToSlug,
	resolveInternalDepForPlatform,
} from "../packages/registry/src/recipe-schema.js";
import { NATIVE_SLUG_PREFIX } from "../packages/registry/src/derive-native.js";
import { schemaWireShape } from "../packages/mcp-server/src/tools/get-component-schema.js";

const REPO_ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const REGISTRY_INDEX = join(REPO_ROOT, "registry/registry.json");
const REGISTRY_ITEMS_DIR = join(REPO_ROOT, "registry/items");

/** Minimum length for the three load-bearing `ai` prose fields. */
const MIN_PROSE_CHARS = 40;
/** Minimum length for the item description shown in every search row. */
const MIN_DESCRIPTION_CHARS = 20;
/**
 * Authoring-scaffold leftovers. Deliberately does NOT include the word
 * "placeholder" — a UI library legitimately says it (Skeleton, Input) — and
 * matches TODO/FIXME case-sensitively so prose like "a todo list block"
 * passes while the uppercase scaffold convention is caught.
 */
const SCAFFOLD_RES = [/\b(TODO|FIXME)\b/, /\b(TBD|lorem)\b/i];
/**
 * Declared `tokenBudget` is acceptable within this band of the measured
 * wire-shape size. Outside it, ranking consumers are being misinformed.
 */
const BUDGET_RATIO_MIN = 0.5;
const BUDGET_RATIO_MAX = 1.5;

const tok = (s: string): number => encode(s).length;

/**
 * DOM idioms that cannot appear in a React Native item's `ai` prose or
 * example code. Each is a thing an agent would copy verbatim into an Expo
 * app and get a runtime error or a silent no-op for:
 *
 * - `onClick` — RN uses `onPress`
 * - `hover:` / `focus-visible:` — no pointer hover, no focus ring on touch
 * - `href=` — navigation goes through the router, not an anchor
 * - DOM elements — `<div>`, `<span>`, `<button>`, … do not exist in RN
 *
 * Two things are deliberately NOT listed. `aria-*` works: React Native
 * ≥0.71 accepts `aria-label`, `aria-hidden` and friends as alias props, and
 * the native schemas use them. `asChild` works too: `@rn-primitives/slot`
 * implements the same Slot composition Radix does, and every overlay
 * primitive accepts it.
 */
interface LeakRule {
	re: RegExp;
	label: string;
	/**
	 * When set, a mention that is explicitly negated is allowed. Saying
	 * "touch has no hover" is exactly the guidance a native schema should
	 * carry; promising "hover fill" is the defect.
	 */
	allowNegated?: true;
}

/** Negation words that make a mention a warning rather than a promise. */
const NEGATION = /\b(?:no|not|never|without|cannot|can't|unlike|rather than|instead of)\b/i;

/**
 * Whether every occurrence of `re` in `text` sits in a clause that negates it.
 *
 * "Touch has no hover" is the guidance a native schema should carry; "hover
 * fill" is the defect. Both contain the word, so the rule looks at the clause
 * the match sits in — bounded by sentence punctuation — for a negation ahead
 * of it.
 * @param text - The prose being checked
 * @param re - The leak pattern
 * @returns True when at least one occurrence is stated positively
 */
function hasUnnegatedMatch(text: string, re: RegExp): boolean {
	const scan = new RegExp(re.source, re.flags.includes("g") ? re.flags : `${re.flags}g`);
	for (const match of text.matchAll(scan)) {
		const clauseStart = Math.max(
			text.lastIndexOf(".", match.index),
			text.lastIndexOf(";", match.index),
			text.lastIndexOf(":", match.index),
			-1,
		);
		if (!NEGATION.test(text.slice(clauseStart + 1, match.index))) return true;
	}
	return false;
}

const NATIVE_DOM_LEAKS: LeakRule[] = [
	{ re: /\bonClick\b/, label: "onClick" },
	{ re: /\bhover:/, label: "hover: variant" },
	{ re: /\bfocus-visible:/, label: "focus-visible: variant" },
	{ re: /\bhref=/, label: "href attribute" },
	{ re: /<(?:div|span|button|input|textarea|select|a|p|ul|ol|li|form|label|img|h[1-6])\b/, label: "DOM element" },
	// The checks above only caught class names and code. Derived schemas
	// inherit web prose verbatim, and it was the ENGLISH that leaked: three
	// native-button variants described "hover fill", native-card promised
	// "hover effects", and native-message documented a `data-role` attribute.
	{ re: /\bhover\b/i, label: "the word 'hover' (touch has none)", allowNegated: true },
	{ re: /\bfocus ring\b/i, label: "'focus ring' (React Native draws none)", allowNegated: true },
	{ re: /\bdata-[a-z]/i, label: "a data-* attribute (React Native has no DOM attributes)" },
	{ re: /\bCSS classes?\b/i, label: "'CSS classes' (say NativeWind classes)" },
];

/**
 * Run the platform-consistency checks for one parsed item.
 *
 * Web items may not carry the native prefix; native items must, and must
 * not leak DOM idioms into the prose or examples an agent will copy.
 * @param item - The parsed registry item
 * @returns Human-readable failure strings (empty when the item passes)
 */
function checkPlatform(item: RegistryItem): string[] {
	const errors: string[] = [];
	const prefixed = item.name.startsWith(NATIVE_SLUG_PREFIX);

	if (item.platform === "web" && prefixed) {
		errors.push(`name carries the "${NATIVE_SLUG_PREFIX}" prefix but platform is "web"`);
		return errors;
	}
	if (item.platform !== "native") return errors;
	if (!prefixed) {
		errors.push(`platform is "native" but name does not start with "${NATIVE_SLUG_PREFIX}"`);
	}

	const { ai } = item;
	// Every prose surface, not just the hand-written ones. `deriveNativeSchema`
	// inherits props, variants, slots and example descriptions from the web
	// schema by default — so those are precisely where a DOM idiom arrives
	// without anyone typing it.
	const surfaces: Array<[string, string]> = [
		["description", item.description],
		["ai.whenToUse", ai.whenToUse],
		["ai.whenNotToUse", ai.whenNotToUse],
		["ai.accessibilityNotes", ai.accessibilityNotes],
		...ai.commonMistakes.map((m, i): [string, string] => [`ai.commonMistakes[${i}]`, m]),
		...(ai.antiPatterns ?? []).map((a, i): [string, string] => [`ai.antiPatterns[${i}].mistake`, a.mistake]),
		...item.props.map((p, i): [string, string] => [`props[${i}].description`, p.description]),
		...item.tags.map((t, i): [string, string] => [`tags[${i}]`, t]),
		...item.variants.flatMap((v, i): Array<[string, string]> => [
			[`variants[${i}].description`, v.description],
			...v.values.flatMap((value, j): Array<[string, string]> => [
				[`variants[${i}].values[${j}].description`, value.description],
				// `useWhen` is the field agents read to pick a variant, and it
				// inherits from the web schema like everything else.
				...(value.useWhen === undefined
					? []
					: [[`variants[${i}].values[${j}].useWhen`, value.useWhen] satisfies [string, string]]),
			]),
		]),
		...item.slots.map((s, i): [string, string] => [`slots[${i}].description`, s.description]),
		...item.examples.flatMap((e, i): Array<[string, string]> => [
			[`examples[${i}].code`, e.code],
			[`examples[${i}].description`, e.description],
		]),
	];
	for (const [field, text] of surfaces) {
		for (const { re, label, allowNegated } of NATIVE_DOM_LEAKS) {
			const leaks = allowNegated ? hasUnnegatedMatch(text, re) : re.test(text);
			if (leaks) errors.push(`${field} leaks a DOM idiom (${label}) into a native item`);
		}
	}
	return errors;
}

interface ItemReport {
	slug: string;
	errors: string[];
}

interface Coverage {
	variantValuesTotal: number;
	variantValuesWithUseWhen: number;
	variantItemsTotal: number;
	variantItemsWithAntiPatterns: number;
	examplesTotal: number;
	examplesWithComposition: number;
	budgetChecked: number;
	budgetInBand: number;
	budgetWorst: { slug: string; ratio: number }[];
}

/**
 * Run the ERROR-tier checks for one parsed item.
 * @param item - The parsed registry item
 * @param slugs - Every valid item slug, for reference resolution
 * @returns Human-readable failure strings (empty when the item passes)
 */
function checkItem(item: RegistryItem, slugs: Set<string>): string[] {
	const errors: string[] = [];
	const { ai } = item;

	if (item.description.trim().length < MIN_DESCRIPTION_CHARS) {
		errors.push(`description is under ${MIN_DESCRIPTION_CHARS} chars`);
	}
	for (const [field, value] of [
		["whenToUse", ai.whenToUse],
		["whenNotToUse", ai.whenNotToUse],
		["accessibilityNotes", ai.accessibilityNotes],
	] as const) {
		if (value.trim().length < MIN_PROSE_CHARS) {
			errors.push(`ai.${field} is under ${MIN_PROSE_CHARS} chars ("${value}")`);
		}
	}
	if (ai.whenToUse.trim() === ai.whenNotToUse.trim()) {
		errors.push("ai.whenToUse and ai.whenNotToUse are identical");
	}
	for (const [field, value] of [
		["description", item.description],
		["ai.whenToUse", ai.whenToUse],
		["ai.whenNotToUse", ai.whenNotToUse],
		["ai.accessibilityNotes", ai.accessibilityNotes],
	] as const) {
		for (const re of SCAFFOLD_RES) {
			const hit = re.exec(value);
			if (hit) errors.push(`${field} contains authoring placeholder "${hit[0]}"`);
		}
	}
	if (ai.tokenBudget === undefined) {
		errors.push("ai.tokenBudget is missing (run pnpm audit:tokens -- --update-budgets)");
	}
	if (item.examples.length === 0) {
		errors.push("no usage examples — agents compose from examples, not prop tables");
	}
	for (const related of ai.relatedComponents) {
		if (!slugs.has(related)) {
			errors.push(`ai.relatedComponents references unknown slug "${related}"`);
		}
	}
	for (const anti of ai.antiPatterns ?? []) {
		if (!slugs.has(anti.insteadUse)) {
			errors.push(`ai.antiPatterns insteadUse references unknown slug "${anti.insteadUse}"`);
		}
	}
	// `dependencies.internal` went unchecked, which is how the native items
	// shipped deps that resolved to nothing: the graph dropped their edges and
	// two MCP tools reported an install closure the catalog could not satisfy.
	// A dep that names a component must name one that exists, for this item's
	// platform.
	for (const dep of item.dependencies.internal) {
		if (internalDepToSlug(dep) === null) continue; // lib/* and friends
		const resolved = resolveInternalDepForPlatform(dep, item.platform ?? "web", (name) =>
			slugs.has(name),
		);
		if (resolved === null) {
			errors.push(
				`dependencies.internal "${dep}" resolves to no item for platform "${item.platform ?? "web"}"`,
			);
		}
	}
	return errors;
}

/**
 * Accumulate the WARN-tier coverage metrics for one parsed item.
 * @param item - The parsed registry item
 * @param coverage - The running totals to add into
 */
function tallyCoverage(item: RegistryItem, coverage: Coverage): void {
	for (const variant of item.variants) {
		for (const value of variant.values) {
			coverage.variantValuesTotal++;
			if (value.useWhen !== undefined && value.useWhen.trim().length > 0) {
				coverage.variantValuesWithUseWhen++;
			}
		}
	}
	if (item.variants.length > 0) {
		coverage.variantItemsTotal++;
		if ((item.ai.antiPatterns ?? []).length > 0) coverage.variantItemsWithAntiPatterns++;
	}
	for (const example of item.examples) {
		coverage.examplesTotal++;
		if ((example.composition ?? []).length > 0) coverage.examplesWithComposition++;
	}
	if (item.ai.tokenBudget !== undefined) {
		coverage.budgetChecked++;
		const measured = tok(JSON.stringify(schemaWireShape(item), null, 2));
		const ratio = measured / item.ai.tokenBudget;
		if (ratio >= BUDGET_RATIO_MIN && ratio <= BUDGET_RATIO_MAX) {
			coverage.budgetInBand++;
		} else {
			coverage.budgetWorst.push({ slug: item.name, ratio });
		}
	}
}

/**
 * Format a coverage fraction as `n/total (pct%)`.
 * @param n - Covered count
 * @param total - Total count
 * @returns The formatted fraction
 */
function pct(n: number, total: number): string {
	if (total === 0) return "n/a";
	return `${n}/${total} (${((n / total) * 100).toFixed(1)}%)`;
}

console.log("Schema quality gate — reading repo-root registry…");

const indexSlugs = new Set<string>();
{
	const index = JSON.parse(readFileSync(REGISTRY_INDEX, "utf8")) as {
		items: Array<{ name: string }>;
	};
	for (const entry of index.items) indexSlugs.add(entry.name);
}

const itemFiles = readdirSync(REGISTRY_ITEMS_DIR)
	.filter((f) => f.endsWith(".json"))
	.sort();
console.log(`  index slugs: ${indexSlugs.size}, item files: ${itemFiles.length}`);

const reports: ItemReport[] = [];
const coverage: Coverage = {
	variantValuesTotal: 0,
	variantValuesWithUseWhen: 0,
	variantItemsTotal: 0,
	variantItemsWithAntiPatterns: 0,
	examplesTotal: 0,
	examplesWithComposition: 0,
	budgetChecked: 0,
	budgetInBand: 0,
	budgetWorst: [],
};

for (const file of itemFiles) {
	const slug = file.replace(/\.json$/, "");
	const raw: unknown = JSON.parse(readFileSync(join(REGISTRY_ITEMS_DIR, file), "utf8"));
	const parsed = registryItemSchema.safeParse(raw);
	if (!parsed.success) {
		reports.push({
			slug,
			errors: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
		});
		continue;
	}
	const item = parsed.data;
	const errors = [...checkItem(item, indexSlugs), ...checkPlatform(item)];
	if (!indexSlugs.has(item.name)) {
		errors.push("item is not listed in registry.json — rebuild the registry");
	}
	if (errors.length > 0) reports.push({ slug, errors });
	tallyCoverage(item, coverage);
}

console.log("");
console.log("Coverage (WARN tier — backfill worklist, non-gating):");
console.log(`  variant values with useWhen:        ${pct(coverage.variantValuesWithUseWhen, coverage.variantValuesTotal)}`);
console.log(`  variant items with antiPatterns:    ${pct(coverage.variantItemsWithAntiPatterns, coverage.variantItemsTotal)}`);
console.log(`  examples with composition tags:     ${pct(coverage.examplesWithComposition, coverage.examplesTotal)}`);
console.log(`  tokenBudget within ${BUDGET_RATIO_MIN}–${BUDGET_RATIO_MAX}× measured:  ${pct(coverage.budgetInBand, coverage.budgetChecked)}`);
if (coverage.budgetWorst.length > 0) {
	const worst = [...coverage.budgetWorst]
		.sort((a, b) => Math.abs(Math.log(b.ratio)) - Math.abs(Math.log(a.ratio)))
		.slice(0, 5);
	console.log(
		`  worst budget drift: ${worst.map((w) => `${w.slug} (${w.ratio.toFixed(2)}×)`).join(", ")}`,
	);
}

if (reports.length > 0) {
	console.error("");
	console.error(`ERRORS — ${reports.length} item(s) fail the quality gate:`);
	for (const report of reports) {
		console.error(`\n  ${report.slug}`);
		for (const error of report.errors) console.error(`    ✗ ${error}`);
	}
	console.error(
		"\nFix the schema source (packages/components/src/**/*.schema.ts, packages/native/src/**/*.schema.ts or packages/motion/src/schemas/*.schema.ts), then run: pnpm run build:registry",
	);
	process.exit(1);
}

console.log(`\n✓ All ${itemFiles.length} items pass the quality gate.`);
