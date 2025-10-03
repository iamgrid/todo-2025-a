import { friendlyDate } from "../../helpers";

import Tooltip from "@mui/material/Tooltip";

interface TFriendlyDateProps {
	input: string | Date;
	triggerRerender: number;
}

export default function FriendlyDate({
	input,
	// @ts-expect-error unused but needed to trigger rerender
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	triggerRerender,
}: TFriendlyDateProps): React.ReactNode {
	const inputDateObj = input instanceof Date ? input : new Date(input);

	// console.log("FriendlyDate render with triggerRerender:", triggerRerender);

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
