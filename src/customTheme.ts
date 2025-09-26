import { createTheme } from "@mui/material";

const colors = {
	MAIN: "#507f98",
	MAIN_DARK: "#0674a7",
	MAIN_LIGHT: "#669cc3",
	MAIN_EXTRA_LIGHT: "#50809850",
	MAIN_EXTRA_LIGHT_B: "#50809810",
};

const customTheme = createTheme({
	palette: {
		primary: {
			main: colors.MAIN,
			dark: colors.MAIN_DARK,
			light: colors.MAIN_LIGHT,
		},
	},
	shape: { borderRadius: 12 },
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					textTransform: "none",
					lineHeight: "normal",
					"&.Mui-outlinedPrimary:hover": {
						backgroundColor: colors.MAIN_EXTRA_LIGHT_B,
						borderColor: colors.MAIN_EXTRA_LIGHT,
					},
					"&.Mui-containedPrimary:hover": {
						backgroundColor: colors.MAIN_DARK,
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
					color: colors.MAIN,
					borderColor: colors.MAIN_EXTRA_LIGHT,
					"&.Mui-selected": {
						backgroundColor: colors.MAIN,
						color: "#fff",
					},
					"&.Mui-selected:hover": {
						backgroundColor: colors.MAIN,
					},
					"&:hover": {
						backgroundColor: colors.MAIN_EXTRA_LIGHT_B,
					},
					transition: "background-color 0.3s, color 0.3s",
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
