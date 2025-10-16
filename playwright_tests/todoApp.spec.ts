import { test, expect, type Page } from "@playwright/test";

test.describe("Todo App", () => {
	const todoText1 = "First todo";
	const todoText2 = "Second todo";
	const todoText3 = "Third todo";
	const todoText4 = "Fourth todo";

	async function _addTodos(page: Page) {
		const inputField = page.getByRole("textbox", { name: /add new todo/i });
		const addButton = page.getByRole("button", { name: /add/i });

		await expect(inputField).toBeEmpty();

		await inputField.fill(todoText1);
		await addButton.click();

		await inputField.fill(todoText2);
		await addButton.click();

		await inputField.focus();
		await page.keyboard.type(todoText3);
		await page.keyboard.press("Enter");

		await inputField.fill(todoText4);
		await addButton.click();
	}

	test.beforeEach(async ({ page }) => {
		await page.goto("http://localhost:3000/");
	});

	test("renders correctly", async ({ page }) => {
		await expect(page).toHaveTitle(/.*todo 2025 a/i);
		await expect(
			page.getByRole("textbox", { name: /add new todo/i })
		).toBeVisible();
		await expect(page.getByRole("button", { name: /add/i })).toBeVisible();
		await expect(page.getByText(/you have no todos .*/i)).toBeVisible();
	});

	test("can add new todos", async ({ page }) => {
		const inputField = page.getByRole("textbox", { name: /add new todo/i });

		await expect(inputField).toBeEmpty();

		await _addTodos(page);

		await expect(page.getByText(todoText1)).toBeVisible();
		await expect(inputField).toBeEmpty();

		await expect(page.getByText(todoText2)).toBeVisible();

		await expect(page.getByText(todoText3)).toBeVisible();

		await expect(page.getByText(todoText4)).toBeVisible();

		const allTodos = page.getByRole("listitem");
		await expect(allTodos).toHaveCount(4);
	});

	test("can complete a todo", async ({ page }) => {
		const allTodos = page.getByRole("listitem");

		await expect(allTodos).toHaveCount(0);

		await _addTodos(page);

		await expect(allTodos).toHaveCount(4);

		await page.getByRole("button", { name: /oldest first/i }).click();

		await expect(allTodos.nth(0)).toHaveText(/first todo.*/i);

		const firstTodoCheckbox = allTodos.nth(0).getByRole("checkbox");
		await expect(firstTodoCheckbox).not.toBeChecked();
		await firstTodoCheckbox.check();
		await expect(firstTodoCheckbox).toBeChecked();
	});

	test("can edit a todo", async ({ page }) => {
		const allTodos = page.getByRole("listitem");

		await expect(allTodos).toHaveCount(0);

		await _addTodos(page);

		await expect(allTodos).toHaveCount(4);

		await page.getByRole("button", { name: /oldest first/i }).click();

		await expect(allTodos.nth(1)).toHaveText(/second todo.*/i);

		const secondTodo = allTodos.nth(1);
		await secondTodo.getByRole("button", { name: /edit/i }).click();

		const editInput = secondTodo.getByRole("textbox");
		await expect(editInput).toHaveValue(/second todo/i);

		await editInput.fill("Updated second todo");
		await page.keyboard.press("Enter");

		await expect(secondTodo).toHaveText(/updated second todo.*/i);
	});
});
