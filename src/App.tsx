import {
	useState,
	useReducer,
	useEffect,
	useMemo,
	useId,
	useCallback,
} from "react";
import {
	todoStoreReducer,
	initialTodoStoreState,
	getAllTodoObjectsFromLocalStorage,
	TTodoStoreActionTypes,
	deleteTodosFromLocalStorage,
} from "./todoStore";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
// import ButtonGroup from "@mui/material/ButtonGroup";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";

import { ThemeProvider } from "@mui/material";
import { styled } from "@mui/material/styles";
import customTheme from "./customTheme.ts";

import TodoList from "./components/TodoList/TodoList.tsx";
import AlertDialog from "./components/shared/AlertDialog.tsx";
import AddTodoForm from "./components/AddTodoForm/AddTodoForm.tsx";

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
	const [todoStoreState, todoStoreDispatch] = useReducer(
		todoStoreReducer,
		initialTodoStoreState
	);

	const [isCompleteAllAlertDialogOpen, setIsCompleteAllAlertDialogOpen] =
		useState<boolean>(false);
	const [
		isClearCompletedAlertDialogOpen,
		setIsClearCompletedAlertDialogOpen,
	] = useState<boolean>(false);
	const [
		isCorruptedLSTodosAlertDialogOpen,
		setIsCorruptedLSTodosAlertDialogOpen,
	] = useState<boolean>(false);
	const [corruptedLSTodoKeys, setCorruptedLSTodoKeys] = useState<string[]>(
		[]
	);

	const [isSnackbarOpen, setIsSnackbarOpen] = useState<boolean>(false);
	const [snackbarMessage, setSnackbarMessage] = useState<string>("");

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

	const focusNewTodoInputField = useCallback(() => {
		const functionSignature = "App.tsx@focusNewTodoInputField()";

		const newTodoInputField = document.getElementById(
			newTodoInputFieldId
		) as HTMLInputElement | null;
		if (newTodoInputField !== null) {
			newTodoInputField.focus();
		} else {
			console.error(
				functionSignature,
				"Could not find new todo input field in the DOM!"
			);
		}
	}, [newTodoInputFieldId]);

	useEffect(() => {
		const functionSignature = "App.tsx@component mounted useEffect()";

		// Load user data from localStorage
		const todosFromLocalStorageResponse =
			getAllTodoObjectsFromLocalStorage();

		console.log(
			functionSignature,
			"todosFromLocalStorageResponse:",
			todosFromLocalStorageResponse
		);

		if (todosFromLocalStorageResponse !== null) {
			console.log(
				functionSignature,
				"localStorage contained todos for this user, updating state..."
			);

			todoStoreDispatch({
				type: TTodoStoreActionTypes.LOAD_USER_DATA_FROM_LOCAL_STORAGE,
				payload: todosFromLocalStorageResponse.validTodos,
			});

			if (todosFromLocalStorageResponse.invalidTodoKeys.length > 0) {
				setCorruptedLSTodoKeys([
					...todosFromLocalStorageResponse.invalidTodoKeys,
				]);
				setIsCorruptedLSTodosAlertDialogOpen(true);
			}

			setSnackbarMessage(
				`${todosFromLocalStorageResponse.validTodos.length} todo${
					todosFromLocalStorageResponse.validTodos.length === 1
						? ""
						: "s"
				} were restored from localStorage.`
			);
			setIsSnackbarOpen(true);
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
	}, [focusNewTodoInputField]);

	function handleAddTodo(newTodoText: string) {
		todoStoreDispatch({
			type: TTodoStoreActionTypes.ADD_TODO,
			payload: { text: newTodoText },
		});
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
					handleAddTodo={handleAddTodo}
					newTodoInputFieldId={newTodoInputFieldId}
					focusNewTodoInputField={focusNewTodoInputField}
				/>
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
							<Box sx={{ mt: 2, textAlign: "center" }}>
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
				<AlertDialog
					isOpen={isCorruptedLSTodosAlertDialogOpen}
					description={
						<span>
							The following saved todos were corrupted in
							localStorage and could not be loaded:{" "}
							<b>{corruptedLSTodoKeys.join(", ")}</b>.
						</span>
					}
					cancelButtonText="Leave corrupted todos as is"
					confirmButtonText="Delete corrupted todos"
					confirmButtonColor="error"
					handleCancel={() =>
						setIsCorruptedLSTodosAlertDialogOpen(false)
					}
					handleConfirm={() => {
						deleteTodosFromLocalStorage(corruptedLSTodoKeys);
						setIsCorruptedLSTodosAlertDialogOpen(false);
					}}
				/>
				<Snackbar
					open={isSnackbarOpen}
					autoHideDuration={6000}
					onClose={() => setIsSnackbarOpen(false)}
					message={snackbarMessage}
					anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
				/>
				<Footer />
			</Container>
		</ThemeProvider>
	);
}

export default App;
