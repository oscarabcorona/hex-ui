import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { detectFramework } from "../src/lib/detect-framework.js";

let tmpDir: string;

beforeEach(() => {
	tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "hex-detect-fw-"));
});

afterEach(() => {
	fs.rmSync(tmpDir, { recursive: true, force: true });
});

function writePkg(deps: Record<string, string>) {
	fs.writeFileSync(
		path.join(tmpDir, "package.json"),
		JSON.stringify({ name: "scratch", dependencies: deps }, null, 2),
	);
}

function mkdir(rel: string) {
	fs.mkdirSync(path.join(tmpDir, rel), { recursive: true });
}

describe("detectFramework", () => {
	it("identifies Next.js App Router with src/ layout", () => {
		writePkg({ next: "^16.0.0" });
		mkdir("src/app");
		const result = detectFramework(tmpDir);
		expect(result.kind).toBe("next-app");
		expect(result.srcDir).toBe(true);
		expect(result.entryHint).toBe("src/app/layout.tsx");
		expect(result.label).toContain("App Router");
	});

	it("identifies Next.js App Router without src/ layout", () => {
		writePkg({ next: "^16.0.0" });
		mkdir("app");
		const result = detectFramework(tmpDir);
		expect(result.kind).toBe("next-app");
		expect(result.srcDir).toBe(false);
		expect(result.entryHint).toBe("app/layout.tsx");
	});

	it("identifies Next.js Pages Router with src/", () => {
		writePkg({ next: "^15.0.0" });
		mkdir("src/pages");
		const result = detectFramework(tmpDir);
		expect(result.kind).toBe("next-pages");
		expect(result.srcDir).toBe(true);
		expect(result.entryHint).toBe("src/pages/_app.tsx");
	});

	it("prefers App Router when both app/ and pages/ coexist", () => {
		writePkg({ next: "^16.0.0" });
		mkdir("src/app");
		mkdir("src/pages");
		const result = detectFramework(tmpDir);
		expect(result.kind).toBe("next-app");
	});

	it("identifies Vite + React via dependency", () => {
		writePkg({ vite: "^5.0.0", react: "^19.0.0" });
		mkdir("src");
		fs.writeFileSync(path.join(tmpDir, "src", "main.tsx"), "");
		const result = detectFramework(tmpDir);
		expect(result.kind).toBe("vite");
		expect(result.entryHint).toBe("src/main.tsx");
	});

	it("identifies Vite + React via vite.config.ts when dep is missing", () => {
		writePkg({ react: "^19.0.0" });
		fs.writeFileSync(path.join(tmpDir, "vite.config.ts"), "export default {};");
		mkdir("src");
		fs.writeFileSync(path.join(tmpDir, "src", "main.tsx"), "");
		const result = detectFramework(tmpDir);
		expect(result.kind).toBe("vite");
	});

	it("identifies CRA via react-scripts dep", () => {
		writePkg({ "react-scripts": "5.0.0" });
		mkdir("src");
		const result = detectFramework(tmpDir);
		expect(result.kind).toBe("cra");
		expect(result.entryHint).toBe("src/index.tsx");
	});

	it("identifies CRACO and prefers it over CRA when both are declared", () => {
		writePkg({ "@craco/craco": "^7.0.0", "react-scripts": "5.0.0" });
		mkdir("src");
		const result = detectFramework(tmpDir);
		expect(result.kind).toBe("craco");
	});

	it("returns unknown when no framework signal is present", () => {
		writePkg({ react: "^19.0.0" });
		const result = detectFramework(tmpDir);
		expect(result.kind).toBe("unknown");
	});
});

describe("detectFramework — React Native", () => {
	it("identifies an Expo Router app", () => {
		writePkg({ expo: "^57.0.0", "expo-router": "^57.0.0", "react-native": "0.86.3" });
		mkdir("app");
		const result = detectFramework(tmpDir);
		expect(result.kind).toBe("expo-router");
		expect(result.platform).toBe("native");
		expect(result.entryHint).toBe("app/_layout.tsx");
		expect(result.label).toContain("expo-router");
	});

	it("identifies an Expo Router app with a src/ layout", () => {
		writePkg({ expo: "^57.0.0", "expo-router": "^57.0.0" });
		mkdir("src/app");
		const result = detectFramework(tmpDir);
		expect(result.kind).toBe("expo-router");
		expect(result.srcDir).toBe(true);
		expect(result.entryHint).toBe("src/app/_layout.tsx");
	});

	it("identifies a plain Expo app by its App entry", () => {
		writePkg({ expo: "^57.0.0", "react-native": "0.86.3" });
		fs.writeFileSync(path.join(tmpDir, "App.tsx"), "export default function App() {}");
		const result = detectFramework(tmpDir);
		expect(result.kind).toBe("expo");
		expect(result.platform).toBe("native");
		expect(result.entryHint).toBe("App.tsx");
	});

	it("identifies a bare React Native app", () => {
		writePkg({ "react-native": "0.86.3" });
		fs.writeFileSync(path.join(tmpDir, "App.tsx"), "export default function App() {}");
		const result = detectFramework(tmpDir);
		expect(result.kind).toBe("react-native");
		expect(result.platform).toBe("native");
	});

	// An Expo Router app has an `app/` directory and declares react-native.
	// Without the native branch running first, the Next.js check would claim
	// it and the project would be scaffolded for the DOM.
	it("prefers Expo over Next.js when an app/ directory is present", () => {
		writePkg({ expo: "^57.0.0", "expo-router": "^57.0.0", next: "^16.0.0" });
		mkdir("app");
		expect(detectFramework(tmpDir).kind).toBe("expo-router");
	});

	it("prefers Expo over bare react-native when both are declared", () => {
		writePkg({ expo: "^57.0.0", "react-native": "0.86.3" });
		expect(detectFramework(tmpDir).kind).toBe("expo");
	});

	it("reports web for every non-native framework", () => {
		writePkg({ next: "^16.0.0" });
		mkdir("app");
		expect(detectFramework(tmpDir).platform).toBe("web");

		writePkg({ vite: "^7.0.0" });
		expect(detectFramework(tmpDir).platform).toBe("web");
	});

	it("reports web for an unrecognised project", () => {
		const result = detectFramework(tmpDir);
		expect(result.kind).toBe("unknown");
		expect(result.platform).toBe("web");
	});
});
