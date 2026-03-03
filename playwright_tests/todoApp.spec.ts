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
			page.getByRole("textbox", { name: /add new todo/i }),
		).toBeVisible();
		await expect(page.getByRole("button", { name: /add/i })).toBeVisible();
		await expect(page.getByText(/do 50 push-ups/i)).toBeVisible();
		await expect(page.getByText(/buy avocado/i)).toBeVisible();
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
		await expect(allTodos).toHaveCount(6);
	});

	test("can complete a todo", async ({ page }) => {
		const allTodos = page.getByRole("listitem");

		await expect(allTodos).toHaveCount(2);

		await page.getByRole("button", { name: /oldest first/i }).click();

		await expect(allTodos.nth(0)).toHaveText(/buy avocado/i);

		const firstTodoCheckbox = allTodos.nth(0).getByRole("checkbox");
		await expect(firstTodoCheckbox).not.toBeChecked();
		await firstTodoCheckbox.check();
		await expect(firstTodoCheckbox).toBeChecked();
	});

	test("can edit a todo", async ({ page }) => {
		const allTodos = page.getByRole("listitem");

		await expect(allTodos).toHaveCount(2);

		await page.getByRole("button", { name: /oldest first/i }).click();

		await expect(allTodos.nth(1)).toHaveText(/do 50 push-ups/i);

		const secondTodo = allTodos.nth(1);
		await secondTodo.getByRole("button", { name: /edit/i }).click();

		const editInput = secondTodo.getByRole("textbox");
		await expect(editInput).toHaveValue(/do 50 push-ups/i);

		await editInput.fill("do 50 push-ups (updated)");
		await page.keyboard.press("Enter");

		await expect(secondTodo).toHaveText(/do 50 push-ups \(updated\)/i);
	});

	test("can delete a todo", async ({ page }) => {
		const allTodos = page.getByRole("listitem");

		await expect(allTodos).toHaveCount(2);

		await page.getByRole("button", { name: /oldest first/i }).click();

		await expect(allTodos.nth(1)).toHaveText(/do 50 push-ups/i);

		const secondTodo = allTodos.nth(1);
		await secondTodo.getByRole("button", { name: /delete/i }).click();

		await expect(
			page.getByText(/you are about to delete the following.*/i),
		).toBeVisible();
		await page.getByRole("button", { name: /^delete todo$/i }).click();

		await expect(allTodos).toHaveCount(1);
		await expect(allTodos.nth(0)).not.toHaveText(/do 50 push-ups/i);
	});

	test("can clear completed todos using the appropriate button", async ({
		page,
	}) => {
		const allTodos = page.getByRole("listitem");

		await expect(allTodos).toHaveCount(2);

		await _addTodos(page);

		await expect(allTodos).toHaveCount(6);

		await page.getByRole("button", { name: /oldest first/i }).click();

		const firstTodoCheckbox = allTodos.nth(0).getByRole("checkbox");
		const secondTodoCheckbox = allTodos.nth(1).getByRole("checkbox");

		await firstTodoCheckbox.check();
		await secondTodoCheckbox.check();

		await expect(firstTodoCheckbox).toBeChecked();
		await expect(secondTodoCheckbox).toBeChecked();

		await page.getByRole("button", { name: /clear completed/i }).click();

		await expect(
			page.getByText(
				/you are about to permanently delete 2 completed todos.*/i,
			),
		).toBeVisible();
		await page.getByRole("button", { name: /^clear completed$/i }).click();

		await expect(allTodos).toHaveCount(4);
		await expect(allTodos.nth(0)).toHaveText(/first todo.*/i);
		await expect(allTodos.nth(1)).toHaveText(/second todo.*/i);
	});

	test("can complete all todos using the appropriate button", async ({
		page,
	}) => {
		const allTodos = page.getByRole("listitem");

		await expect(allTodos).toHaveCount(2);

		await page.getByRole("button", { name: /complete all/i }).click();

		await expect(
			page.getByText(
				/you are about to mark 2 incomplete todos as completed.*/i,
			),
		).toBeVisible();
		await page.getByRole("button", { name: /^complete all$/i }).click();

		await expect(allTodos.nth(0).getByRole("checkbox")).toBeChecked();
		await expect(allTodos.nth(1).getByRole("checkbox")).toBeChecked();
	});
});
