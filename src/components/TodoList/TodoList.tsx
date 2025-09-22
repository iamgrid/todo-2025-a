import type { TTodo } from "../../todoStore";

export interface TTodoListProps {
	todos: TTodo[];
}

export default function TodoList({ todos }: TTodoListProps) {
	return (
		<ul>
			{todos.map((todo) => (
				<li key={todo.id}>
					{todo.text} {todo.isCompleted ? "(Completed)" : "(Pending)"}
				</li>
			))}
		</ul>
	);
}
