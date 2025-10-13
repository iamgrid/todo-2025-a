import { render, screen } from "@testing-library/react";
import { it, expect, vi, beforeEach, afterEach } from "vitest";

import App from "./App";

beforeEach(() => {
	// @ts-expect-error - matchMedia is not implemented by jsdom
	vi.spyOn(window, "matchMedia").mockImplementation((query) => {
		return {
			matches: query === "(pointer:fine)" ? true : false,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
		};
	});
});

afterEach(() => {
	vi.restoreAllMocks();
});

it("renders correctly", () => {
	render(<App />);

	expect(
		screen.getByRole("textbox", { name: /Add new todo/i })
	).toBeInTheDocument();
	expect(screen.getByRole("button", { name: /Add/i })).toBeInTheDocument();
	expect(screen.getByText(/You have no todos yet/i)).toBeInTheDocument();
});
