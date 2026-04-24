import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Avoid leaked DOM between tests — each test gets a clean slate.
afterEach(() => {
	cleanup();
});
