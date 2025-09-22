import type { TTodo } from "./todoStore";

export const TODO_KEY_PREFIX = "todo_";

export function sum(a: number, b: number): number {
	const re: number = a + b;
	return re;
}

export function getAllTodosFromLocalStorage(): null | TTodo[] {
	const functionSignature = "helpers.ts@getAllTodosFromLocalStorage()";

	const keysInLocalStorage = Object.keys(localStorage);

	if (keysInLocalStorage.length === 0) {
		console.info(
			functionSignature,
			"No keys found in localStorage. Returning null."
		);
		return null;
	}

	const todos: TTodo[] = [];

	keysInLocalStorage.forEach((key) => {
		if (key.startsWith(TODO_KEY_PREFIX)) {
			const lsItem = localStorage.getItem(key);
			if (typeof lsItem !== "string" || lsItem === null) return;

			let newTodo: TTodo | null = null;
			try {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				const parsedTodo = JSON.parse(lsItem);
				if (
					parsedTodo instanceof Object &&
					parsedTodo !== null &&
					"id" in parsedTodo &&
					"text" in parsedTodo &&
					"isCompleted" in parsedTodo &&
					"createdAt" in parsedTodo &&
					"lastUpdatedAt" in parsedTodo &&
					"completedAt" in parsedTodo
				) {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
					newTodo = parsedTodo;
				} else {
					console.error(
						functionSignature,
						`The item in localStorage for key ${key} is missing one or more required properties of a TTodo object. Skipping...`
					);
					return;
				}
			} catch (errorObj) {
				console.error(
					functionSignature,
					`Could not parse JSON from localStorage for key ${key}:`,
					errorObj
				);
				return;
			}

			if (newTodo === null) {
				console.error(
					functionSignature,
					"newTodo is null. Skipping..."
				);
				return;
			}

			todos.push(newTodo);
		}
	});

	return todos.length > 0 ? todos : null;
}
