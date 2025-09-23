import type { TTodo } from "../../todoStore";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { friendlyDisplayDate } from "../../helpers";

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
}

export default function TodoListItem({
	todo,
	handleToggleTodoCompletion,
}: TTodoListItemProps) {
	function renderSecondaryText() {
		const parts: React.ReactNode[] = [];

		if (todo.completedAt !== null) {
			parts.push(
				<span>Completed {friendlyDisplayDate(todo.completedAt)}</span>
			);
		}

		if (todo.lastUpdatedAt !== null) {
			parts.push(
				<span>
					Last updated {friendlyDisplayDate(todo.lastUpdatedAt)}
				</span>
			);
		}

		parts.push(<span>Created {friendlyDisplayDate(todo.createdAt)}</span>);

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

	return (
		<ListItem
			key={todo.id}
			className={
				todo.isCompleted
					? "todo-list-item todo-list-item--completed"
					: "todo-list-item"
			}
		>
			<ListItemButton
				role={undefined}
				onClick={() => {
					handleToggleTodoCompletion(todo.id, !todo.isCompleted);
				}}
				title={
					todo.isCompleted
						? "Click to mark this todo as incomplete"
						: "Click to complete this todo"
				}
				dense
			>
				<ListItemIcon>
					<Checkbox
						edge="start"
						tabIndex={-1}
						checked={todo.isCompleted}
						slotProps={{
							input: { "aria-labelledby": String(todo.id) },
						}}
					/>
				</ListItemIcon>
				<ListItemText
					id={String(todo.id)}
					primary={
						<TodoItemTitle isCompleted={todo.isCompleted}>
							{todo.text}
						</TodoItemTitle>
					}
					secondary={<span>{renderSecondaryText()}</span>}
				/>
				<IconButton edge="end" aria-label="edit" title="Edit this todo">
					<EditIcon />
				</IconButton>
				<IconButton
					edge="end"
					aria-label="delete"
					title="Delete this todo"
				>
					<DeleteIcon />
				</IconButton>
			</ListItemButton>
		</ListItem>
	);
}
