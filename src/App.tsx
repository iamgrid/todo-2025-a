import { useState } from "react";
import Container from "@mui/material/Container";
// import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import "./overrides.css";
import { ThemeProvider } from "@mui/material";
import { styled } from "@mui/material/styles";
import customTheme from "./customTheme.ts";

const StyledDiv = styled("div")({
	backgroundColor: "white",
	padding: 16,
	marginTop: 16,
	borderRadius: 8,
	boxShadow: "0 0 5px 3px rgba(80, 116, 152, .7)",
});

function App() {
	const [count, setCount] = useState(0);

	return (
		<ThemeProvider theme={customTheme}>
			<Container maxWidth="md">
				<StyledDiv>
					<Typography
						variant="h2"
						sx={{ mb: 2 }}
						color="text.primary"
					>
						Todo
					</Typography>
					<Button
						color="primary"
						variant="contained"
						onClick={() => setCount((count) => count + 1)}
					>
						count is {count}
					</Button>
				</StyledDiv>
			</Container>
		</ThemeProvider>
	);
}

export default App;
