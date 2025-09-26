import { useState } from "react";
import type { TTodo } from "../../todoStore";

import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import { styled } from "@mui/material/styles";

import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import FriendlyDate from "../shared/FriendlyDate.tsx";

import {
	MAX_TODO_TITLE_LENGTH,
	TODO_TITLE_LENGTH_ERROR_MESSAGE,
} from "../../helpers.tsx";

const TodoItemTitle = styled("span")<{ isCompleted: boolean }>(
	({ isCompleted }) => ({
		textDecoration: isCompleted ? "line-through" : "none",
		fontWeight: "bold",
		color: isCompleted ? "#c0c0c0" : "inherit",
	})
);

const EditTodoForm = styled("form")({
	display: "grid",
	gridTemplateColumns: "1fr auto auto",
	// gap: "8px",
	alignItems: "start",
	width: "100%",
});

export interface TTodoListItemProps {
	todo: TTodo;
	handleToggleTodoCompletion(todoId: number, newStatus: boolean): void;
	handleDeleteTodoProper(todoId: number): void;
	isTodoBeingEdited: boolean;
	handleEditTodo(editedTodoId: number): void;
	handleEditedTodoSubmissionProper(
		editedTodoId: number,
		newText: string
	): void;
	handleCancelEditing(): void;
}

export default function TodoListItem({
	todo,
	handleToggleTodoCompletion,
	handleDeleteTodoProper,
	isTodoBeingEdited,
	handleEditTodo,
	handleEditedTodoSubmissionProper,
	handleCancelEditing,
}: TTodoListItemProps) {
	const [editTodoInputIsValid, setEditTodoInputIsValid] =
		useState<boolean>(true);
	const [
		editTodoInputValueIsOverMaxLengthBy,
		setEditTodoInputValueIsOverMaxLengthBy,
	] = useState<number>(0);

	function handleEditFormSubmit(
		event: React.FormEvent<HTMLFormElement> | null = null
	) {
		const functionSignature = "TodoListItem.tsx@handleEditFormSubmit()";
		if (event !== null) {
			event.preventDefault();
		}

		if (!editTodoInputIsValid) {
			return;
		}

		const inputEl = document.getElementById(
			`edit-todo-form__input-${todo.id}`
		) as HTMLInputElement;
		if (inputEl) {
			const newText = inputEl.value.trim();
			if (newText.length > 0) {
				handleEditedTodoSubmissionProper(todo.id, newText);
			}
		} else {
			console.error(
				functionSignature,
				"Could not find edit input element!"
			);
		}
	}

	function renderSecondaryText() {
		const parts: React.ReactNode[] = [];

		if (todo.completedAt !== null) {
			parts.push(
				<>
					Completed <FriendlyDate input={todo.completedAt} />
				</>
			);
		}

		if (todo.lastUpdatedAt !== null) {
			parts.push(
				<>
					Last updated <FriendlyDate input={todo.lastUpdatedAt} />
				</>
			);
		}

		parts.push(
			<>
				Created <FriendlyDate input={todo.createdAt} />
			</>
		);

		return (
			<span>
				{parts.map((part, index) => (
					// eslint-disable-next-line react-x/no-array-index-key
					<span key={index}>
						{index > 0 ? " · " : ""}
						{part}
					</span>
				))}
			</span>
		);
	}

	const labelId = `todo-item-label-${todo.id}`;

	return (
		<ListItem
			key={todo.id}
			className={
				todo.isCompleted
					? "todo-list-item todo-list-item--completed"
					: "todo-list-item"
			}
			dense
		>
			{!isTodoBeingEdited ? (
				<ListItemButton
					role={undefined}
					onClick={() => {
						handleToggleTodoCompletion(todo.id, !todo.isCompleted);
					}}
					dense
				>
					<ListItemIcon>
						<Checkbox
							edge="start"
							tabIndex={-1}
							checked={todo.isCompleted}
							slotProps={{
								input: { "aria-labelledby": labelId },
							}}
						/>
					</ListItemIcon>
					<ListItemText
						id={labelId}
						primary={
							<TodoItemTitle isCompleted={todo.isCompleted}>
								{todo.text}
							</TodoItemTitle>
						}
						secondary={<span>{renderSecondaryText()}</span>}
					/>
					<Tooltip title="Edit this todo" placement="top" arrow>
						<IconButton
							edge="end"
							aria-label="edit"
							onClick={(event) => {
								event.stopPropagation();
								handleEditTodo(todo.id);
							}}
						>
							<EditIcon />
						</IconButton>
					</Tooltip>
					<Tooltip title="Delete this todo" placement="top" arrow>
						<IconButton
							edge="end"
							aria-label="delete"
							onClick={(event) => {
								event.stopPropagation();
								handleDeleteTodoProper(todo.id);
							}}
						>
							<DeleteIcon />
						</IconButton>
					</Tooltip>
				</ListItemButton>
			) : (
				<EditTodoForm
					onSubmit={(event) => {
						handleEditFormSubmit(event);
					}}
					noValidate
					autoComplete="off"
				>
					<TextField
						fullWidth
						variant="outlined"
						defaultValue={todo.text}
						autoFocus
						id={`edit-todo-form__input-${todo.id}`}
						slotProps={{
							input: {
								"aria-label": "Edit Todo",
							},
						}}
						label="Edit Todo"
						size="small"
						sx={{ my: 1 }}
						error={!editTodoInputIsValid}
						helperText={
							!editTodoInputIsValid
								? `${TODO_TITLE_LENGTH_ERROR_MESSAGE} (You are over by ${editTodoInputValueIsOverMaxLengthBy} characters.)`
								: ""
						}
						onChange={(event) => {
							const val = event.target.value.trim();
							if (
								val.length === 0 ||
								val.length > MAX_TODO_TITLE_LENGTH
							) {
								setEditTodoInputIsValid(false);
								if (val.length > MAX_TODO_TITLE_LENGTH) {
									setEditTodoInputValueIsOverMaxLengthBy(
										val.length - MAX_TODO_TITLE_LENGTH
									);
								} else {
									setEditTodoInputValueIsOverMaxLengthBy(0);
								}
							} else {
								setEditTodoInputIsValid(true);
								setEditTodoInputValueIsOverMaxLengthBy(0);
							}
						}}
						multiline={true}
						minRows={1}
						maxRows={4}
						onKeyDown={(event) => {
							if (event.key === "Enter") {
								event.preventDefault();
								handleEditFormSubmit();
							}
						}}
					/>
					<Button
						type="submit"
						variant="contained"
						color="primary"
						startIcon={<SaveIcon />}
						sx={{ ml: 2, mt: "12px" }}
						disabled={!editTodoInputIsValid}
					>
						Save
					</Button>
					<Button
						variant="outlined"
						color="primary"
						startIcon={<CancelIcon />}
						sx={{ ml: 1, mt: "12px" }}
						onClick={() => {
							handleCancelEditing();
						}}
					>
						Cancel
					</Button>
				</EditTodoForm>
			)}
		</ListItem>
	);
}
