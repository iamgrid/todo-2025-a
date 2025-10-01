import { useState, useReducer, useEffect, useMemo } from "react";
import {
	todoStoreReducer,
	initialTodoStoreState,
	getAllTodoObjectsFromLocalStorage,
	TTodoStoreActionTypes,
} from "./todoStore";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
// import ButtonGroup from "@mui/material/ButtonGroup";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/Add";

import { ThemeProvider } from "@mui/material";
import { styled } from "@mui/material/styles";
import customTheme from "./customTheme.ts";

import TodoList from "./components/TodoList/TodoList.tsx";

import appLogo from "./assets/todo-2025-a-logo.svg";

import "./overrides.css";
import {
	MAX_TODO_TITLE_LENGTH,
	TODO_TITLE_LENGTH_ERROR_MESSAGE,
} from "./helpers.tsx";
import AlertDialog from "./components/shared/AlertDialog.tsx";

const MainWrapper = styled("div")(({ theme }) => ({
	backgroundColor: theme.palette.background.paper,
	padding: theme.spacing(3),
	borderRadius: theme.shape.borderRadius,
	boxShadow: "0 0 5px 3px rgba(80, 116, 152, .7)",
}));

const AddTodoForm = styled("form")({
	display: "grid",
	gridTemplateColumns: "1fr auto",
	gap: "16px",
	alignItems: "start",
	width: "100%",
	marginBottom: "36px",
	padding: "0 24px",
});

function App() {
	const [todoStoreState, todoStoreDispatch] = useReducer(
		todoStoreReducer,
		initialTodoStoreState
	);

	const [todoInputIsValid, setTodoInputIsValid] = useState<boolean>(true);
	const [
		todoInputValueIsOverMaxLengthBy,
		setTodoInputValueIsOverMaxLengthBy,
	] = useState<number>(0);

	const [isCompleteAllAlertDialogOpen, setIsCompleteAllAlertDialogOpen] =
		useState<boolean>(false);
	const [
		isClearCompletedAlertDialogOpen,
		setIsClearCompletedAlertDialogOpen,
	] = useState<boolean>(false);

	useEffect(() => {
		const functionSignature = "App.tsx@component mounted useEffect()";

		// Load user data from localStorage
		const todosFromLocalStorage = getAllTodoObjectsFromLocalStorage();

		console.log(
			functionSignature,
			"todosFromLocalStorage:",
			todosFromLocalStorage
		);

		if (todosFromLocalStorage !== null) {
			console.log(
				functionSignature,
				"localStorage contained todos for this user, updating state..."
			);

			todoStoreDispatch({
				type: TTodoStoreActionTypes.LOAD_USER_DATA_FROM_LOCAL_STORAGE,
				payload: todosFromLocalStorage,
			});
		}

		const keyDownHandler = (event: KeyboardEvent) => {
			const functionSignature = "App.tsx@keyDownHandler()";
			if (event.key === "Enter" && event.ctrlKey) {
				console.log(functionSignature, "Ctrl+Enter detected");
				event.preventDefault();
				focusNewTodoInputField();
				window.scrollTo(0, 0);
			}
		};
		window.addEventListener("keydown", keyDownHandler);

		return () => {
			// Cleanup if needed when component unmounts
			window.removeEventListener("keydown", keyDownHandler);
		};
	}, []);

	const {
		noOfTodos,
		noOfIncompleteTodos,
		noOfCompletedTodos,
	}: {
		noOfTodos: number;
		noOfIncompleteTodos: number;
		noOfCompletedTodos: number;
	} = useMemo(() => {
		const noOfTodos = todoStoreState.todos.length;
		const noOfIncompleteTodos = todoStoreState.todos.filter(
			(todo) => !todo.isCompleted
		).length;
		const noOfCompletedTodos = noOfTodos - noOfIncompleteTodos;

		return { noOfTodos, noOfIncompleteTodos, noOfCompletedTodos };
	}, [todoStoreState.todos]);

	function focusNewTodoInputField() {
		const functionSignature = "App.tsx@focusNewTodoInputField()";

		const newTodoInputField = document.getElementById(
			"new-todo-form__input"
		) as HTMLInputElement | null;
		if (newTodoInputField !== null) {
			newTodoInputField.focus();
		} else {
			console.error(
				functionSignature,
				"Could not find new todo input field in the DOM!"
			);
		}
	}

	function handleTodoInputChange(newValue: string) {
		const trimmedValue = newValue.trim();
		if (trimmedValue.length === 0) {
			setTodoInputIsValid(false);
			setTodoInputValueIsOverMaxLengthBy(0);
			return;
		} else if (trimmedValue.length > MAX_TODO_TITLE_LENGTH) {
			setTodoInputIsValid(false);
			setTodoInputValueIsOverMaxLengthBy(
				trimmedValue.length - MAX_TODO_TITLE_LENGTH
			);
			return;
		} else {
			setTodoInputIsValid(true);
			setTodoInputValueIsOverMaxLengthBy(0);
		}
	}

	function handleNewTodoFormSubmission(
		event: React.FormEvent<HTMLFormElement> | null = null
	) {
		const functionSignature = "App.tsx@handleNewTodoFormSubmission()";

		if (event !== null) {
			event.preventDefault();
		}

		if (!todoInputIsValid) {
			return;
		}

		const newTodoField = document.getElementById(
			"new-todo-form__input"
		) as HTMLInputElement | null;
		if (newTodoField === null) {
			console.error(
				functionSignature,
				"Could not find new todo input field in the DOM!"
			);
			return;
		}

		const newTodoText = newTodoField.value.trim();

		if (newTodoText.length === 0) {
			console.warn(
				functionSignature,
				"New todo text is empty, returning early..."
			);
			focusNewTodoInputField();
			return;
		}

		todoStoreDispatch({
			type: TTodoStoreActionTypes.ADD_TODO,
			payload: { text: newTodoText },
		});

		newTodoField.value = "";
		setTodoInputIsValid(true);
		setTodoInputValueIsOverMaxLengthBy(0);

		focusNewTodoInputField();
	}

	function handleToggleTodoCompletion(todoId: number, newStatus: boolean) {
		todoStoreDispatch({
			type: TTodoStoreActionTypes.UPDATE_TODO_COMPLETION_STATUS,
			payload: {
				updateTodoWithId: todoId,
				newCompletionStatus: newStatus,
			},
		});
	}

	function handleDeleteTodo(todoId: number) {
		todoStoreDispatch({
			type: TTodoStoreActionTypes.DELETE_TODO,
			payload: { deleteTodoWithId: todoId },
		});
	}

	function handleEditedTodoSubmission(editedTodoId: number, newText: string) {
		todoStoreDispatch({
			type: TTodoStoreActionTypes.UPDATE_TODO_TEXT_CONTENT,
			payload: { updateTodoWithId: editedTodoId, newText },
		});
	}

	return (
		<ThemeProvider theme={customTheme}>
			<Container maxWidth="md">
				<Box sx={{ mt: 1, mb: 3, textAlign: "center" }}>
					<img
						src={appLogo}
						alt="Todo 2025 Logo"
						className="app-logo"
					/>
				</Box>
				<AddTodoForm
					className="new-todo-form"
					noValidate
					autoComplete="off"
					onSubmit={(event) => {
						handleNewTodoFormSubmission(event);
					}}
					data-joy-color-scheme="dark"
				>
					<TextField
						id="new-todo-form__input"
						label="Add New Todo"
						variant="outlined"
						fullWidth
						margin="normal"
						sx={{
							textarea: {
								color: "#fff",
							},
							label: { color: "#bbb" },
							"& .MuiOutlinedInput-root:not(.Mui-error)": {
								"& fieldset": {
									borderColor: "primary.light",
								},
								"&:hover fieldset": {
									borderColor: "secondary.main",
								},
								"&.Mui-focused fieldset": {
									borderColor: "secondary.main",
								},
							},
							"& .MuiFormHelperText-root:not(.Mui-error)": {
								color: "primary.main",
							},
						}}
						placeholder="What needs to be done?"
						autoFocus
						onChange={(event) =>
							handleTodoInputChange(event.target.value)
						}
						error={!todoInputIsValid}
						helperText={
							!todoInputIsValid
								? `${TODO_TITLE_LENGTH_ERROR_MESSAGE} (You are over by ${todoInputValueIsOverMaxLengthBy} characters.)`
								: "Hit [Ctrl+Enter] to focus this field."
						}
						multiline={true}
						minRows={1}
						maxRows={4}
						onKeyDown={(event) => {
							if (event.key === "Enter") {
								event.preventDefault();
								handleNewTodoFormSubmission();
							}
						}}
						onBlur={() => {
							const newTodoInputField = document.getElementById(
								"new-todo-form__input"
							) as HTMLInputElement | null;
							if (newTodoInputField !== null) {
								if (
									newTodoInputField.value.trim().length === 0
								) {
									newTodoInputField.value = "";
									setTodoInputIsValid(true);
									setTodoInputValueIsOverMaxLengthBy(0);
								}
							}
						}}
					/>
					<Button
						variant="contained"
						color="primary"
						type="submit"
						sx={{
							mt: 3,
							height: "40px",
							"&:disabled": {
								color: "#aaa",
								backgroundColor: "#444",
							},
						}}
						startIcon={<AddIcon />}
						disabled={!todoInputIsValid}
					>
						Add
					</Button>
				</AddTodoForm>
				<MainWrapper>
					{todoStoreState.todos.length === 0 ? (
						<Typography
							textAlign={"center"}
							fontStyle={"italic"}
							color="text.secondary"
						>
							You have no todos yet. Add one above to get started!
						</Typography>
					) : (
						<>
							<TodoList
								todos={todoStoreState.todos}
								noOfTodos={noOfTodos}
								noOfIncompleteTodos={noOfIncompleteTodos}
								noOfCompletedTodos={noOfCompletedTodos}
								handleToggleTodoCompletion={
									handleToggleTodoCompletion
								}
								handleDeleteTodo={handleDeleteTodo}
								handleEditedTodoSubmission={
									handleEditedTodoSubmission
								}
							/>
							<Box sx={{ mt: 4, mb: 2, textAlign: "center" }}>
								{/* <ButtonGroup> */}
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
								{/* </ButtonGroup> */}
							</Box>
						</>
					)}
				</MainWrapper>
				<AlertDialog
					isOpen={isCompleteAllAlertDialogOpen}
					description={`You are about to mark ${noOfIncompleteTodos} incomplete todo${
						noOfIncompleteTodos === 1 ? "" : "s"
					} as completed. Proceed?`}
					confirmButtonText="Complete All"
					confirmButtonColor="primary"
					handleCancel={() => setIsCompleteAllAlertDialogOpen(false)}
					handleConfirm={() => {
						todoStoreDispatch({
							type: TTodoStoreActionTypes.COMPLETE_ALL_TODOS,
						});
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
						todoStoreDispatch({
							type: TTodoStoreActionTypes.CLEAR_COMPLETED_TODOS,
						});
						setIsClearCompletedAlertDialogOpen(false);
					}}
				/>
			</Container>
		</ThemeProvider>
	);
}

export default App;
