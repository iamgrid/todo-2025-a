import type { TTodo } from "../../todoStore";

import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

// import { friendlyDisplayDate } from "../../helpers";
import FriendlyDate from "../shared/FriendlyDate.tsx";

import { styled } from "@mui/material/styles";

const TodoItemTitle = styled("span")<{ isCompleted: boolean }>(
	({ isCompleted }) => ({
		textDecoration: isCompleted ? "line-through" : "none",
		fontWeight: "bold",
		color: isCompleted ? "#c0c0c0" : "inherit",
	})
);

export interface TTodoListItemProps {
	todo: TTodo;
	handleToggleTodoCompletion(todoId: number, newStatus: boolean): void;
	handleDeleteTodoProper(todoId: number): void;
}

export default function TodoListItem({
	todo,
	handleToggleTodoCompletion,
	handleDeleteTodoProper,
}: TTodoListItemProps) {
	function handleEditTodo() {
		const functionSignature = "TodoListItem.tsx@handleEditTodo()";
		console.log(functionSignature, "Editing todo:", todo);
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
							handleEditTodo();
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
		</ListItem>
	);
}
