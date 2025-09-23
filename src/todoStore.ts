import { TODO_KEY_PREFIX } from "./helpers";

export interface TNewTodo {
	text: string;
}

export interface TTodo extends TNewTodo {
	id: number;
	isCompleted: boolean;
	createdAt: string; // ISO string
	lastUpdatedAt: null | string; // ISO string
	completedAt: null | string; // ISO string
}

export interface TTodoStoreState {
	todoIdIterator: number;
	todos: TTodo[];
}

export const initialTodoStoreState: TTodoStoreState = {
	todoIdIterator: 1,
	todos: [],
};

export const TTodoStoreActionTypes = {
	ADD_TODO: "ADD_TODO",
	UPDATE_TODO_TEXT_CONTENT: "UPDATE_TODO_TEXT_CONTENT",
	UPDATE_TODO_COMPLETION_STATUS: "UPDATE_TODO_COMPLETION_STATUS",
	DELETE_TODO: "DELETE_TODO",
	LOAD_USER_DATA_FROM_LOCAL_STORAGE: "LOAD_USER_DATA_FROM_LOCAL_STORAGE",
} as const;

export type TTodoStoreAction =
	| { type: typeof TTodoStoreActionTypes.ADD_TODO; payload: TNewTodo }
	| {
			type: typeof TTodoStoreActionTypes.UPDATE_TODO_TEXT_CONTENT;
			payload: {
				updateTodoWithId: number;
				text: string;
			};
	  }
	| {
			type: typeof TTodoStoreActionTypes.UPDATE_TODO_COMPLETION_STATUS;
			payload: {
				updateTodoWithId: number;
				newCompletionStatus: boolean;
			};
	  }
	| {
			type: typeof TTodoStoreActionTypes.DELETE_TODO;
			payload: { deleteTodoWithId: number };
	  }
	| {
			type: typeof TTodoStoreActionTypes.LOAD_USER_DATA_FROM_LOCAL_STORAGE;
			payload: TTodo[];
	  };

export function todoStoreReducer(
	state: TTodoStoreState,
	action: TTodoStoreAction
): TTodoStoreState {
	const functionSignature = "todoStore.ts@todoStoreReducer()";

	switch (action.type) {
		case TTodoStoreActionTypes.ADD_TODO: {
			const nowDateObj = new Date();
			const nowIsoString = nowDateObj.toISOString();

			const newTodo: TTodo = {
				id: state.todoIdIterator,
				text: action.payload.text,
				isCompleted: false,
				createdAt: nowIsoString,
				lastUpdatedAt: null,
				completedAt: null,
			};

			const newState = {
				...state,
				todos: [...state.todos, newTodo],
				todoIdIterator: state.todoIdIterator + 1,
			};

			updateLocalStorage(newState, action, newTodo.id);

			return newState;
		}

		case TTodoStoreActionTypes.UPDATE_TODO_TEXT_CONTENT: {
			const nowDateObj = new Date();
			const nowIsoString = nowDateObj.toISOString();

			const updatedTodoObj = state.todos.find(
				(todo) => todo.id === action.payload.updateTodoWithId
			);

			if (!updatedTodoObj) {
				console.error(
					functionSignature,
					action.payload,
					`Could not find todo with id ${action.payload.updateTodoWithId} to update text content`
				);
				return state;
			}

			updatedTodoObj.text = action.payload.text;
			updatedTodoObj.lastUpdatedAt = nowIsoString;

			const newState = {
				...state,
				todos: state.todos.map((todo) =>
					todo.id === updatedTodoObj.id ? updatedTodoObj : todo
				),
			};

			updateLocalStorage(newState, action);

			return newState;
		}
		case TTodoStoreActionTypes.UPDATE_TODO_COMPLETION_STATUS: {
			const nowDateObj = new Date();
			const nowIsoString = nowDateObj.toISOString();

			const updatedTodoObj = state.todos.find(
				(todo) => todo.id === action.payload.updateTodoWithId
			);

			if (!updatedTodoObj) {
				console.error(
					functionSignature,
					action.payload,
					`Could not find todo with id ${action.payload.updateTodoWithId} to update completion status`
				);
				return state;
			}

			updatedTodoObj.isCompleted = action.payload.newCompletionStatus;
			updatedTodoObj.completedAt = action.payload.newCompletionStatus
				? nowIsoString
				: null;

			const newState = {
				...state,
				todos: state.todos.map((todo) =>
					todo.id === updatedTodoObj.id ? updatedTodoObj : todo
				),
			};

			updateLocalStorage(newState, action);

			return newState;
		}
		case TTodoStoreActionTypes.DELETE_TODO: {
			const newState = {
				...state,
				todos: state.todos.filter(
					(todo) => todo.id !== action.payload.deleteTodoWithId
				),
			};

			updateLocalStorage(newState, action);

			return newState;
		}
		case TTodoStoreActionTypes.LOAD_USER_DATA_FROM_LOCAL_STORAGE: {
			let highestId = 0;
			action.payload.forEach((todo) => {
				if (todo.id > highestId) highestId = todo.id;
			});

			return {
				todos: [...action.payload],
				todoIdIterator: highestId + 1,
			};
		}
		default: {
			console.error(
				functionSignature,
				// @ts-expect-error TS2339 - Property 'type' does not exist on type 'never'.
				`Unknown action type: ${action.type}`
			);
			return state;
		}
	}
}

function updateLocalStorage(
	updatedAppState: TTodoStoreState,
	action: TTodoStoreAction,
	newTodoId?: number
) {
	const functionSignature = "todoStore.ts@updateLocalStorage()";

	switch (action.type) {
		case TTodoStoreActionTypes.ADD_TODO: {
			if (newTodoId === undefined) {
				console.error(functionSignature, "newTodoId is undefined");
				return;
			}

			const newTodo = updatedAppState.todos.find(
				(todo) => todo.id === newTodoId
			);
			if (!newTodo) {
				console.error(
					functionSignature,
					`Could not find new todo with id ${newTodoId}`
				);
				return;
			}

			localStorage.setItem(
				`${TODO_KEY_PREFIX}${newTodoId}`,
				JSON.stringify(newTodo)
			);
			break;
		}
		case TTodoStoreActionTypes.UPDATE_TODO_TEXT_CONTENT: {
			const updatedTodo = updatedAppState.todos.find(
				(todo) => todo.id === action.payload.updateTodoWithId
			);
			if (!updatedTodo) {
				console.error(
					functionSignature,
					`Could not find updated todo with id ${action.payload.updateTodoWithId}`
				);
				return;
			}

			localStorage.setItem(
				`${TODO_KEY_PREFIX}${updatedTodo.id}`,
				JSON.stringify(updatedTodo)
			);
			break;
		}
		case TTodoStoreActionTypes.UPDATE_TODO_COMPLETION_STATUS: {
			const updatedTodo = updatedAppState.todos.find(
				(todo) => todo.id === action.payload.updateTodoWithId
			);
			if (!updatedTodo) {
				console.error(
					functionSignature,
					`Could not find updated todo with id ${action.payload.updateTodoWithId}`
				);
				return;
			}

			localStorage.setItem(
				`${TODO_KEY_PREFIX}${updatedTodo.id}`,
				JSON.stringify(updatedTodo)
			);
			break;
		}
		case TTodoStoreActionTypes.DELETE_TODO: {
			localStorage.removeItem(
				`${TODO_KEY_PREFIX}${action.payload.deleteTodoWithId}`
			);
			break;
		}
		default:
			console.error(
				functionSignature,
				`Unknown action type ${action.type}`
			);
			break;
	}
}

export function getAllTodoObjectsFromLocalStorage(): null | TTodo[] {
	const functionSignature =
		"todoStore.ts@getAllTodoObjectsFromLocalStorage()";

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
			if (typeof lsItem !== "string" || lsItem === null) {
				console.error(
					functionSignature,
					`lsItem is not a string or is null. Skipping...`,
					lsItem
				);

				return;
			}

			let newTodo: TTodo | null = null;
			try {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				const parsedTodo = JSON.parse(lsItem);

				if (!(parsedTodo instanceof Object) || parsedTodo === null) {
					console.error(
						functionSignature,
						`The item in localStorage for key ${key} is not an object. Skipping...`,
						parsedTodo
					);
					return;
				}

				// Check for required properties
				if (
					!("id" in parsedTodo) ||
					!("text" in parsedTodo) ||
					!("isCompleted" in parsedTodo) ||
					!("createdAt" in parsedTodo) ||
					!("lastUpdatedAt" in parsedTodo) ||
					!("completedAt" in parsedTodo)
				) {
					console.error(
						functionSignature,
						`The item in localStorage for key ${key} is missing one or more required properties. Skipping...`,
						parsedTodo
					);
					return;
				}

				// Type checks
				if (
					typeof parsedTodo.id !== "number" ||
					typeof parsedTodo.text !== "string" ||
					typeof parsedTodo.isCompleted !== "boolean" ||
					(typeof parsedTodo.createdAt !== "string" &&
						parsedTodo.createdAt !== null) ||
					(typeof parsedTodo.lastUpdatedAt !== "string" &&
						parsedTodo.lastUpdatedAt !== null) ||
					(typeof parsedTodo.completedAt !== "string" &&
						parsedTodo.completedAt !== null)
				) {
					console.error(
						functionSignature,
						`The item in localStorage for key ${key} does not have the correct types. Skipping...`,
						parsedTodo
					);
					return;
				}

				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				newTodo = parsedTodo;
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

	if (todos.length === 0) {
		return null;
	} else {
		const todosSortedById = [...todos].sort((a, b) => b.id - a.id);
		return todosSortedById;
	}
}
