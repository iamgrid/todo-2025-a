import { useState } from "react";
import type { TTodo } from "../../todoStore";
import List from "@mui/material/List";
import TodoListItem from "../TodoList/TodoListItem.tsx";
import AlertDialog from "../shared/AlertDialog.tsx";

export interface TTodoListProps {
	todos: TTodo[];
	handleToggleTodoCompletion(todoId: number, newStatus: boolean): void;
	handleDeleteTodo(todoId: number): void;
	handleEditedTodoSubmission(editedTodoId: number, newText: string): void;
}

export default function TodoList({
	todos,
	handleToggleTodoCompletion,
	handleDeleteTodo,
	handleEditedTodoSubmission,
}: TTodoListProps) {
	const [isAlertDialogOpen, setIsAlertDialogOpen] = useState<boolean>(false);
	const [todoIdToDelete, setTodoIdToDelete] = useState<number | null>(null);
	const [editingTodoId, setEditingTodoId] = useState<number | null>(null);

	function handleDeleteTodoProper(todoId: number) {
		setIsAlertDialogOpen(true);
		setTodoIdToDelete(todoId);
	}

	function handleEditTodo(editedTodoId: number): void {
		setEditingTodoId(editedTodoId);
	}

	function handleEditedTodoSubmissionProper(
		editedTodoId: number,
		newText: string
	): void {
		handleEditedTodoSubmission(editedTodoId, newText);
		setEditingTodoId(null);
	}

	function handleCancelEditing(): void {
		setEditingTodoId(null);
	}

	return (
		<>
			<List>
				{todos.map((todo) => {
					return (
						<TodoListItem
							key={todo.id}
							todo={todo}
							handleToggleTodoCompletion={
								handleToggleTodoCompletion
							}
							handleDeleteTodoProper={handleDeleteTodoProper}
							isTodoBeingEdited={editingTodoId === todo.id}
							handleEditTodo={handleEditTodo}
							handleEditedTodoSubmissionProper={
								handleEditedTodoSubmissionProper
							}
							handleCancelEditing={handleCancelEditing}
						/>
					);
				})}
			</List>
			<AlertDialog
				isOpen={isAlertDialogOpen}
				description={
					<>
						<span>You are about to delete the following todo:</span>
						<br />
						<span style={{ fontWeight: "bold" }}>
							{todoIdToDelete !== null &&
								todos.find((todo) => todo.id === todoIdToDelete)
									?.text}
						</span>
					</>
				}
				confirmButtonText="Delete Todo"
				confirmButtonColor="error"
				handleCancel={() => setIsAlertDialogOpen(false)}
				handleConfirm={() => {
					const functionSignature = "TodoList.tsx@handleConfirm()";
					if (todoIdToDelete !== null) {
						handleDeleteTodo(todoIdToDelete);
						setTodoIdToDelete(null);
					} else {
						console.error(
							functionSignature,
							"todoIdToDelete is null"
						);
					}

					setIsAlertDialogOpen(false);
				}}
			/>
		</>
	);
}
