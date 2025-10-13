import { render, screen } from "@testing-library/react";
import { it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import TodoListItem from "./TodoListItem";

import { type TTodo } from "../../todoStore";

const mockTodo1: TTodo = {
	id: 1,
	text: "Test Todo",
	isCompleted: false,
	createdAt: new Date().toISOString(),
	lastUpdatedAt: null,
	completedAt: null,
};

const mockTodo2: TTodo = {
	id: 2,
	text: "Completed Todo",
	isCompleted: true,
	createdAt: new Date().toISOString(),
	lastUpdatedAt: null,
	completedAt: new Date().toISOString(),
};

it("renders correctly", async () => {
	render(
		<TodoListItem
			todo={mockTodo1}
			handleToggleTodoCompletion={() => {}}
			handleDeleteTodoProper={() => {}}
			isTodoBeingEdited={false}
			handleEditTodo={() => {}}
			handleEditedTodoSubmissionProper={() => {}}
			handleCancelEditing={() => {}}
			triggerFriendlyDateRerender={0}
		/>
	);

	expect(screen.getByText("Test Todo")).toBeInTheDocument();
	expect(
		screen.getByLabelText("Todo completion checkbox")
	).toBeInTheDocument();
	expect(
		screen.getByRole("button", { name: "Edit this todo" })
	).toBeInTheDocument();
	expect(
		screen.getByRole("button", { name: "Delete this todo" })
	).toBeInTheDocument();
});

it("renders completed todo as completed", () => {
	render(
		<TodoListItem
			todo={mockTodo2}
			handleToggleTodoCompletion={() => {}}
			handleDeleteTodoProper={() => {}}
			isTodoBeingEdited={false}
			handleEditTodo={() => {}}
			handleEditedTodoSubmissionProper={() => {}}
			handleCancelEditing={() => {}}
			triggerFriendlyDateRerender={0}
		/>
	);

	expect(screen.getByText("Completed Todo")).toBeInTheDocument();
	const checkbox = screen.getByLabelText("Todo completion checkbox");
	expect(checkbox).toBeInTheDocument();
	expect((checkbox as HTMLInputElement).checked).toBe(true);
});

it("calls handleToggleTodoCompletion when checkbox is clicked", async () => {
	const handleToggleTodoCompletionMock = vi.fn();
	render(
		<TodoListItem
			todo={mockTodo1}
			handleToggleTodoCompletion={handleToggleTodoCompletionMock}
			handleDeleteTodoProper={() => {}}
			isTodoBeingEdited={false}
			handleEditTodo={() => {}}
			handleEditedTodoSubmissionProper={() => {}}
			handleCancelEditing={() => {}}
			triggerFriendlyDateRerender={0}
		/>
	);

	const checkbox = screen.getByLabelText("Todo completion checkbox");
	await userEvent.click(checkbox);
	expect(handleToggleTodoCompletionMock).toHaveBeenCalledTimes(1);
	expect(handleToggleTodoCompletionMock).toHaveBeenCalledWith(1, true);
});

it("calls handleEditTodo when edit button is clicked", async () => {
	const handleEditTodoMock = vi.fn();

	render(
		<TodoListItem
			todo={mockTodo1}
			handleToggleTodoCompletion={() => {}}
			handleDeleteTodoProper={() => {}}
			isTodoBeingEdited={false}
			handleEditTodo={handleEditTodoMock}
			handleEditedTodoSubmissionProper={() => {}}
			handleCancelEditing={() => {}}
			triggerFriendlyDateRerender={0}
		/>
	);
	const editButton = screen.getByRole("button", { name: "Edit this todo" });
	await userEvent.click(editButton);
	expect(handleEditTodoMock).toHaveBeenCalledTimes(1);
	expect(handleEditTodoMock).toHaveBeenCalledWith(1);
});

it("shows EditTodoForm when isTodoBeingEdited is true", () => {
	render(
		<TodoListItem
			todo={mockTodo1}
			handleToggleTodoCompletion={() => {}}
			handleDeleteTodoProper={() => {}}
			isTodoBeingEdited={true}
			handleEditTodo={() => {}}
			handleEditedTodoSubmissionProper={() => {}}
			handleCancelEditing={() => {}}
			triggerFriendlyDateRerender={0}
		/>
	);

	expect(screen.getByRole("textbox")).toBeInTheDocument();
	expect(
		screen.getByRole("button", { name: "Save edited todo" })
	).toBeInTheDocument();
	expect(
		screen.getByRole("button", { name: "Cancel editing todo" })
	).toBeInTheDocument();
});

it("calls handleEditedTodoSubmissionProper with new text when edit form is submitted", async () => {
	const handleEditedTodoSubmissionProperMock = vi.fn();

	render(
		<TodoListItem
			todo={mockTodo1}
			handleToggleTodoCompletion={() => {}}
			handleDeleteTodoProper={() => {}}
			isTodoBeingEdited={true}
			handleEditTodo={() => {}}
			handleEditedTodoSubmissionProper={
				handleEditedTodoSubmissionProperMock
			}
			handleCancelEditing={() => {}}
			triggerFriendlyDateRerender={0}
		/>
	);

	const input = screen.getByRole("textbox");
	await userEvent.clear(input);
	await userEvent.type(input, "Updated Todo Text");
	const saveButton = screen.getByRole("button", { name: "Save edited todo" });
	await userEvent.click(saveButton);

	expect(handleEditedTodoSubmissionProperMock).toHaveBeenCalledTimes(1);
	expect(handleEditedTodoSubmissionProperMock).toHaveBeenCalledWith(
		1,
		"Updated Todo Text"
	);
});

it("disables the save button when edit input is empty", async () => {
	const handleEditedTodoSubmissionProperMock = vi.fn();

	render(
		<TodoListItem
			todo={mockTodo1}
			handleToggleTodoCompletion={() => {}}
			handleDeleteTodoProper={() => {}}
			isTodoBeingEdited={true}
			handleEditTodo={() => {}}
			handleEditedTodoSubmissionProper={
				handleEditedTodoSubmissionProperMock
			}
			handleCancelEditing={() => {}}
			triggerFriendlyDateRerender={0}
		/>
	);

	const input = screen.getByRole("textbox");
	await userEvent.clear(input);
	const saveButton = screen.getByRole("button", { name: "Save edited todo" });
	expect(saveButton).toBeDisabled();
});

it("calls handleCancelEditing when cancel button is clicked in edit form", async () => {
	const handleCancelEditingMock = vi.fn();

	render(
		<TodoListItem
			todo={mockTodo1}
			handleToggleTodoCompletion={() => {}}
			handleDeleteTodoProper={() => {}}
			isTodoBeingEdited={true}
			handleEditTodo={() => {}}
			handleEditedTodoSubmissionProper={() => {}}
			handleCancelEditing={handleCancelEditingMock}
			triggerFriendlyDateRerender={0}
		/>
	);

	const cancelButton = screen.getByRole("button", {
		name: "Cancel editing todo",
	});
	await userEvent.click(cancelButton);

	expect(handleCancelEditingMock).toHaveBeenCalledTimes(1);
});

it("calls handleDeleteTodoProper when delete button is clicked", async () => {
	const handleDeleteTodoProperMock = vi.fn();
	render(
		<TodoListItem
			todo={mockTodo1}
			handleToggleTodoCompletion={() => {}}
			handleDeleteTodoProper={handleDeleteTodoProperMock}
			isTodoBeingEdited={false}
			handleEditTodo={() => {}}
			handleEditedTodoSubmissionProper={() => {}}
			handleCancelEditing={() => {}}
			triggerFriendlyDateRerender={0}
		/>
	);

	const deleteButton = screen.getByRole("button", {
		name: "Delete this todo",
	});
	await userEvent.click(deleteButton);

	expect(handleDeleteTodoProperMock).toHaveBeenCalledTimes(1);
	expect(handleDeleteTodoProperMock).toHaveBeenCalledWith(1);
});
