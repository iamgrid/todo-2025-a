import { createTheme } from "@mui/material";

const customTheme = createTheme({
	palette: {
		primary: { main: "#507498" },
	},
	shape: { borderRadius: 8 },
});

export const buttonGroupWrapperStyle = {
	display: "grid",
	gridTemplateColumns: "auto auto",
	alignItems: "center",
	justifyContent: "start",
};

export default customTheme;
