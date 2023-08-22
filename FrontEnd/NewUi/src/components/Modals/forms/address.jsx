import { useState, useEffect } from "react";
// ** MUI Imports
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import copy from "copy-to-clipboard";
import Loader from "src/components/Loader";
import { useFormik } from "formik";
import { CreateConnectorValidation } from "utils/validation";
import { encryptPayload } from "utils/commonFunctions";
import {
  createCloudConnector,
  updateCloudConnector,
} from "utils/apis/routes/settings";
import { toast } from "react-toastify";

const initialValues = {
  name: "",
  address: "",
};

const FormAddress = ({
  open,
  handleClose,
  selectedAddressId,
  addressType,
  setAddressData,
  addressData,
  loaderShow,
  formType,
}) => {
  // ** State
  const [addressLoader, setAddressLoader] = useState(false);
  const [selectAddressData, setSelectAddressData] = useState(initialValues);

  const theme = useTheme();

  const handleSelectedAddress = () => {
    const findAddress = addressData.find(
      (address) => address.id === selectedAddressId
    );
    setSelectAddressData({
      name: findAddress?.name,
      address: findAddress?.address,
    });
  };

  useEffect(() => {
    selectedAddressId && handleSelectedAddress();
  }, [selectedAddressId]);

  const {
    values,
    errors,
    touched,
    resetForm,
    handleBlur,
    handleChange,
    handleSubmit,
  } = useFormik({
    initialValues: formType === "edit" ? selectAddressData : initialValues,
    validationSchema: CreateConnectorValidation,
    validateOnChange: true,
    validateOnBlur: false,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        setAddressLoader(true);
        let data, isValid;
        if (formType === "add") {
          data = {
            ...values,
            cloud: connectorType,
          };
        } else {
          data = {
            ...values,
            id: selectedConnectorId,
            cloud: connectorType,
          };
        }
        const encryptionData = encryptPayload({ ...data });
        const requestData = {
          payload: encryptionData,
        };
        if (formType === "add") {
          isValid = await createCloudConnector(requestData);
          if (isValid && isValid.status === 201) {
            setConnectorData([...connectorData, isValid.data]);
          }
        } else {
          isValid = await updateCloudConnector(requestData);
          if (isValid) {
            const updatedConnectors = connectorData.map((connector) => {
              if (connector.id === selectedConnectorId) {
                return isValid.data;
              }
              return connector;
            });
            setConnectorData([...updatedConnectors]);
          }
        }

        setAddressLoader(false);
        resetForm({ values: "" });
        toast.success("Address created successfully!");
        handleClose();
      } catch (error) {
        setAddressLoader(false);
        toast.error(
          error?.response?.data?.error ||
            error?.message ||
            "something went wrong"
        );
        return;
      }
    },
  });

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
          "& .error_textMui": {
            marginTop: "3px",
            fontSize: "0.75rem",
            lineHeight: "1.66",
            letterSpacing: "0.4px",
            color: theme.palette.error.main,
          },
        }}
      >
        <DialogTitle
          sx={{
            paddingBottom: "20px",
            fontSize: "20px !important",
            fontWeight: "700",
            paddingRight: "50px",
            paddingBottom: "10px",
          }}
        >
          {formType === "edit" ? "Edit" : "Create"} a Address
          <IconButton
            aria-label="close"
            onClick={handleClose}
            disabled={addressLoader}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <DialogContent
            sx={{
              paddingTop: "20px !important",
            }}
          >
            <DialogContentText>
              <Box className="cstm_dialogbx">
                <Grid container spacing={4}>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      fullWidth
                      id="name"
                      label="Name"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(errors.name) && Boolean(touched.name)}
                      helperText={
                        Boolean(errors.name) && Boolean(touched.name)
                          ? errors.name
                          : null
                      }
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      fullWidth
                      id="address"
                      label="Address"
                      name="address"
                      value={values.address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        Boolean(errors.address) && Boolean(touched.address)
                      }
                      helperText={
                        Boolean(errors.address) && Boolean(touched.address)
                          ? errors.address
                          : null
                      }
                      required
                    />
                  </Grid>
                </Grid>
              </Box>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleClose}
              size="medium"
              variant="text"
              disabled={addressLoader}
            >
              Close
            </Button>
            <Button
              type="submit"
              size="medium"
              variant="contained"
              disabled={true}
              // addressLoader
              sx={{
                overflow: "hidden",
                "& .cstm_loaderbx": {
                  backgroundColor: "rgba(255, 255, 255, 0.40)",
                },
              }}
            >
              {addressLoader && <Loader />}
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default FormAddress;
