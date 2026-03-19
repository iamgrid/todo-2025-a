import { useState, useEffect, useMemo, useId, useCallback } from "react";

import useTodoStore from "./useTodoStore.tsx";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
// import ButtonGroup from "@mui/material/ButtonGroup";
import Box from "@mui/material/Box";
// import Snackbar from "@mui/material/Snackbar";

import { ThemeProvider } from "@mui/material";
import { styled } from "@mui/material/styles";
import customTheme from "./customTheme.ts";

import TodoList from "./components/TodoList/TodoList.tsx";
import AlertDialog from "./components/shared/AlertDialog.tsx";
import AddTodoForm from "./components/AddTodoForm/AddTodoForm.tsx";
import AboutThisProject from "./components/AboutThisProject/AboutThisProject.tsx";

import appLogo from "./assets/todo-2025-a-logo.svg";

import "./overrides.css";
import Footer from "./components/Footer/Footer.tsx";

const MainWrapper = styled("div")(({ theme }) => ({
	backgroundColor: theme.palette.background.paper,
	padding: theme.spacing(3),
	borderRadius: theme.shape.borderRadius,
	boxShadow: "0 0 5px 3px rgba(80, 116, 152, .7)",
}));

function App() {
	const newTodoInputFieldId = useId();
	const {
		todoStoreTodos,
		addTodo,
		toggleTodoCompletion,
		updateTodoText,
		deleteTodo,
		completeAllTodos,
		clearCompletedTodos,
		// isLocalStorageWorking,
	} = useTodoStore();

	const [isCompleteAllAlertDialogOpen, setIsCompleteAllAlertDialogOpen] =
		useState<boolean>(false);
	const [
		isClearCompletedAlertDialogOpen,
		setIsClearCompletedAlertDialogOpen,
	] = useState<boolean>(false);

	const {
		noOfTodos,
		noOfIncompleteTodos,
		noOfCompletedTodos,
	}: {
		noOfTodos: number;
		noOfIncompleteTodos: number;
		noOfCompletedTodos: number;
	} = useMemo(() => {
		if (
			typeof todoStoreTodos === "undefined" ||
			todoStoreTodos === "initializing"
		) {
			return {
				noOfTodos: 0,
				noOfIncompleteTodos: 0,
				noOfCompletedTodos: 0,
			};
		}

		const noOfTodos = todoStoreTodos.length;
		const noOfIncompleteTodos = todoStoreTodos.filter(
			(todo) => !todo.isCompleted,
		).length;
		const noOfCompletedTodos = noOfTodos - noOfIncompleteTodos;

		return { noOfTodos, noOfIncompleteTodos, noOfCompletedTodos };
	}, [todoStoreTodos]);

	const focusNewTodoInputField = useCallback(() => {
		const functionSignature = "App.tsx@focusNewTodoInputField()";

		const newTodoInputField = document.getElementById(
			newTodoInputFieldId,
		) as HTMLInputElement | null;
		if (newTodoInputField !== null) {
			newTodoInputField.focus();
		} else {
			console.error(
				functionSignature,
				"Could not find new todo input field in the DOM!",
			);
		}
	}, [newTodoInputFieldId]);

	useEffect(() => {
		const functionSignature = "App.tsx@keyDownHandler useEffect()";

		const keyDownHandler = (event: KeyboardEvent) => {
			const functionSignature = "App.tsx@keyDownHandler()";
			// console.log(functionSignature, "Key down event detected");
			if (event.key === "Enter" && event.ctrlKey) {
				console.log(functionSignature, "Ctrl+Enter detected");
				event.preventDefault();
				focusNewTodoInputField();
				window.scrollTo(0, 0);
			}
		};
		console.log(functionSignature, "Adding global keydown event listener");
		window.addEventListener("keydown", keyDownHandler);

		return () => {
			console.log(
				functionSignature,
				"Removing global keydown event listener",
			);
			window.removeEventListener("keydown", keyDownHandler);
		};
	}, [focusNewTodoInputField]);

	function handleAddTodo(newTodoText: string) {
		addTodo(newTodoText);
	}

	function handleToggleTodoCompletion(todoId: number, newStatus: boolean) {
		toggleTodoCompletion(todoId, newStatus);
	}

	function handleDeleteTodo(todoId: number) {
		deleteTodo(todoId);
	}

	function handleEditedTodoSubmission(editedTodoId: number, newText: string) {
		updateTodoText(editedTodoId, newText);
	}

	function renderTodoList() {
		if (
			typeof todoStoreTodos === "undefined" ||
			todoStoreTodos === "initializing"
		) {
			return null;
		} else if (todoStoreTodos.length === 0) {
			return (
				<Typography
					textAlign={"center"}
					fontStyle={"italic"}
					color="text.secondary"
				>
					You have no todos yet. Add one above to get started!
				</Typography>
			);
		} else {
			return (
				<>
					<TodoList
						todos={todoStoreTodos}
						noOfTodos={noOfTodos}
						noOfIncompleteTodos={noOfIncompleteTodos}
						noOfCompletedTodos={noOfCompletedTodos}
						handleToggleTodoCompletion={handleToggleTodoCompletion}
						handleDeleteTodo={handleDeleteTodo}
						handleEditedTodoSubmission={handleEditedTodoSubmission}
					/>
					<Box sx={{ mt: 2, textAlign: "center" }}>
						<Button
							variant="text"
							disabled={noOfIncompleteTodos === 0}
							onClick={() =>
								setIsCompleteAllAlertDialogOpen(true)
							}
						>
							Complete All
						</Button>
						<Button
							variant="text"
							disabled={noOfCompletedTodos === 0}
							onClick={() =>
								setIsClearCompletedAlertDialogOpen(true)
							}
						>
							Clear Completed
						</Button>
					</Box>
				</>
			);
		}
	}

	return (
		<ThemeProvider theme={customTheme}>
			<AboutThisProject />
			<Container maxWidth="md">
				<Box sx={{ mt: 1, mb: 3, textAlign: "center" }}>
					<img
						src={appLogo}
						alt="Todo 2025 Logo"
						className="app-logo"
					/>
				</Box>
				<AddTodoForm
					handleAddTodo={handleAddTodo}
					newTodoInputFieldId={newTodoInputFieldId}
					focusNewTodoInputField={focusNewTodoInputField}
				/>
				<MainWrapper>{renderTodoList()}</MainWrapper>
				<AlertDialog
					isOpen={isCompleteAllAlertDialogOpen}
					description={`You are about to mark ${noOfIncompleteTodos} incomplete todo${
						noOfIncompleteTodos === 1 ? "" : "s"
					} as completed. Proceed?`}
					confirmButtonText="Complete All"
					confirmButtonColor="primary"
					handleCancel={() => setIsCompleteAllAlertDialogOpen(false)}
					handleConfirm={() => {
						completeAllTodos();
						setIsCompleteAllAlertDialogOpen(false);
					}}
				/>
				<AlertDialog
					isOpen={isClearCompletedAlertDialogOpen}
					description={`You are about to permanently delete ${noOfCompletedTodos} completed todo${
						noOfCompletedTodos === 1 ? "" : "s"
					}. This action cannot be undone. Proceed?`}
					confirmButtonText="Clear Completed"
					confirmButtonColor="error"
					handleCancel={() =>
						setIsClearCompletedAlertDialogOpen(false)
					}
					handleConfirm={() => {
						clearCompletedTodos();
						setIsClearCompletedAlertDialogOpen(false);
					}}
				/>
				<Footer />
			</Container>
		</ThemeProvider>
	);
}

export default App;
