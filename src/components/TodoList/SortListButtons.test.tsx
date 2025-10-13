import { render, screen } from "@testing-library/react";
import { it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";

import SortListButtons from "./SortListButtons";

import { SORTING_OPTIONS } from "../../helpers";

it("renders correctly", async () => {
	render(
		<SortListButtons
			currentSortingOption={SORTING_OPTIONS.default}
			setCurrentSortingOption={() => {}}
		/>
	);

	expect(screen.getByText("Sort:")).toBeInTheDocument();
	expect(
		screen.getByLabelText("Default (Incomplete first, then newest first)")
	).toBeInTheDocument();
	expect(screen.getByLabelText("Newest First")).toBeInTheDocument();
	expect(screen.getByLabelText("Oldest First")).toBeInTheDocument();
	expect(screen.getByLabelText("Title (A-Z)")).toBeInTheDocument();
});

it("calls setCurrentSortingOption when a button is clicked", async () => {
	const mockSetCurrentSortingOption = vi.fn();

	render(
		<SortListButtons
			currentSortingOption={SORTING_OPTIONS.default}
			setCurrentSortingOption={mockSetCurrentSortingOption}
		/>
	);

	await userEvent.click(screen.getByLabelText("Newest First"));

	expect(mockSetCurrentSortingOption).toHaveBeenCalledWith(
		SORTING_OPTIONS["date-created-desc"]
	);
});
