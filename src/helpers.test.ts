import { expect, test } from "vitest";
import { sum } from "./helpers.ts";

test("adds 2 + 2 to equal 4", () => {
	expect(sum(2, 2)).toBe(4);
});

test("adds 7 + 2 to equal 9", () => {
	expect(sum(7, 2)).toBe(9);
});
