import { render, screen } from "@testing-library/react";
import { it, expect } from "vitest";
import userEvent from "@testing-library/user-event";

import TodoList from "./TodoList";

import { type TTodo } from "../../todoStore";

const mockTodos: TTodo[] = [
	{
		id: 1,
		text: "B Test Todo 1",
		isCompleted: false,
		createdAt: "2024-01-01T10:00:00.000Z",
		lastUpdatedAt: null,
		completedAt: null,
	},
	{
		id: 2,
		text: "A Test Todo 2",
		isCompleted: true,
		createdAt: "2024-01-02T10:00:00.000Z",
		lastUpdatedAt: null,
		completedAt: "2024-01-02T14:00:00.000Z",
	},
];

it("renders correctly", async () => {
	render(
		<TodoList
			todos={mockTodos}
			noOfTodos={2}
			noOfIncompleteTodos={1}
			noOfCompletedTodos={1}
			handleToggleTodoCompletion={() => {}}
			handleDeleteTodo={() => {}}
			handleEditedTodoSubmission={() => {}}
		/>
	);

	expect(screen.getByText("B Test Todo 1")).toBeInTheDocument();
	expect(screen.getByText("A Test Todo 2")).toBeInTheDocument();
	const checkboxes = screen.getAllByLabelText("Todo completion checkbox");
	expect(checkboxes.length).toBe(2);
	expect(checkboxes[0]).not.toBeChecked();
	expect(checkboxes[1]).toBeChecked();
});

it("renders only incomplete todos when filter is set to incomplete", async () => {
	render(
		<TodoList
			todos={mockTodos}
			noOfTodos={2}
			noOfIncompleteTodos={1}
			noOfCompletedTodos={1}
			handleToggleTodoCompletion={() => {}}
			handleDeleteTodo={() => {}}
			handleEditedTodoSubmission={() => {}}
		/>
	);

	await userEvent.click(screen.getByLabelText("Incomplete (1)"));

	expect(screen.getByText("B Test Todo 1")).toBeInTheDocument();
	expect(screen.queryByText("A Test Todo 2")).not.toBeInTheDocument();
});

it("renders only completed todos when filter is set to completed", async () => {
	render(
		<TodoList
			todos={mockTodos}
			noOfTodos={2}
			noOfIncompleteTodos={1}
			noOfCompletedTodos={1}
			handleToggleTodoCompletion={() => {}}
			handleDeleteTodo={() => {}}
			handleEditedTodoSubmission={() => {}}
		/>
	);

	await userEvent.click(screen.getByLabelText("Completed (1)"));

	expect(screen.queryByText("B Test Todo 1")).not.toBeInTheDocument();
	expect(screen.getByText("A Test Todo 2")).toBeInTheDocument();
});

it("sorts todos by newest first when sort option is set", async () => {
	render(
		<TodoList
			todos={mockTodos}
			noOfTodos={2}
			noOfIncompleteTodos={1}
			noOfCompletedTodos={1}
			handleToggleTodoCompletion={() => {}}
			handleDeleteTodo={() => {}}
			handleEditedTodoSubmission={() => {}}
		/>
	);

	await userEvent.click(screen.getByLabelText("Newest First"));

	const todoItems = screen.getAllByRole("listitem");
	expect(todoItems.length).toBe(2);
	expect(todoItems[0]).toHaveTextContent("A Test Todo 2");
	expect(todoItems[1]).toHaveTextContent("B Test Todo 1");
});

it("sorts todos by oldest first when sort option is set", async () => {
	render(
		<TodoList
			todos={mockTodos}
			noOfTodos={2}
			noOfIncompleteTodos={1}
			noOfCompletedTodos={1}
			handleToggleTodoCompletion={() => {}}
			handleDeleteTodo={() => {}}
			handleEditedTodoSubmission={() => {}}
		/>
	);

	await userEvent.click(screen.getByLabelText("Oldest First"));

	const todoItems = screen.getAllByRole("listitem");
	expect(todoItems.length).toBe(2);
	expect(todoItems[0]).toHaveTextContent("B Test Todo 1");
	expect(todoItems[1]).toHaveTextContent("A Test Todo 2");
});

it("sorts todos by title A-Z when sort option is set", async () => {
	render(
		<TodoList
			todos={mockTodos}
			noOfTodos={2}
			noOfIncompleteTodos={1}
			noOfCompletedTodos={1}
			handleToggleTodoCompletion={() => {}}
			handleDeleteTodo={() => {}}
			handleEditedTodoSubmission={() => {}}
		/>
	);

	await userEvent.click(screen.getByLabelText("Title (A-Z)"));

	const todoItems = screen.getAllByRole("listitem");
	expect(todoItems.length).toBe(2);
	expect(todoItems[0]).toHaveTextContent("A Test Todo 2");
	expect(todoItems[1]).toHaveTextContent("B Test Todo 1");
});

it("shows dialog when delete button is clicked", async () => {
	render(
		<TodoList
			todos={mockTodos}
			noOfTodos={2}
			noOfIncompleteTodos={1}
			noOfCompletedTodos={1}
			handleToggleTodoCompletion={() => {}}
			handleDeleteTodo={() => {}}
			handleEditedTodoSubmission={() => {}}
		/>
	);

	const deleteButtons = screen.getAllByRole("button", {
		name: "Delete this todo",
	});
	expect(deleteButtons.length).toBe(2);
	await userEvent.click(deleteButtons[0]);

	expect(screen.getByRole("dialog")).toBeInTheDocument();
	expect(
		screen.getByText(/You are about to delete the following todo:/)
	).toBeInTheDocument();
});
