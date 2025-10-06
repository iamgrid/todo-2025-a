import { useState, useId } from "react";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

import styled from "@emotion/styled";

import {
	MAX_TODO_TITLE_LENGTH,
	TODO_TITLE_LENGTH_ERROR_MESSAGE,
} from "./../../helpers.tsx";
import { useMatchMedia } from "../shared/useMatchMedia.tsx";

interface TAddTodoFormProps {
	handleAddTodo(newTodoText: string): void;
	newTodoInputFieldId: string;
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
	newTodoInputFieldId,
	focusNewTodoInputField,
}: TAddTodoFormProps) {
	const formId = useId();
	const [todoInputIsValid, setTodoInputIsValid] = useState<boolean>(true);
	const [
		todoInputValueIsOverMaxLengthBy,
		setTodoInputValueIsOverMaxLengthBy,
	] = useState<number>(0);
	const doesUserHaveAProperMouse = useMatchMedia("(pointer:fine)");

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

		let formElement: HTMLFormElement | null = null;

		if (event !== null) {
			event.preventDefault();
			formElement = event.currentTarget;
		} else {
			formElement = document.getElementById(
				formId
			) as HTMLFormElement | null;
		}

		if (!todoInputIsValid) {
			return;
		}

		if (formElement === null) {
			console.error(
				functionSignature,
				"Could not find form element in DOM!"
			);
			return;
		}

		const formData = new FormData(formElement);

		for (const [key, value] of formData.entries()) {
			console.log(
				functionSignature,
				`Form data entry: ${key} = ${value}`
			);
		}

		if (!formData.has(newTodoInputFieldId)) {
			console.error(
				functionSignature,
				`Form data does not have expected field with ID '${newTodoInputFieldId}'!`,
				formData.entries()
			);
			return;
		}

		const newTodoText = (
			formData.get(newTodoInputFieldId) as string
		).trim();

		if (newTodoText.length === 0) {
			console.warn(
				functionSignature,
				"New todo text is empty, returning early..."
			);
			focusNewTodoInputField();
			return;
		}

		handleAddTodo(newTodoText);

		formElement.reset();

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
			id={formId}
		>
			<TextField
				id={newTodoInputFieldId}
				name={newTodoInputFieldId}
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
						: doesUserHaveAProperMouse
						? "Hit [Ctrl+Enter] to focus this field."
						: null
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
						newTodoInputFieldId
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
