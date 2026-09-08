import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { resolvePlatform, resolveSlugForPlatform } from "../src/lib/resolve-platform.js";

let tmpDir: string;

beforeEach(() => {
	tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "hex-resolve-platform-"));
});

afterEach(() => {
	fs.rmSync(tmpDir, { recursive: true, force: true });
});

/**
 * Write a package.json into the scratch project.
 * @param deps - Dependencies to declare
 */
function writePkg(deps: Record<string, string>): void {
	fs.writeFileSync(path.join(tmpDir, "package.json"), JSON.stringify({ name: "scratch", dependencies: deps }));
}

/**
 * Write a hex.config.json into the scratch project.
 * @param config - The config object
 */
function writeConfig(config: Record<string, unknown>): void {
	fs.writeFileSync(path.join(tmpDir, "hex.config.json"), JSON.stringify(config));
}

describe("resolvePlatform", () => {
	it("prefers an explicit flag over everything else", () => {
		writePkg({ expo: "^57.0.0" });
		writeConfig({ platform: "native" });
		expect(resolvePlatform(tmpDir, "web")).toMatchObject({ platform: "web", source: "flag" });
	});

	it("falls back to hex.config.json", () => {
		writePkg({ next: "^16.0.0" });
		writeConfig({ platform: "native" });
		expect(resolvePlatform(tmpDir)).toMatchObject({ platform: "native", source: "config" });
	});

	it("falls back to framework detection", () => {
		writePkg({ expo: "^57.0.0" });
		expect(resolvePlatform(tmpDir)).toMatchObject({ platform: "native", source: "detected" });
	});

	it("defaults to web with nothing to go on", () => {
		expect(resolvePlatform(tmpDir)).toMatchObject({ platform: "web", source: "detected" });
	});

	it("ignores a malformed config rather than throwing", () => {
		writePkg({ expo: "^57.0.0" });
		fs.writeFileSync(path.join(tmpDir, "hex.config.json"), "{ not json");
		expect(resolvePlatform(tmpDir).platform).toBe("native");
	});

	it("ignores an unrecognised platform value in the config", () => {
		writePkg({ next: "^16.0.0" });
		writeConfig({ platform: "flutter" });
		expect(resolvePlatform(tmpDir)).toMatchObject({ platform: "web", source: "detected" });
	});
});

describe("resolveSlugForPlatform", () => {
	const exists = (name: string): boolean => name === "native-button" || name === "button" || name === "data-table";

	it("leaves web slugs alone", () => {
		expect(resolveSlugForPlatform("button", "web", exists)).toEqual({ slug: "button", rewritten: false });
	});

	it("maps a bare slug onto its native item", () => {
		expect(resolveSlugForPlatform("button", "native", exists)).toEqual({
			slug: "native-button",
			rewritten: true,
		});
	});

	it("passes an already-native slug through unchanged", () => {
		expect(resolveSlugForPlatform("native-button", "native", exists)).toEqual({
			slug: "native-button",
			rewritten: false,
		});
	});

	// Rewriting unconditionally would report "native-data-table not found",
	// which sends the user looking for a typo instead of telling them the
	// component simply has no native port yet.
	it("keeps the original slug when no native port exists", () => {
		expect(resolveSlugForPlatform("data-table", "native", exists)).toEqual({
			slug: "data-table",
			rewritten: false,
		});
	});
});
