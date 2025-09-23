import type { TTodo } from "../../todoStore";
import List from "@mui/material/List";
import TodoListItem from "../TodoList/TodoListItem.tsx";

export interface TTodoListProps {
	todos: TTodo[];
	handleToggleTodoCompletion(todoId: number, newStatus: boolean): void;
}

export default function TodoList({
	todos,
	handleToggleTodoCompletion,
}: TTodoListProps) {
	return (
		<List>
			{todos.map((todo) => {
				return (
					<TodoListItem
						key={todo.id}
						todo={todo}
						handleToggleTodoCompletion={handleToggleTodoCompletion}
					/>
				);
			})}
		</List>
	);
}
