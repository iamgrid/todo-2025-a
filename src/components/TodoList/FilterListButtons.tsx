import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";

import styled from "@emotion/styled";

import { FILTERING_OPTIONS, type TFilteringOption } from "../../helpers";
import { Typography } from "@mui/material";
import { buttonGroupWrapperStyle } from "../../customTheme";

interface TFilterListButtonsProps {
	currentFilteringOption: TFilteringOption;
	setCurrentFilteringOption: (option: TFilteringOption) => void;
}

export const ButtonGroupWrapper = styled("div")(buttonGroupWrapperStyle);

export default function FilterListButtons({
	currentFilteringOption,
	setCurrentFilteringOption,
}: TFilterListButtonsProps) {
	return (
		<ButtonGroupWrapper>
			<Typography
				sx={{ marginRight: 1 }}
				color="text.secondary"
				fontSize={14}
			>
				Filter:
			</Typography>
			<ToggleButtonGroup
				aria-label="Filtering options"
				size="small"
				value={currentFilteringOption}
				exclusive
				onChange={(_event, newOption) => {
					if (newOption !== null) {
						setCurrentFilteringOption(
							newOption as TFilteringOption
						);
					}
				}}
			>
				<ToggleButton value={FILTERING_OPTIONS.all} aria-label="All">
					All
				</ToggleButton>
				<ToggleButton
					value={FILTERING_OPTIONS.incomplete}
					aria-label="Incomplete"
				>
					Incomplete
				</ToggleButton>
				<ToggleButton
					value={FILTERING_OPTIONS.completed}
					aria-label="Completed"
				>
					Completed
				</ToggleButton>
			</ToggleButtonGroup>
		</ButtonGroupWrapper>
	);
}
