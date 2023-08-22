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
  details: "",
  protocol: "",
  type: "",
  description: "",
};

const FormService = ({
  open,
  handleClose,
  selectedServiceId,
  serviceType,
  setServiceData,
  serviceData,
  loaderShow,
  formType,
}) => {
  // ** State
  const [serviceLoader, setServiceLoader] = useState(false);
  const [selectServiceData, setSelectServiceData] = useState(initialValues);

  const theme = useTheme();

  const handleSelectedService = () => {
    const findService = serviceData.find(
      (service) => service.id === selectedServiceId
    );
    setSelectServiceData({
      name: findService?.name,
      details: findService?.details,
      protocol: findService?.protocol,
      type: findService?.type,
      description: findService?.description,
    });
  };

  useEffect(() => {
    selectedServiceId && handleSelectedService();
  }, [selectedServiceId]);

  const {
    values,
    errors,
    touched,
    resetForm,
    handleBlur,
    handleChange,
    handleSubmit,
  } = useFormik({
    initialValues: formType === "edit" ? selectServiceData : initialValues,
    validationSchema: CreateConnectorValidation,
    validateOnChange: true,
    validateOnBlur: false,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        setServiceLoader(true);
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

        setServiceLoader(false);
        resetForm({ values: "" });
        toast.success("Service created successfully!");
        handleClose();
      } catch (error) {
        setServiceLoader(false);
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
        maxWidth="sm"
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
          {formType === "edit" ? "Edit" : "Create"} a Service
          <IconButton
            aria-label="close"
            onClick={handleClose}
            disabled={serviceLoader}
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
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
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
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="details"
                      label="Details"
                      name="details"
                      value={values.details}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        Boolean(errors.details) && Boolean(touched.details)
                      }
                      helperText={
                        Boolean(errors.details) && Boolean(touched.details)
                          ? errors.details
                          : null
                      }
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="protocol"
                      label="Protocol"
                      name="protocol"
                      value={values.protocol}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        Boolean(errors.protocol) && Boolean(touched.protocol)
                      }
                      helperText={
                        Boolean(errors.protocol) && Boolean(touched.protocol)
                          ? errors.protocol
                          : null
                      }
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="type"
                      label="Type"
                      name="type"
                      value={values.type}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(errors.type) && Boolean(touched.type)}
                      helperText={
                        Boolean(errors.type) && Boolean(touched.type)
                          ? errors.type
                          : null
                      }
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      fullWidth
                      multiline
                      rows={1}
                      id="description"
                      label="Description"
                      name="description"
                      value={values.description}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        Boolean(errors.description) &&
                        Boolean(touched.description)
                      }
                      helperText={
                        Boolean(errors.description) &&
                        Boolean(touched.description)
                          ? errors.description
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
              disabled={serviceLoader}
            >
              Close
            </Button>
            <Button
              type="submit"
              size="medium"
              variant="contained"
              disabled={true}
              // serviceLoader
              sx={{
                overflow: "hidden",
                "& .cstm_loaderbx": {
                  backgroundColor: "rgba(255, 255, 255, 0.40)",
                },
              }}
            >
              {serviceLoader && <Loader />}
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default FormService;
