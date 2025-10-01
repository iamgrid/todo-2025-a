import { createTheme } from "@mui/material";

const customThemeColors = {
	MAIN: "#507f98",
	MAIN_DARK: "#0674a7",
	MAIN_DARK_B: "#27404dcc",
	MAIN_LIGHT: "#669cc3",
	MAIN_EXTRA_LIGHT: "#50809850",
	MAIN_EXTRA_LIGHT_B: "#50809810",
	HIGHLIGHT: "#29b690",
};

const customTheme = createTheme({
	// cssVariables: true,
	// colorSchemes: { dark: true },
	palette: {
		primary: {
			main: customThemeColors.MAIN,
			dark: customThemeColors.MAIN_DARK,
			light: customThemeColors.MAIN_LIGHT,
		},
		secondary: {
			main: customThemeColors.HIGHLIGHT,
		},
	},
	shape: { borderRadius: 12 },
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					textTransform: "none",
					lineHeight: "normal",
					"&.MuiButton-outlinedPrimary:hover": {
						backgroundColor: customThemeColors.MAIN_EXTRA_LIGHT_B,
						borderColor: customThemeColors.MAIN_EXTRA_LIGHT,
					},
					"&.MuiButton-containedPrimary:hover": {
						backgroundColor: customThemeColors.HIGHLIGHT,
					},
					"&.MuiButton-containedPrimary.Mui-focusVisible": {
						backgroundColor: customThemeColors.HIGHLIGHT,
					},
				},
			},
		},
		MuiToggleButton: {
			styleOverrides: {
				root: {
					textTransform: "none",
					lineHeight: "normal",
					paddingLeft: 12,
					paddingRight: 12,
					color: customThemeColors.MAIN,
					borderColor: customThemeColors.MAIN_EXTRA_LIGHT,
					"&.Mui-selected": {
						backgroundColor: customThemeColors.HIGHLIGHT,
						color: "#fff",
						cursor: "default",
					},
					"&.Mui-selected:hover": {
						backgroundColor: customThemeColors.HIGHLIGHT,
					},
					"&:hover": {
						backgroundColor: customThemeColors.MAIN_EXTRA_LIGHT_B,
					},
					transition: "background-color 0.3s, color 0.3s",
				},
			},
		},
		MuiTextField: {
			styleOverrides: {
				root: {
					"& .MuiOutlinedInput-root": {
						"&.Mui-focused fieldset": {
							borderColor: customThemeColors.HIGHLIGHT,
						},
						"&:hover fieldset": {
							borderColor: customThemeColors.HIGHLIGHT,
						},
					},
				},
			},
		},
		MuiCheckbox: {
			styleOverrides: {
				root: {
					"&.Mui-checked": {
						color: customThemeColors.HIGHLIGHT,
					},
				},
			},
		},
		MuiSnackbar: {
			styleOverrides: {
				root: {
					"& .MuiPaper-root": {
						backgroundColor: customThemeColors.MAIN_DARK_B,
						color: "#fff",
					},
					"& .MuiSnackbarContent-root": {
						borderRadius: 0,
						lineHeight: "normal",
						border: `1px solid ${customThemeColors.MAIN_EXTRA_LIGHT}`,
					},
				},
			},
		},
	},
});

export const buttonGroupWrapperStyle = {
	display: "grid",
	gridTemplateColumns: "auto auto",
	alignItems: "center",
	justifyContent: "start",
};

export default customTheme;
