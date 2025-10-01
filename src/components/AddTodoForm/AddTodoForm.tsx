import { useState } from "react";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

import styled from "@emotion/styled";

import {
	MAX_TODO_TITLE_LENGTH,
	NEW_TODO_INPUT_FIELD_ID,
	TODO_TITLE_LENGTH_ERROR_MESSAGE,
} from "./../../helpers.tsx";

interface TAddTodoFormProps {
	handleAddTodo(newTodoText: string): void;
	focusNewTodoInputField(): void;
}

const CustomForm = styled("form")({
	display: "grid",
	gridTemplateColumns: "1fr auto",
	gap: "16px",
	alignItems: "start",
	width: "100%",
	marginBottom: "36px",
	padding: "0 24px",
});

export default function AddTodoForm({
	handleAddTodo,
	focusNewTodoInputField,
}: TAddTodoFormProps) {
	const [todoInputIsValid, setTodoInputIsValid] = useState<boolean>(true);
	const [
		todoInputValueIsOverMaxLengthBy,
		setTodoInputValueIsOverMaxLengthBy,
	] = useState<number>(0);

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
			NEW_TODO_INPUT_FIELD_ID
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

		handleAddTodo(newTodoText);

		newTodoField.value = "";
		setTodoInputIsValid(true);
		setTodoInputValueIsOverMaxLengthBy(0);

		focusNewTodoInputField();
	}

	return (
		<CustomForm
			className="new-todo-form"
			noValidate
			autoComplete="off"
			onSubmit={(event) => {
				handleNewTodoFormSubmission(event);
			}}
			data-joy-color-scheme="dark"
		>
			<TextField
				id={NEW_TODO_INPUT_FIELD_ID}
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
				onChange={(event) => handleTodoInputChange(event.target.value)}
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
						NEW_TODO_INPUT_FIELD_ID
					) as HTMLInputElement | null;
					if (newTodoInputField !== null) {
						if (newTodoInputField.value.trim().length === 0) {
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
		</CustomForm>
	);
}
