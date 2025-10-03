import { useMemo, useState, useEffect } from "react";

import List from "@mui/material/List";

import styled from "@emotion/styled";

import type { TTodo } from "../../todoStore";

import TodoListItem from "../TodoList/TodoListItem.tsx";
import AlertDialog from "../shared/AlertDialog.tsx";
import {
	FILTERING_OPTIONS,
	FRIENDLY_DATE_RERENDER_INTERVAL_MS,
	shortenPhrase,
	SORTING_OPTIONS,
	type TFilteringOption,
	type TSortingOption,
} from "../../helpers.tsx";
import FilterListButtons from "./FilterListButtons.tsx";
import SortListButtons from "./SortListButtons.tsx";

export interface TTodoListProps {
	todos: TTodo[];
	noOfTodos: number;
	noOfIncompleteTodos: number;
	noOfCompletedTodos: number;
	handleToggleTodoCompletion(todoId: number, newStatus: boolean): void;
	handleDeleteTodo(todoId: number): void;
	handleEditedTodoSubmission(editedTodoId: number, newText: string): void;
}

const TopFunctionsBar = styled("div")({
	display: "flex",
	flexWrap: "wrap",
	alignItems: "center",
	marginTop: "24px",
	marginBottom: "8px",
	gap: "16px",
});

export default function TodoList({
	todos,
	noOfTodos,
	noOfIncompleteTodos,
	noOfCompletedTodos,
	handleToggleTodoCompletion,
	handleDeleteTodo,
	handleEditedTodoSubmission,
}: TTodoListProps) {
	const [triggerFriendlyDateRerender, setTriggerFriendlyDateRerender] =
		useState<number>(0);
	const [isAlertDialogOpen, setIsAlertDialogOpen] = useState<boolean>(false);
	const [todoIdToDelete, setTodoIdToDelete] = useState<number | null>(null);
	const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
	const [currentSortingOption, setCurrentSortingOption] =
		useState<TSortingOption>("default");
	const [currentFilteringOption, setCurrentFilteringOption] =
		useState<TFilteringOption>("all");

	const sortedAndFilteredTodos = useMemo(() => {
		let filteredTodos: TTodo[] = [];

		if (currentFilteringOption === FILTERING_OPTIONS.all) {
			filteredTodos.push(...todos);
		} else {
			filteredTodos = todos.filter((todo) => {
				if (currentFilteringOption === FILTERING_OPTIONS.completed) {
					return todo.isCompleted === true;
				} else if (
					currentFilteringOption === FILTERING_OPTIONS.incomplete
				) {
					return todo.isCompleted === false;
				}
			});
		}

		const sortedTodos: TTodo[] = [...filteredTodos];

		if (currentSortingOption === SORTING_OPTIONS.default) {
			// sort by incomplete first then by newest first
			sortedTodos.sort((a, b) => {
				if (a.isCompleted && !b.isCompleted) {
					return 1;
				} else if (!a.isCompleted && b.isCompleted) {
					return -1;
				} else {
					const aDateObj = new Date(a.createdAt);
					const bDateObj = new Date(b.createdAt);
					return bDateObj.getTime() - aDateObj.getTime();
				}
			});
		} else if (
			currentSortingOption === SORTING_OPTIONS["date-created-desc"]
		) {
			sortedTodos.sort((a, b) => {
				const aDateObj = new Date(a.createdAt);
				const bDateObj = new Date(b.createdAt);
				return bDateObj.getTime() - aDateObj.getTime();
			});
		} else if (
			currentSortingOption === SORTING_OPTIONS["date-created-asc"]
		) {
			sortedTodos.sort((a, b) => {
				const aDateObj = new Date(a.createdAt);
				const bDateObj = new Date(b.createdAt);
				return aDateObj.getTime() - bDateObj.getTime();
			});
		} else if (currentSortingOption === SORTING_OPTIONS["title-asc"]) {
			sortedTodos.sort((a, b) => {
				return a.text.localeCompare(b.text);
			});
		}

		return sortedTodos;
	}, [todos, currentSortingOption, currentFilteringOption]);

	useEffect(() => {
		const functionSignature =
			"TodoList.tsx@rerender FriendlyDates useEffect()";
		const interval = setInterval(() => {
			setTriggerFriendlyDateRerender((prev) => prev + 1);
			console.log(functionSignature, "triggered");
		}, FRIENDLY_DATE_RERENDER_INTERVAL_MS);
		return () => clearInterval(interval);
	}, []);

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
			<TopFunctionsBar>
				<FilterListButtons
					noOfTodos={noOfTodos}
					noOfIncompleteTodos={noOfIncompleteTodos}
					noOfCompletedTodos={noOfCompletedTodos}
					currentFilteringOption={currentFilteringOption}
					setCurrentFilteringOption={setCurrentFilteringOption}
				/>
				<SortListButtons
					currentSortingOption={currentSortingOption}
					setCurrentSortingOption={setCurrentSortingOption}
				/>
			</TopFunctionsBar>
			<List>
				{sortedAndFilteredTodos.map((todo) => {
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
							triggerFriendlyDateRerender={
								triggerFriendlyDateRerender
							}
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
							{shortenPhrase(
								todoIdToDelete !== null &&
									todos.find(
										(todo) => todo.id === todoIdToDelete
									)?.text,
								100
							)}
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
