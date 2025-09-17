import { useState } from "react";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import "./overrides.css";

function App() {
	const [count, setCount] = useState(0);

	return (
		<Container maxWidth="md">
			<Box
				sx={{
					bgcolor: "background.default",
					p: 4,
					mt: 4,
					borderRadius: 2,
					boxShadow: 3,
				}}
			>
				<Typography variant="h2" sx={{ mb: 2 }} color="text.primary">
					Todo
				</Typography>
				<Button
					color="primary"
					variant="contained"
					onClick={() => setCount((count) => count + 1)}
				>
					count is {count}
				</Button>
			</Box>
		</Container>
	);
}

export default App;
