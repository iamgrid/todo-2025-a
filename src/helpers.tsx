export const TODO_KEY_PREFIX = "todo_";
export const MAX_TODO_TITLE_LENGTH = 500;

export function sum(a: number, b: number): number {
	const re: number = a + b;
	return re;
}

/**
 * Converts an ISO 8601 date string (created with .toISOString()) or a Date object into a more human-friendly format.
 * @param input ISO 8601 date string or Date object
 */

export function friendlyDate(input: string | Date): string {
	const inputDateObj = input instanceof Date ? input : new Date(input);

	if (isNaN(inputDateObj.getTime())) {
		return "[invalid date]";
	}

	let reply = "";
	const shortMonths = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec",
	];

	const ts = inputDateObj.getTime() / 1000;
	const nowObj = new Date();
	const nowTs = Date.now() / 1000;
	const zerohourToday =
		Date.parse(
			`${nowObj.getFullYear()}-${
				nowObj.getMonth() + 1
			}-${nowObj.getDate()} 00:00:00`
		) / 1000; // timestamp for 00:00:00 of today

	let strDate = `${
		shortMonths[inputDateObj.getMonth()]
	} ${inputDateObj.getDate()}`;
	if (inputDateObj.getFullYear() !== nowObj.getFullYear()) {
		strDate = `${strDate}, ${inputDateObj.getFullYear()}`;
	}

	const diff = Math.round(nowTs - ts);
	const diffInDays = Math.ceil(Math.abs(zerohourToday - ts) / (24 * 60 * 60));
	const maxDayDifferenceToShow = 99;

	if (diff < 0 && diff < -48 * 60 * 60) {
		reply = strDate;
		if (diffInDays <= maxDayDifferenceToShow + 1) {
			reply = strDate + " (" + (diffInDays - 1) + " days from now)";
		}
	} else if (diff < 0 && diff >= -48 * 60 * 60 && diff <= -2 * 60 * 60) {
		reply =
			Math.floor(Math.abs(diff) / (60 * 60)) +
			" hours from now (" +
			strDate +
			")";
	} else if (diff < 0 && diff > -2 * 60 * 60 && diff <= -60 * 60) {
		reply = "1 hour from now";
	} else if (diff < 0 && diff > -60 * 60 && diff <= -120) {
		reply = Math.floor(Math.abs(diff) / 60) + " minutes from now";
	} else if (diff < 0 && diff > -120 && diff <= -60) {
		reply = "1 minute from now";
	} else if (diff < 0 && diff > -60 && diff <= -10) {
		reply = Math.abs(diff) + " seconds from now";
	} else if (diff < 0 && diff > -10) {
		reply = "a few seconds from now";
	} else if (diff < 10) {
		reply = "a few seconds ago";
	} else if (diff < 60) {
		reply = diff + " seconds ago";
	} else if (diff < 120) {
		reply = "1 minute ago";
	} else if (diff < 60 * 60) {
		reply = Math.floor(diff / 60) + " minutes ago";
	} else if (diff < 2 * 60 * 60) {
		reply = "1 hour ago";
	} else if (diff <= 24 * 60 * 60) {
		reply = Math.floor(diff / (60 * 60)) + " hours ago";
	} else if (
		diff > 24 * 60 * 60 &&
		ts < zerohourToday &&
		ts >= zerohourToday - 24 * 60 * 60
	) {
		reply = "yesterday (" + strDate + ")";
	} else {
		reply = strDate;
		if (diffInDays <= maxDayDifferenceToShow) {
			reply = strDate + " (" + diffInDays + " days ago)";
		}
	}

	return reply;
}

export function shortenPhrase(
	input: string | false | null | undefined,
	maxLength: number,
	addDots: boolean = true,
	cutWords: boolean = false
): string {
	if (typeof input === "undefined" || input === false || input === null) {
		return "-";
	}
	if (input.length < maxLength) return input;

	let rawShortStr1 = input.substring(0, maxLength);
	if (addDots) {
		rawShortStr1 = input.substring(0, maxLength - 4);
	}

	if (cutWords) return `${rawShortStr1}${addDots ? "..." : ""}`;

	let rawShortStr2 = rawShortStr1.substring(0, rawShortStr1.lastIndexOf(" "));
	if (rawShortStr2.length === 0) {
		rawShortStr2 = input.substring(0, maxLength);
	}

	if (addDots) {
		return `${rawShortStr2} ...`;
	} else {
		return rawShortStr2;
	}
}
