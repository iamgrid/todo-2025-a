import { render, screen } from "@testing-library/react";
import { it, expect, vi, beforeEach } from "vitest";
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

const newTodoInputFieldId = "test-new-todo-input-field-id";

it("renders correctly", async () => {
	render(
		<AddTodoForm
			handleAddTodo={() => {}}
			newTodoInputFieldId={newTodoInputFieldId}
			focusNewTodoInputField={() => {}}
		/>
	);

	expect(
		screen.getByPlaceholderText("What needs to be done?")
	).toBeInTheDocument();
	expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
});

it("shows validation message for input over max length, does not call handleAddTodo on submit", async () => {
	const handleAddTodoMock = vi.fn();
	render(
		<AddTodoForm
			handleAddTodo={handleAddTodoMock}
			newTodoInputFieldId={newTodoInputFieldId}
			focusNewTodoInputField={() => {}}
		/>
	);

	const input = screen.getAllByPlaceholderText("What needs to be done?");
	await userEvent.type(input[0], "a".repeat(MAX_TODO_TITLE_LENGTH + 2));

	expect(
		screen.getByText(
			`${TODO_TITLE_LENGTH_ERROR_MESSAGE} (You are over by 2 characters.)`
		)
	).toBeInTheDocument();

	await userEvent.type(input[0], "{Enter}");

	expect(handleAddTodoMock).not.toHaveBeenCalled();
});

it("does not call handleAddTodo with empty input", async () => {
	const handleAddTodoMock = vi.fn();
	const focusNewTodoInputFieldMock = vi.fn();

	render(
		<AddTodoForm
			handleAddTodo={handleAddTodoMock}
			newTodoInputFieldId={newTodoInputFieldId}
			focusNewTodoInputField={focusNewTodoInputFieldMock}
		/>
	);

	const addButton = screen.getByRole("button", { name: "Add" });
	await userEvent.click(addButton);

	expect(handleAddTodoMock).not.toHaveBeenCalled();
	expect(focusNewTodoInputFieldMock).toHaveBeenCalled();
});

it("calls handleAddTodo with valid input and resets form", async () => {
	const handleAddTodoMock = vi.fn();
	const focusNewTodoInputFieldMock = vi.fn();

	render(
		<AddTodoForm
			handleAddTodo={handleAddTodoMock}
			newTodoInputFieldId={newTodoInputFieldId}
			focusNewTodoInputField={focusNewTodoInputFieldMock}
		/>
	);

	const input = screen.getAllByPlaceholderText("What needs to be done?");
	await userEvent.type(input[0], "New Todo Item");

	const addButton = screen.getByRole("button", { name: "Add" });
	await userEvent.click(addButton);
	// await userEvent.type(input[0], "{Enter}");

	expect(handleAddTodoMock).toHaveBeenCalledWith("New Todo Item");
	expect((input[0] as HTMLInputElement).value).toBe("");
	expect(focusNewTodoInputFieldMock).toHaveBeenCalled();
});
