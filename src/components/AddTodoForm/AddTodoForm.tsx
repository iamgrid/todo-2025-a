import { useState, useId, useRef } from "react";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

import styled from "@emotion/styled";

import {
	focusDOMElementByRef,
	MAX_TODO_TITLE_LENGTH,
	TODO_TITLE_LENGTH_ERROR_MESSAGE,
} from "./../../helpers.tsx";
import { useDoesUserHaveAProperMouse } from "../shared/useDoesUserHaveAProperMouse.tsx";

interface TAddTodoFormProps {
	handleAddTodo(newTodoText: string): void;
	newTodoInputFieldRef: React.RefObject<HTMLInputElement | null>;
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
	newTodoInputFieldRef,
}: TAddTodoFormProps) {
	const formRef = useRef<HTMLFormElement | null>(null);
	const newTodoInputFieldId = useId();
	const [todoInputIsValid, setTodoInputIsValid] = useState<boolean>(true);
	const [
		todoInputValueIsOverMaxLengthBy,
		setTodoInputValueIsOverMaxLengthBy,
	] = useState<number>(0);
	const doesUserHaveAProperMouse = useDoesUserHaveAProperMouse();

	function handleTodoInputChange(newValue: string) {
		const trimmedValue = newValue.trim();
		if (trimmedValue.length === 0) {
			setTodoInputIsValid(false);
			setTodoInputValueIsOverMaxLengthBy(0);
			return;
		} else if (trimmedValue.length > MAX_TODO_TITLE_LENGTH) {
			setTodoInputIsValid(false);
			setTodoInputValueIsOverMaxLengthBy(
				trimmedValue.length - MAX_TODO_TITLE_LENGTH,
			);
			return;
		} else {
			setTodoInputIsValid(true);
			setTodoInputValueIsOverMaxLengthBy(0);
		}
	}

	function handleNewTodoFormSubmission(
		event: React.FormEvent<HTMLFormElement> | null = null,
	) {
		const functionSignature = "App.tsx@handleNewTodoFormSubmission()";

		let formElement: HTMLFormElement | null = null;

		if (event !== null) {
			event.preventDefault();
			formElement = event.currentTarget;
		} else {
			formElement = formRef.current;
		}

		if (!todoInputIsValid) {
			return;
		}

		if (formElement === null) {
			console.error(
				functionSignature,
				"Could not find form element in DOM!",
			);
			return;
		}

		const formData = new FormData(formElement);

		const newTodoInputFieldKey = formData.keys().next().value;

		if (typeof newTodoInputFieldKey !== "string") {
			console.error(
				functionSignature,
				"Could not get key for new todo input field from form data. newTodoInputFieldKey is not a string.",
				formData.entries(),
			);
			return;
		}

		if (!formData.has(newTodoInputFieldKey)) {
			console.error(
				functionSignature,
				`Form data does not have expected field with key '${newTodoInputFieldKey}'!`,
				formData.entries(),
			);
			return;
		}

		const newTodoText = (
			formData.get(newTodoInputFieldKey) as string
		).trim();

		if (newTodoText.length === 0) {
			console.warn(
				functionSignature,
				"New todo text is empty, returning early...",
			);
			focusDOMElementByRef(newTodoInputFieldRef);
			return;
		}

		handleAddTodo(newTodoText);

		formElement.reset();

		setTodoInputIsValid(true);
		setTodoInputValueIsOverMaxLengthBy(0);

		focusDOMElementByRef(newTodoInputFieldRef);
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
			ref={formRef}
		>
			<TextField
				id={newTodoInputFieldId}
				name={newTodoInputFieldId}
				inputRef={newTodoInputFieldRef}
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
					} else if (event.key === "Escape") {
						event.preventDefault();
						const newTodoInputField = newTodoInputFieldRef.current;
						if (newTodoInputField !== null) {
							newTodoInputField.value = "";
							setTodoInputIsValid(true);
							setTodoInputValueIsOverMaxLengthBy(0);
							focusDOMElementByRef(newTodoInputFieldRef);
						}
					}
				}}
				onBlur={() => {
					const newTodoInputField = document.getElementById(
						newTodoInputFieldId,
					) as HTMLInputElement | null;
					if (newTodoInputField === null) {
						console.error(
							"AddTodoForm.tsx@onBlur()",
							"newTodoInputField is null!",
						);
						return;
					}
					if (typeof newTodoInputField.value === "undefined") {
						console.error(
							"AddTodoForm.tsx@onBlur()",
							"newTodoInputField.value is undefined!",
							newTodoInputField,
						);
						return;
					}

					if (newTodoInputField.value.trim().length === 0) {
						newTodoInputField.value = "";
						setTodoInputIsValid(true);
						setTodoInputValueIsOverMaxLengthBy(0);
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
