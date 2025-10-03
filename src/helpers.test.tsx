import { describe, expect, it } from "vitest";
import { friendlyDate, shortDateFormat, shortenPhrase } from "./helpers.tsx";

describe("shortDateFormat", () => {
	it("formats date years in the past correctly", () => {
		const date = new Date("2023-10-05T12:34:56Z");
		expect(shortDateFormat(date)).toBe("Oct 5, 2023");
	});

	it("formats current year dates correctly", () => {
		const nowDateObj = new Date();
		const currentYearDate = new Date(
			nowDateObj.getFullYear(),
			5, // June (0-based month)
			15
		);
		expect(shortDateFormat(currentYearDate)).toBe(`Jun 15`);
	});

	it("formats date years in the future correctly", () => {
		const nowDateObj = new Date();
		const futureYearDate = new Date(
			nowDateObj.getFullYear() + 1,
			11, // December (0-based month)
			25
		);
		expect(shortDateFormat(futureYearDate)).toBe(
			`Dec 25, ${nowDateObj.getFullYear() + 1}`
		);
	});
});

describe("friendlyDate", () => {
	const invalidDateResponse = "[invalid date]";
	it("invalid date string", () => {
		expect(friendlyDate("invalid-date-string")).toBe(invalidDateResponse);
	});

	it("invalid Date object", () => {
		expect(friendlyDate(new Date("invalid-date-string"))).toBe(
			invalidDateResponse
		);
	});

	it("a date 3 days in the future", () => {
		const now = new Date();
		const threeDaysFromNow = new Date(
			now.getTime() + 3 * 24 * 60 * 60 * 1000
		);

		const expectedDateStr = `${shortDateFormat(
			threeDaysFromNow
		)} (3 days from now)`;
		// console.log({ expectedDateStr });
		expect(friendlyDate(threeDaysFromNow)).toBe(expectedDateStr);
	});

	it("a date 5 days in the past", () => {
		const now = new Date();
		const fiveDaysAgo = new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000);

		const expectedDateStr = `${shortDateFormat(fiveDaysAgo)} (5 days ago)`;
		// console.log({ expectedDateStr });
		expect(friendlyDate(fiveDaysAgo)).toBe(expectedDateStr);
	});

	it("a date 2 hours in the past", () => {
		const now = new Date();
		const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

		expect(friendlyDate(twoHoursAgo)).toBe(
			`2 hours ago (${shortDateFormat(twoHoursAgo)})`
		);
	});

	it("a date 2 hours in the future", () => {
		const now = new Date();
		const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
		expect(friendlyDate(twoHoursFromNow)).toBe(
			`2 hours from now (${shortDateFormat(twoHoursFromNow)})`
		);
	});

	it("a date 1 hour in the future", () => {
		const now = new Date();
		const oneHourFromNow = new Date(now.getTime() + 1 * 60 * 60 * 1000);
		expect(friendlyDate(oneHourFromNow)).toBe(`1 hour from now`);
	});

	it("a date yesterday, 25 hours ago", () => {
		const now = new Date();
		const yesterday = new Date(now.getTime() - 25 * 60 * 60 * 1000);
		expect(friendlyDate(yesterday)).toBe(
			`yesterday (${shortDateFormat(yesterday)})`
		);
	});
});

describe("shortenPhrase", () => {
	it("shortens a long phrase", () => {
		const input = "This is a long phrase that needs to be shortened.";
		const maxLength = 30;
		const result = shortenPhrase(input, maxLength);
		expect(result).toBe("This is a long phrase ...");
	});

	it("does not shorten a short phrase", () => {
		const input = "Short phrase.";
		const maxLength = 30;
		const result = shortenPhrase(input, maxLength);
		expect(result).toBe(input);
	});

	it("handles undefined input", () => {
		const result = shortenPhrase(undefined, 30);
		expect(result).toBe("-");
	});

	it("handles null input", () => {
		const result = shortenPhrase(null, 30);
		expect(result).toBe("-");
	});

	it("handles false input", () => {
		const result = shortenPhrase(false, 30);
		expect(result).toBe("-");
	});
});
