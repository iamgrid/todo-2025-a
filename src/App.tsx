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
import {
	MAX_TODO_TITLE_LENGTH,
	TODO_TITLE_LENGTH_ERROR_MESSAGE,
} from "./helpers.tsx";

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
				<MainWrapper>
					<AddTodoForm
						className="new-todo-form"
						noValidate
						autoComplete="off"
						onSubmit={(event) => {
							handleNewTodoFormSubmission(event);
						}}
					>
						<TextField
							id="new-todo-form__input"
							label="Add New Todo"
							variant="outlined"
							fullWidth
							margin="normal"
							placeholder="What needs to be done?"
							autoFocus
							onChange={(event) =>
								handleTodoInputChange(event.target.value)
							}
							error={!todoInputIsValid}
							helperText={
								!todoInputIsValid
									? `${TODO_TITLE_LENGTH_ERROR_MESSAGE} (You are over by ${todoInputValueIsOverMaxLengthBy} characters.)`
									: ""
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
						/>
						<Button
							variant="contained"
							color="primary"
							type="submit"
							sx={{ mt: 3, height: "40px" }}
							startIcon={<AddIcon />}
							disabled={!todoInputIsValid}
						>
							Add
						</Button>
					</AddTodoForm>
					<TodoList
						todos={todoStoreState.todos}
						handleToggleTodoCompletion={handleToggleTodoCompletion}
						handleDeleteTodo={handleDeleteTodo}
						handleEditedTodoSubmission={handleEditedTodoSubmission}
					/>
				</MainWrapper>
			</Container>
		</ThemeProvider>
	);
}

export default App;
