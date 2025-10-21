function Fallback({ error }: { error: Error }) {
	return (
		<div>
			<h2 style={{ color: "white" }}>
				The app encountered an unrecoverable error:
			</h2>
			<pre style={{ color: "red" }}>{error.message}</pre>
		</div>
	);
}

export default Fallback;
