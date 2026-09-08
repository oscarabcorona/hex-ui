import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { FrameworkDetection } from "../src/lib/detect-framework.js";
import {
	emitBabelConfig,
	emitMetroConfig,
	entryImportsGlobalsCss,
	nativePeerDeps,
	nativeTemplateFiles,
	writeNativeTemplate,
} from "../src/lib/native-template.js";

let tmpDir: string;

beforeEach(() => {
	tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "hex-native-template-"));
});

afterEach(() => {
	fs.rmSync(tmpDir, { recursive: true, force: true });
});

/**
 * Build a detection result for one framework kind.
 * @param kind - The detected framework
 * @param srcDir - Whether the project uses a src/ layout
 * @returns A detection object
 */
function detection(kind: FrameworkDetection["kind"], srcDir = false): FrameworkDetection {
	return {
		kind,
		platform: "native",
		srcDir,
		entryHint: kind === "expo-router" ? "app/_layout.tsx" : "App.tsx",
		label: kind,
	};
}

/** The template rendered for an Expo project. */
const expoFiles = () => nativeTemplateFiles("/* css */", "/* tw */", detection("expo-router"));

describe("native template — Expo vs bare React Native", () => {
	// The default Metro/Babel config comes from a different package in each.
	// Writing the Expo form into a bare app makes Metro fail to start on a
	// module that was never installed.
	it("uses expo/metro-config for an Expo project", () => {
		expect(emitMetroConfig(false)).toContain('require("expo/metro-config")');
		expect(emitMetroConfig(false)).not.toContain("@react-native/metro-config");
	});

	it("uses @react-native/metro-config for a bare project", () => {
		expect(emitMetroConfig(true)).toContain('require("@react-native/metro-config")');
		expect(emitMetroConfig(true)).not.toContain('require("expo/metro-config")');
	});

	it("uses babel-preset-expo for an Expo project", () => {
		expect(emitBabelConfig(false)).toContain("babel-preset-expo");
	});

	it("uses the React Native preset for a bare project", () => {
		expect(emitBabelConfig(true)).toContain("module:@react-native/babel-preset");
		expect(emitBabelConfig(true)).not.toContain("babel-preset-expo");
	});

	// `jsxImportSource` is what makes `className` become a style. Without it
	// every component renders unstyled, which looks like a token problem.
	it("always points JSX at NativeWind", () => {
		for (const bare of [true, false]) {
			expect(emitBabelConfig(bare)).toContain('jsxImportSource: "nativewind"');
			expect(emitBabelConfig(bare)).toContain('"nativewind/babel"');
		}
	});

	it("installs the matching Babel preset for each project shape", () => {
		expect(nativePeerDeps(false)).toContain("babel-preset-expo");
		expect(nativePeerDeps(true)).toContain("@react-native/babel-preset");
		expect(nativePeerDeps(true)).not.toContain("babel-preset-expo");
	});

	it("selects the config flavour from the detected framework", () => {
		const bare = nativeTemplateFiles("/* css */", "/* tw */", detection("react-native"));
		const metro = bare.find((f) => f.path === "metro.config.js");
		expect(metro?.contents).toContain("@react-native/metro-config");
	});
});

describe("writeNativeTemplate", () => {
	it("writes every template file", () => {
		const writes = writeNativeTemplate(tmpDir, expoFiles(), () => false);
		expect(writes.every((w) => w.wrote)).toBe(true);
		for (const file of ["global.css", "tailwind.config.js", "metro.config.js", "babel.config.js"]) {
			expect(fs.existsSync(path.join(tmpDir, file))).toBe(true);
		}
	});

	it("skips a file that already exists", () => {
		fs.writeFileSync(path.join(tmpDir, "global.css"), "mine");
		const writes = writeNativeTemplate(tmpDir, expoFiles(), () => false);
		expect(writes.find((w) => w.path === "global.css")?.skipped).toBe(true);
		expect(fs.readFileSync(path.join(tmpDir, "global.css"), "utf8")).toBe("mine");
	});

	// Targeted overwrite used to no-op on this path, so the CLI told the user
	// to pass the flag they had just passed.
	it("replaces only the files the predicate approves", () => {
		fs.writeFileSync(path.join(tmpDir, "global.css"), "mine");
		fs.writeFileSync(path.join(tmpDir, "tailwind.config.js"), "mine");
		writeNativeTemplate(tmpDir, expoFiles(), (p) => p === "global.css");
		expect(fs.readFileSync(path.join(tmpDir, "global.css"), "utf8")).not.toBe("mine");
		expect(fs.readFileSync(path.join(tmpDir, "tailwind.config.js"), "utf8")).toBe("mine");
	});

	it("honours a src/ layout for the cn helper", () => {
		const files = nativeTemplateFiles("/* css */", "/* tw */", detection("expo-router", true));
		expect(files.some((f) => f.path === "src/lib/utils.ts")).toBe(true);
	});
});

describe("entryImportsGlobalsCss", () => {
	it("is false when the entry does not exist", () => {
		expect(entryImportsGlobalsCss(tmpDir, "app/_layout.tsx")).toBe(false);
	});

	it("is false when the entry does not import the stylesheet", () => {
		fs.mkdirSync(path.join(tmpDir, "app"), { recursive: true });
		fs.writeFileSync(path.join(tmpDir, "app/_layout.tsx"), "export default function L() {}");
		expect(entryImportsGlobalsCss(tmpDir, "app/_layout.tsx")).toBe(false);
	});

	it("is true once the import is present", () => {
		fs.mkdirSync(path.join(tmpDir, "app"), { recursive: true });
		fs.writeFileSync(path.join(tmpDir, "app/_layout.tsx"), 'import "../global.css";\n');
		expect(entryImportsGlobalsCss(tmpDir, "app/_layout.tsx")).toBe(true);
	});
});
