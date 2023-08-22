// ** MUI Imports
import { useState } from "react";
// import Image from "next/image";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
// import allowicon from "public/images/check-mark-green.svg";
// import blockicon from "public/images/blocked.svg";
import Loader from "src/components/Loader";
import CustomLoader from "src/components/Loader/CustomLoader";

const CustomConfirm = ({ open, handleClose, apiCall, label, loader }) => {
  const handleSubmit = () => {
    apiCall && apiCall();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xs"
        fullWidth
        sx={{
          "& .MuiOutlinedInput-input": {
            padding: "10px 14px",
          },
          "& .MuiInputLabel-outlined": {
            fontSize: "14px",
            transform: "translate(14px, 12px) scale(1)",
          },
          "& .MuiInputLabel-shrink.MuiInputLabel-outlined": {
            fontSize: "16px",
            transform: "translate(14px, -9px) scale(0.75)",
          },
          "& .MuiDialog-paper": {
            maxWidth: "300px",
          },
          "& .MuiButtonBase-root.MuiIconButton-root .MuiSvgIcon-root": {
            width: "20px",
            height: "auto",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontSize: "20px !important",
            fontWeight: "700",
            paddingRight: "50px",
            paddingBottom: "0px",
            paddingTop: "10px",
          }}
        >
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: "absolute",
              padding: "2px",
              right: 3,
              top: 3,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent
          sx={{
            paddingTop: "10px !important",
            padding: "10px",
          }}
        >
          <DialogContentText>
            <Box className="cstm_dialogbx">
              <Typography
                variant="h5"
                fontWeight={600}
                sx={{
                  textAlign: "center",
                  paddingBottom: "6px",
                  fontSize: "20px !important",
                }}
              >
                Are you sure?
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  textAlign: "center",
                  paddingBottom: "6px",
                  fontSize: "14px",
                }}
              >
                {label}
              </Typography>
            </Box>
          </DialogContentText>
        </DialogContent>
        {loader ? (
          <CustomLoader minHeight="35vh" />
        ) : (
          <DialogActions
            sx={{
              padding: "0 10px 15px 10px",
              justifyContent: "center",
              gap: "0 10px",
            }}
          >
            <Button
              onClick={handleClose}
              size="small"
              variant="contained"
              color="secondary"
            >
              No
            </Button>
            <Button
              onClick={handleSubmit}
              size="small"
              variant="contained"
              color={"success"}
              sx={{
                overflow: "hidden",
                "& .cstm_loaderbx": {
                  backgroundColor: "rgba(255, 255, 255, 0.40)",
                },
              }}
            >
              Yes
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </>
  );
};

export default CustomConfirm;
