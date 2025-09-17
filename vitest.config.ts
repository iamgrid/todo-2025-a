import { defineConfig } from "vite";

export default defineConfig({
	test: {
		// include: ["**/__tests__/**/*.ts"], // if you want to run tests in __tests__ folder
		include: ["**/*.{test,spec}.?(c|m)[jt]s?(x)"],
	},
});
