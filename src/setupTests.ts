import "@testing-library/jest-dom/vitest";
import { beforeEach, afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

beforeEach(() => {
	// mock console methods to avoid cluttering test output
	vi.spyOn(console, "error").mockImplementation(() => {});
	vi.spyOn(console, "warn").mockImplementation(() => {});
	vi.spyOn(console, "log").mockImplementation(() => {});
});

afterEach(() => {
	vi.restoreAllMocks();
	cleanup();
});
