import { friendlyDate } from "../../helpers";

import Tooltip from "@mui/material/Tooltip";

interface TFriendlyDateProps {
	input: string | Date;
}

export default function FriendlyDate({
	input,
}: TFriendlyDateProps): React.ReactNode {
	const inputDateObj = input instanceof Date ? input : new Date(input);

	if (isNaN(inputDateObj.getTime())) {
		return "[invalid date]";
	} else {
		const titleString = inputDateObj.toLocaleString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
		return (
			<Tooltip
				title={titleString}
				placement="top"
				arrow
				enterDelay={200}
				enterNextDelay={200}
			>
				<span>{friendlyDate(input)}</span>
			</Tooltip>
		);
	}
}
