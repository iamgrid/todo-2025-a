import { render, screen } from "@testing-library/react";
import { it, expect, vi, describe, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import AddTodoForm from "./AddTodoForm";
import {
	MAX_TODO_TITLE_LENGTH,
	TODO_TITLE_LENGTH_ERROR_MESSAGE,
} from "../../helpers";

beforeEach(() => {
	// @ts-expect-error - matchMedia is not implemented in jsdom
	vi.spyOn(window, "matchMedia").mockImplementation((query) => {
		return {
			matches: query === "(pointer:fine)" ? true : false,
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
		};
	});
});

describe("AddTodoForm", () => {
	it("renders correctly", async () => {
		render(
			<AddTodoForm
				handleAddTodo={() => {}}
				focusNewTodoInputField={() => {}}
			/>
		);

		expect(
			screen.getByPlaceholderText("What needs to be done?")
		).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
	});

	it("shows validation message for input over max length", async () => {
		render(
			<AddTodoForm
				handleAddTodo={() => {}}
				focusNewTodoInputField={() => {}}
			/>
		);

		const input = screen.getAllByPlaceholderText("What needs to be done?");
		await userEvent.type(input[0], "a".repeat(MAX_TODO_TITLE_LENGTH + 2));

		expect(
			screen.getByText(
				TODO_TITLE_LENGTH_ERROR_MESSAGE +
					` (You are over by 2 characters.)`
			)
		).toBeInTheDocument();
	});
});
