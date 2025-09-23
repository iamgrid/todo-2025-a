import { useState, useReducer, useEffect } from "react";
import {
	todoStoreReducer,
	initialTodoStoreState,
	getAllTodoObjectsFromLocalStorage,
	TTodoStoreActionTypes,
} from "./todoStore";

import Container from "@mui/material/Container";
// import Box from "@mui/material/Box";
// import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/Add";

import { ThemeProvider } from "@mui/material";
import { styled } from "@mui/material/styles";
import customTheme from "./customTheme.ts";

import TodoList from "./components/TodoList/TodoList.tsx";

import "./overrides.css";

const MainWrapper = styled("div")(({ theme }) => ({
	backgroundColor: theme.palette.background.paper,
	padding: theme.spacing(3),
	borderRadius: theme.shape.borderRadius,
	boxShadow: "0 0 5px 3px rgba(80, 116, 152, .7)",
}));

function App() {
	const [todoStoreState, todoStoreDispatch] = useReducer(
		todoStoreReducer,
		initialTodoStoreState
	);

	const [newTodoFieldContents, setNewTodoFieldContents] =
		useState<string>("");

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
	}, []);

	// console.log("Current todoStoreState:", todoStoreState);

	function focusNewTodoInputField() {
		const functionSignature = "App.tsx@focusNewTodoInputField()";

		const newTodoInputField = document.getElementById(
			"new-todo-form__input-field"
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

	function handleNewTodoFormSubmission(
		event: React.FormEvent<HTMLFormElement>
	) {
		const functionSignature = "App.tsx@handleNewTodoFormSubmission()";

		event.preventDefault();

		// console.log(functionSignature, "Form submitted:", event);

		const newTodoText = newTodoFieldContents.trim();
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

		setNewTodoFieldContents("");

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

	return (
		<ThemeProvider theme={customTheme}>
			<Container maxWidth="md">
				<MainWrapper>
					<form
						className="new-todo-form"
						noValidate
						autoComplete="off"
						onSubmit={(event) => {
							handleNewTodoFormSubmission(event);
						}}
					>
						<TextField
							id="new-todo-form__input-field"
							label="Add New Todo"
							variant="outlined"
							fullWidth
							margin="normal"
							placeholder="What needs to be done?"
							autoFocus
							value={newTodoFieldContents}
							onChange={(event) =>
								setNewTodoFieldContents(
									event.target.value.trimStart()
								)
							}
						/>
						<Button
							variant="contained"
							color="primary"
							type="submit"
							sx={{ mt: 2 }}
							startIcon={<AddIcon />}
						>
							Add
						</Button>
					</form>
					<TodoList
						todos={todoStoreState.todos}
						handleToggleTodoCompletion={handleToggleTodoCompletion}
						handleDeleteTodo={handleDeleteTodo}
					/>
				</MainWrapper>
			</Container>
		</ThemeProvider>
	);
}

export default App;
