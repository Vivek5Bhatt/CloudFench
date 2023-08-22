import { Dialog } from "@mui/material";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { useState } from "react";

const CustomDialog = ({ open, onClose, children, className }) => {
  const handleClose = () => {
    onClose(false);
  };
  return (
    <Dialog
      size="md"
      className={className && className}
      // onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}
      sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "100%",
          },
        },
      }}
    >
      <DialogContent dividers>{children}</DialogContent>
    </Dialog>
  );
};

export default CustomDialog;
