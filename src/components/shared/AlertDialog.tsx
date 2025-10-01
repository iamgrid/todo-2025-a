import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";

export interface TAlertDialogProps {
	isOpen: boolean;
	description: string | React.ReactNode;
	cancelButtonText?: string;
	confirmButtonText?: string;
	confirmButtonColor?: "primary" | "error" | "warning" | "info" | "success";
	handleCancel(): void;
	handleConfirm(): void;
	showCancelButton?: boolean;
}

export default function AlertDialog({
	isOpen,
	description,
	cancelButtonText = "Cancel",
	confirmButtonText = "Confirm",
	confirmButtonColor = "primary",
	handleCancel,
	handleConfirm,
	showCancelButton = true,
}: TAlertDialogProps) {
	return (
		<Dialog
			open={isOpen}
			onClose={handleCancel}
			aria-describedby="alert-dialog-description"
		>
			<DialogContent>
				<DialogContentText id="alert-dialog-description">
					{description}
				</DialogContentText>
			</DialogContent>
			<DialogActions>
				{showCancelButton && (
					<Button onClick={handleCancel}>{cancelButtonText}</Button>
				)}
				<Button onClick={handleConfirm} color={confirmButtonColor}>
					{confirmButtonText}
				</Button>
			</DialogActions>
		</Dialog>
	);
}
