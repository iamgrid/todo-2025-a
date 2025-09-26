import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";

import styled from "@emotion/styled";

import { SORTING_OPTIONS, type TSortingOption } from "../../helpers";
import { Typography } from "@mui/material";
import { buttonGroupWrapperStyle } from "../../customTheme";

interface TSortListButtonsProps {
	currentSortingOption: TSortingOption;
	setCurrentSortingOption: (option: TSortingOption) => void;
}

const ButtonGroupWrapper = styled("div")(buttonGroupWrapperStyle);

export default function SortListButtons({
	currentSortingOption,
	setCurrentSortingOption,
}: TSortListButtonsProps) {
	return (
		<ButtonGroupWrapper>
			<Typography
				sx={{ marginRight: 1 }}
				color="text.secondary"
				fontSize={14}
			>
				Sort:
			</Typography>
			<ToggleButtonGroup
				aria-label="Sorting options"
				size="small"
				value={currentSortingOption}
				exclusive
				onChange={(_event, newOption) => {
					if (newOption !== null) {
						setCurrentSortingOption(newOption as TSortingOption);
					}
				}}
			>
				<ToggleButton
					value={SORTING_OPTIONS.default}
					aria-label="Default (Incomplete first, then newest first)"
					title="Incomplete first, then newest first"
				>
					Default
				</ToggleButton>
				<ToggleButton
					value={SORTING_OPTIONS["date-created-desc"]}
					aria-label="Newest First"
				>
					Newest First
				</ToggleButton>
				<ToggleButton
					value={SORTING_OPTIONS["date-created-asc"]}
					aria-label="Oldest First"
				>
					Oldest First
				</ToggleButton>
				<ToggleButton
					value={SORTING_OPTIONS["title-asc"]}
					aria-label="Title (A-Z)"
				>
					Title (A-Z)
				</ToggleButton>
			</ToggleButtonGroup>
		</ButtonGroupWrapper>
	);
}
