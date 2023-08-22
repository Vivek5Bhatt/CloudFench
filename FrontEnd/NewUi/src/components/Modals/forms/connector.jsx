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
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import EyeOutline from "mdi-material-ui/EyeOutline";
import EyeOffOutline from "mdi-material-ui/EyeOffOutline";
import Grid from "@mui/material/Grid";
import ContentPasteOutlinedIcon from "@mui/icons-material/ContentPasteOutlined";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
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
import { userMe } from "utils/apis/routes/auth";
import { setCookie } from "cookies-next";

const initialValues = {
  name: "",
  apiKey: "",
  secretKey: "",
  accountId: "",
};

const FormConnector = ({
  open,
  handleClose,
  selectedConnectorId,
  connectorType,
  policy,
  setConnectorData,
  connectorData,
  loaderShow,
  formType,
}) => {
  // ** State
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [copyPolicy, setCopyPolicy] = useState(false);
  const [connectorLoader, setConnectorLoader] = useState(false);
  const [selectConnectorData, setSelectConnectorData] = useState(initialValues);

  const theme = useTheme();

  const handleClickShowSecretKey = () => {
    setShowSecretKey(!showSecretKey);
  };

  const handleMouseDownSecretKey = (event) => {
    event.preventDefault();
  };

  const handleCopyPolicy = () => {
    setCopyPolicy(true);
    copy(policy);
    setTimeout(() => {
      setCopyPolicy(false);
    }, 1000);
  };

  const handleSelectedConnector = () => {
    const findConnector = connectorData.find(
      (connector) => connector.id === selectedConnectorId
    );
    setSelectConnectorData({
      name: findConnector?.name,
      apiKey: findConnector?.accessKey,
      secretKey: findConnector?.secretKey,
      accountId: findConnector?.accountId,
    });
  };

  useEffect(() => {
    selectedConnectorId && handleSelectedConnector();
  }, [selectedConnectorId]);

  const {
    values,
    errors,
    touched,
    resetForm,
    handleBlur,
    handleChange,
    handleSubmit,
  } = useFormik({
    initialValues: formType === "edit" ? selectConnectorData : initialValues,
    validationSchema: CreateConnectorValidation,
    validateOnChange: true,
    validateOnBlur: false,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        setConnectorLoader(true);
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
            let authRes = await userMe();
            if (authRes) {
              setCookie("cloudConnector", authRes?.data?.data?.cloudConnector);
            }
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

        setConnectorLoader(false);
        resetForm({ values: "" });
        toast.success("Connector created successfully!");
        handleClose();
      } catch (error) {
        setConnectorLoader(false);
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
        maxWidth="md"
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
          {formType === "edit" ? "Edit" : "Create"} a Cloud Connector
          <IconButton
            aria-label="close"
            onClick={handleClose}
            disabled={connectorLoader}
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
                <Grid container spacing={6}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="connectorName"
                      label="Connector Name"
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
                      id="accountId"
                      label="Account Id"
                      name="accountId"
                      value={values.accountId}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={
                        Boolean(errors.accountId) && Boolean(touched.accountId)
                      }
                      helperText={
                        Boolean(errors.accountId) && Boolean(touched.accountId)
                          ? errors.accountId
                          : null
                      }
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      id="apiKey"
                      label="Access Key"
                      name="apiKey"
                      value={values.apiKey}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(errors.apiKey) && Boolean(touched.apiKey)}
                      helperText={
                        Boolean(errors.apiKey) && Boolean(touched.apiKey)
                          ? errors.apiKey
                          : null
                      }
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel
                        htmlFor="secretKey"
                        error={
                          Boolean(errors.secretKey) &&
                          Boolean(touched.secretKey)
                        }
                        required
                      >
                        Secret Key
                      </InputLabel>
                      <OutlinedInput
                        label="Secret Key"
                        id="secretKey"
                        type={showSecretKey ? "text" : "password"}
                        name="secretKey"
                        value={values.secretKey}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              edge="end"
                              onClick={handleClickShowSecretKey}
                              onMouseDown={handleMouseDownSecretKey}
                              aria-label="toggle secret key visibility"
                            >
                              {showSecretKey ? (
                                <EyeOutline />
                              ) : (
                                <EyeOffOutline />
                              )}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                    {Boolean(errors.secretKey) && Boolean(touched.secretKey) ? (
                      <Typography
                        className="error_textMui"
                        variant="body2"
                        sx={{ marginRight: 2 }}
                      >
                        {errors.secretKey}
                      </Typography>
                    ) : null}
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <Box className="policy_card">
                      <Typography
                        variant="body1"
                        sx={{
                          fontSize: "14px !important",
                          fontWeight: "600",
                          paddingBottom: "6px",
                        }}
                      >
                        Policy
                      </Typography>
                      <Box
                        sx={{
                          border: "1px solid",
                          height: "180px",
                          overflowY: "auto",
                          backgroundColor: "#333",
                          borderRadius: "6px",
                          padding: "10px 20px",
                          paddingRight: "25px",
                          position: "relative",
                          "& pre": {
                            color: "#fff",
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-all",
                          },
                        }}
                      >
                        <Box
                          variant="body1"
                          sx={{
                            fontSize: "14px !important",
                            paddingBottom: "6px",
                            color: theme.palette.text.secondary,
                          }}
                        >
                          {loaderShow && <Loader />}
                          <pre>{policy}</pre>
                        </Box>
                        <Box
                          sx={{
                            position: "absolute",
                            top: "0px",
                            right: "0px",
                          }}
                        >
                          {copyPolicy ? (
                            <IconButton aria-label="delete">
                              <AssignmentTurnedInIcon sx={{ color: "#fff" }} />
                            </IconButton>
                          ) : (
                            <IconButton
                              aria-label="delete"
                              onClick={handleCopyPolicy}
                            >
                              <ContentPasteOutlinedIcon
                                sx={{ opacity: "0.7", color: "#fff" }}
                              />
                            </IconButton>
                          )}
                        </Box>
                      </Box>
                    </Box>
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
              disabled={connectorLoader}
            >
              Close
            </Button>
            <Button
              type="submit"
              size="medium"
              variant="contained"
              disabled={connectorLoader}
              sx={{
                overflow: "hidden",
                "& .cstm_loaderbx": {
                  backgroundColor: "rgba(255, 255, 255, 0.40)",
                },
              }}
            >
              {connectorLoader && <Loader />}
              Submit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default FormConnector;
