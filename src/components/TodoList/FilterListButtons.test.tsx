import { render, screen } from "@testing-library/react";
import { it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";

import FilterListButtons from "./FilterListButtons";

import { FILTERING_OPTIONS } from "../../helpers";

it("renders correctly", async () => {
	render(
		<FilterListButtons
			noOfTodos={5}
			noOfIncompleteTodos={3}
			noOfCompletedTodos={2}
			currentFilteringOption={FILTERING_OPTIONS.all}
			setCurrentFilteringOption={() => {}}
		/>
	);

	expect(screen.getByText("Filter:")).toBeInTheDocument();
	expect(screen.getByLabelText("All (5)")).toBeInTheDocument();
	expect(screen.getByLabelText("Incomplete (3)")).toBeInTheDocument();
	expect(screen.getByLabelText("Completed (2)")).toBeInTheDocument();
});

it("calls setCurrentFilteringOption when a button is clicked", async () => {
	const mockSetCurrentFilteringOption = vi.fn();

	render(
		<FilterListButtons
			noOfTodos={5}
			noOfIncompleteTodos={3}
			noOfCompletedTodos={2}
			currentFilteringOption={FILTERING_OPTIONS.all}
			setCurrentFilteringOption={mockSetCurrentFilteringOption}
		/>
	);

	await userEvent.click(screen.getByLabelText("Incomplete (3)"));

	expect(mockSetCurrentFilteringOption).toHaveBeenCalledWith(
		FILTERING_OPTIONS.incomplete
	);
});
