import {
  Button,
  Checkbox,
  Divider,
  FormControl,
  Select,
  TextField,
  Tooltip,
  Typography,
  MenuItem,
  Box,
  Autocomplete,
  FormHelperText,
  FormControlLabel,
} from "@mui/material";
import CustomDialog from "src/components/Dialog";
import InfoIcon from "@mui/icons-material/Info";
import styled from "@emotion/styled";
import { useTheme } from "@mui/material/styles";
import { useFormik } from "formik";
import { useState } from "react";
import awsRegions from "aws-regions";
import { deployStackApi, getInfraEmailCode } from "utils/apis/routes/settings";
import CustomLoader from "src/components/Loader/CustomLoader";
import { DeployeStackSchema } from "utils/validation";

const ForthStep = ({
  deployValues,
  setDeployValues,
  handleSubmitApi,
  setStackOpen,
  stackOpen,
  theme,
  emailCode,
  resetForm,
  clearStates,
}) => {
  return (
    <Box>
      <Typography
        sx={{
          fontWeight: "700",
          color: theme.palette.text.primary,
          mb: "20px",
        }}
      >
        Add Authorization Code
      </Typography>
      <FormControl
        fullWidth
        sx={{ mb: "30px", flexDirection: "column", justifyContent: "start" }}
      >
        <Typography
          sx={{
            fontWeight: "500",
            width: "280px",
            fontSize: "15px",
            mb: "8px",
          }}
        >
          Authorization Code
        </Typography>
        <TextField
          key="code"
          type="tel"
          name="code"
          value={deployValues.code}
          onChange={(e) => {
            setDeployValues({ ...deployValues, code: e.target.value });
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "6px",
            },
            "& .MuiInputBase-input": {
              padding: "11px",
            },
          }}
        />
      </FormControl>
      <Box sx={{ display: "flex", justifyContent: "center", mt: "20px" }}>
        <Box>
          <Button
            size="small"
            variant="contained"
            sx={{
              minWidth: "84px",
              marginRight: "10px",
            }}
            onClick={() => {
              clearStates();
            }}
          >
            {" "}
            Close
          </Button>
          <Button
            size="small"
            variant="contained"
            sx={{
              minWidth: "84px",
              marginRight: "10px",
            }}
            onClick={() =>
              setStackOpen({
                ...stackOpen,
                first: false,
                second: false,
                third: true,
              })
            }
          >
            Back
          </Button>
        </Box>
        <Box>
          <Button
            size="small"
            variant="contained"
            sx={{
              minWidth: "84px",
              marginRight: "10px",
            }}
            disabled={window.atob(emailCode) !== deployValues.code}
            onClick={() => handleSubmitApi()}
          >
            Deploy
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

let labelS = {
  fontSize: "13px",
  color: "#a19595",
};

const FlexBox = styled(Box)({
  display: "flex",
  alignItems: "center",
});
const ThirdStep = ({
  handleClickThird,
  deployValues,
  setDeployValues,
  setStackOpen,
  stackOpen,
  theme,
  setNameError,
  nameError,
  codeLoader,
  resetForm,
  clearStates,
}) => {
  return (
    <Box>
      <FormControl fullWidth sx={{ mt: "15px" }}>
        <Typography
          sx={{
            fontWeight: "700",
            color: theme.palette.text.primary,
            mb: "10px",
          }}
        >
          Deploy a new Security stack
        </Typography>
        <FlexBox sx={{ mb: "10px" }}>
          <Typography
            sx={{
              fontWeight: "500",
              width: "280px",
              fontSize: "15px",
            }}
          >
            Stack Name
          </Typography>
        </FlexBox>

        <TextField
          name="progress"
          onChange={(e) => {
            setDeployValues({ ...deployValues, progress: e.target.value });
            setNameError(false);
          }}
          value={deployValues.progress}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "6px",
            },
            "& .MuiInputBase-input": {
              padding: "11px",
            },
          }}
        />
      </FormControl>
      <FormHelperText style={{ color: "red" }}>
        {nameError ? "Please Enter Name" : ""}
      </FormHelperText>
      <Box sx={{ display: "flex", justifyContent: "center", mt: "20px" }}>
        <Box>
          <Button
            size="small"
            variant="contained"
            sx={{
              minWidth: "84px",
              marginRight: "10px",
            }}
            onClick={() => {
              clearStates();
            }}
          >
            {" "}
            Close
          </Button>
          <Button
            size="small"
            variant="contained"
            sx={{
              minWidth: "84px",
              marginRight: "10px",
            }}
            onClick={() =>
              setStackOpen({
                ...stackOpen,
                first: false,
                second: true,
                third: false,
              })
            }
          >
            Back
          </Button>
        </Box>
        <Box>
          <Button
            disabled={deployValues.progress === ""}
            size="small"
            variant="contained"
            sx={{
              minWidth: "84px",
              marginRight: "10px",
            }}
            type="submit"
            onClick={() => handleClickThird()}
          >
            Deploy
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

const SecondStep = ({
  deployValues,
  setDeployValues,
  handleSubmitApi,
  setStackOpen,
  stackOpen,
  emailCode,
  handleSubmit,
  handleChange,
  handleBlur,
  errors,
  values,
  theme,
  touched,
  nameError,
  setNameError,
  resetForm,
  clearStates,
}) => {
  const [azTouched, setAzTouched] = useState(false);
  return (
    <form noValidate autoComplete="off" onSubmit={handleSubmit}>
      <Box>
        <Typography
          sx={{
            fontWeight: "700",
            color: theme.palette.text.primary,
            mb: "10px",
          }}
        >
          Deploy a new Security stack
        </Typography>

        <Typography sx={labelS}>Select the Cloud and the Region</Typography>

        <FormControl fullWidth sx={{ mt: "15px" }}>
          <Typography sx={{ mb: "2px", fontWeight: "500", fontSize: "14px" }}>
            Cloud
          </Typography>
          <Select
            id="select-cloud"
            sx={{ height: "45px" }}
            name="cloud"
            // value={deployValues.cloud}
            // onChange={(e) => {
            //   handleChange();
            //   setDeployValues({ ...deployValues, cloud: e.target.value });
            // }}
            value={values.cloud}
            onChange={handleChange}
            onBlur={handleBlur}
            error={Boolean(errors.cloud) && Boolean(touched.cloud)}
            required
          >
            {[
              { name: "AWS", value: "AWS" },
              { name: "Google", value: "Google" },
              { name: "Azure", value: "Azure" },
            ].map((active, index) => {
              return (
                <MenuItem
                  key={index}
                  value={active.value}
                  disabled={active.value != "AWS"}
                >
                  {active?.name}
                </MenuItem>
              );
            })}
          </Select>
          <FormHelperText style={{ color: "red" }}>
            {errors.cloud && touched.cloud ? errors.cloud : ""}
          </FormHelperText>
        </FormControl>

        <FormControl fullWidth sx={{ mt: "15px" }}>
          <Typography sx={{ mb: "2px", fontWeight: "500", fontSize: "14px" }}>
            Regions
          </Typography>
          <Select
            id="select-cloud"
            sx={{ height: "45px" }}
            // value={deployValues.region}
            // onChange={(e) =>
            //   setDeployValues({ ...deployValues, region: e.target.value })
            // }
            name="region"
            value={values.region}
            onChange={handleChange}
            onBlur={handleBlur}
            error={Boolean(errors.region) && Boolean(touched.region)}
            required
          >
            {awsRegions.list().map((active, index) => {
              return (
                <MenuItem key={index} value={active}>
                  {active?.full_name + "(" + active?.code + ")"}
                </MenuItem>
              );
            })}
          </Select>
          <FormHelperText style={{ color: "red" }}>
            {errors.region && touched.region ? errors.region : ""}
          </FormHelperText>
        </FormControl>

        <FormControl fullWidth>
          <Typography
            sx={{
              mb: "2px",
              fontWeight: "500",
              fontSize: "14px",
              mt: "15px",
            }}
          >
            Zones
          </Typography>

          <Autocomplete
            multiple
            value={deployValues.az}
            id="tags-standard"
            // value={values.az}
            // onChange={handleChange}
            // onBlur={handleBlur}
            // error={Boolean(errors.region) && Boolean(touched.region)}
            // required
            options={values.region?.zones || []}
            getOptionLabel={(option) => option}
            onChange={(e, values) => {
              setNameError(false);
              if (values.length > 2) {
                e.preventDefault();
                return;
              }
              setAzTouched(true);
              setDeployValues({ ...deployValues, az: values });
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label=""
                sx={{
                  border: `1px solid ${
                    nameError ? "red" : "rgba(58, 53, 65, 0.22)"
                  }`,
                  borderRadius: "6px",
                  "& .MuiInput-root .MuiInput-input": {
                    height: "32px",
                  },
                }}
              />
            )}
          />
          <FormHelperText style={{ color: "red" }}>
            {deployValues.az.length < 2 && azTouched
              ? "Please Select 2 zones"
              : ""}
          </FormHelperText>
        </FormControl>

        <FormControl fullWidth sx={{ mt: "15px" }}>
          <FlexBox sx={{ mb: "10px" }}>
            <Typography
              sx={{
                mb: "2px",
                fontWeight: "500",
                fontSize: "14px",
              }}
            >
              Select the stack size
            </Typography>
            <Tooltip title="Info">
              <InfoIcon sx={{ color: "#b5b5b5", ml: "10px" }} />
            </Tooltip>
          </FlexBox>

          <Select
            id="select-cloud"
            sx={{ height: "45px" }}
            name="instance"
            // value={deployValues.instance}
            // onChange={(e) => {
            //   setDeployValues({ ...deployValues, instance: e.target.value });
            // }}
            value={values.instance}
            onChange={handleChange}
            onBlur={handleBlur}
            error={Boolean(errors.instance) && Boolean(touched.instance)}
            required
          >
            {[
              { name: "Very Small", value: "Very Small" },
              { name: "Small", value: "Small" },
            ].map((active, index) => {
              return (
                <MenuItem key={index} value={active.value}>
                  {active?.name}
                </MenuItem>
              );
            })}
          </Select>
          <FormHelperText style={{ color: "red" }}>
            {errors.instance && touched.instance ? errors.instance : ""}
          </FormHelperText>
        </FormControl>
        <Box sx={{ display: "flex", justifyContent: "center", mt: "20px" }}>
          <Box>
            <Button
              size="small"
              variant="contained"
              sx={{
                minWidth: "84px",
                marginRight: "10px",
              }}
              onClick={() => {
                clearStates();
              }}
            >
              {" "}
              Close
            </Button>
            <Button
              size="small"
              variant="contained"
              sx={{
                minWidth: "84px",
                marginRight: "10px",
              }}
              onClick={() =>
                setStackOpen({
                  ...stackOpen,
                  first: true,
                  second: false,
                  third: false,
                })
              }
            >
              Back
            </Button>
          </Box>
          <Box>
            <Button
              size="small"
              variant="contained"
              sx={{
                minWidth: "84px",
                marginRight: "10px",
              }}
              disabled={
                Object.keys(errors).length ||
                !deployValues.az.length ||
                deployValues.az.length < 2
              }
              type={"submit"}
              onClick={() => {
                if (deployValues.az.length < 2) {
                  setNameError(true);
                }
              }}
              // onClick={() =>
              //   setStackOpen({
              //     ...stackOpen,
              //     first: false,
              //     second: false,
              //     third: true,
              //   })
              // }
            >
              Next
            </Button>
          </Box>
        </Box>
      </Box>
    </form>
  );
};
const DeployStack = (props) => {
  const theme = useTheme();
  const { open, onClose, setStackOpen, stackOpen, getDeplouments } =
    props || {};
  const [emailCode, setEmailCode] = useState("");
  const [codeLoader, setCodeLoader] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [deployValues, setDeployValues] = useState({
    region: "",
    waf: false,
    secure_nat_gw: false,
    internal_segmentation: false,
    sslvpn: false,
    cloud: "",
    az: [],
    instance: "",
    progress: "",
    createdAt: "",
    code: "",
  });

  const {
    values,
    errors,
    touched,
    handleBlur,
    setFieldTouched,
    validateForm,
    handleChange,
    handleSubmit,
    resetForm,
  } = useFormik({
    initialValues: deployValues,
    validationSchema: DeployeStackSchema,
    validateOnChange: true,
    validateOnBlur: false,
    // validateOnMount: true,
    async onSubmit(values) {
      const errors = await validateForm();
      if (Object.keys(errors).length === 0) {
        setStackOpen({
          ...stackOpen,
          first: false,
          second: false,
          third: true,
        });
      }
    },
  });

  const handleClickThird = async () => {
    if (deployValues.progress === "") {
      setNameError(true);
    } else {
      setCodeLoader(true);
      const res = await getInfraEmailCode();
      if (res.data) {
        setCodeLoader(false);
        setEmailCode(res.data);
        setStackOpen({
          ...stackOpen,
          first: false,
          second: false,
          third: false,
          forth: true,
        });
      }
    }
  };

  const clearStates = () => {
    setStackOpen({
      ...stackOpen,
      open: false,
    });
    setDeployValues({
      ...deployValues,
      region: "",
      waf: false,
      secure_nat_gw: false,
      internal_segmentation: false,
      sslvpn: false,
      cloud: "",
      az: [],
      instance: "",
      progress: "",
      createdAt: "",
      code: "",
    });
    resetForm();
  };
  const handleSubmitApi = async () => {
    setCodeLoader(true);
    const {
      cloud,
      code,
      az,
      region,
      waf,
      secure_nat_gw,
      internal_segmentation,
      sslvpn,
      instance,
      progress,
    } = deployValues || {};
    let apiData = {
      name: progress,
      progress: "initializing",
      createdAt: new Date(),
      cloud: values.cloud,
      az: az,
      instance: values.instance,
      region: values.region.code,
      // services: {
      //   webWorkLoad: true,
      //   secureConnectivity: false,
      //   workloadProtection: false,
      // },
      services: {
        waf: waf,
        secure_nat_gw: secure_nat_gw,
        internal_segmentation: internal_segmentation,
        sslvpn: sslvpn,
      },
    };

    if (window.atob(emailCode) === deployValues.code) {
      const res = await deployStackApi(apiData);
      setStackOpen({ ...stackOpen, open: false });
      getDeplouments();
      setCodeLoader(false);
      resetForm();
      setNameError(false);
      setDeployValues({
        ...deployValues,
        region: "",
        waf: false,
        secure_nat_gw: false,
        internal_segmentation: false,
        sslvpn: false,
        cloud: "",
        az: [],
        instance: "",
        progress: "",
        createdAt: "",
        code: "",
      });
    }
  };

  return (
    <>
      <CustomDialog open={open} onClose={() => onClose()}>
        {codeLoader ? (
          <CustomLoader minHeight="35vh" />
        ) : (
          <Box>
            {/* <form noValidate autoComplete="off" onSubmit={handleSubmit}> */}
            {stackOpen.first ? (
              <>
                <Typography
                  sx={{
                    fontWeight: "700",
                    color: theme.palette.text.primary,
                    mb: "10px",
                  }}
                >
                  Deploy a new Security stack
                </Typography>
                <Typography sx={labelS}>Web Application Firewell</Typography>
                <Divider />
                <FlexBox sx={{ mb: "20px" }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="waf"
                        onChange={(e) => {
                          setNameError(false);
                          setDeployValues({
                            ...deployValues,
                            waf: e.target.checked,
                          });
                        }}
                        checked={deployValues.waf}
                      />
                    }
                    label={
                      <Typography
                        sx={{
                          fontWeight: "500",
                          width: "280px",
                          fontSize: "15px",
                        }}
                      >
                        Web Workload and API Protection
                      </Typography>
                    }
                  />
                  <Tooltip title="Info">
                    <InfoIcon sx={{ color: "#b5b5b5" }} />
                  </Tooltip>
                </FlexBox>

                <Typography sx={labelS}>
                  Next Generation Cloud Firewell
                </Typography>
                <Divider sx={{ mb: "20px" }} />
                <FlexBox>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="secure_nat_gw"
                        onChange={(e) => {
                          setNameError(false);
                          setDeployValues({
                            ...deployValues,
                            secure_nat_gw: e.target.checked,
                          });
                        }}
                        checked={deployValues.secure_nat_gw}
                      />
                    }
                    label={
                      <Typography
                        sx={{
                          fontWeight: "500",
                          width: "280px",
                          fontSize: "15px",
                        }}
                      >
                        Workload Secure internet access
                      </Typography>
                    }
                  />

                  <Tooltip title="Info">
                    <InfoIcon sx={{ color: "#b5b5b5" }} />
                  </Tooltip>
                </FlexBox>

                <FlexBox sx={{ mb: "30px" }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="internal_segmentation"
                        onChange={(e) => {
                          setNameError(false);
                          setDeployValues({
                            ...deployValues,
                            internal_segmentation: e.target.checked,
                          });
                        }}
                        checked={deployValues.internal_segmentation}
                      />
                    }
                    label={
                      <Typography
                        sx={{
                          fontWeight: "500",
                          width: "280px",
                          fontSize: "15px",
                        }}
                      >
                        Workload Internal Segmentation
                      </Typography>
                    }
                  />
                  <Tooltip title="Info">
                    <InfoIcon sx={{ color: "#b5b5b5" }} />
                  </Tooltip>
                </FlexBox>

                <Typography sx={labelS}>Secure Remote Connectivity</Typography>
                <Divider sx={{ mb: "15px" }} />
                <FlexBox sx={{ mb: "20px" }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="sslvpn"
                        onChange={(e) => {
                          setNameError(false);
                          setDeployValues({
                            ...deployValues,
                            sslvpn: e.target.checked,
                          });
                        }}
                        checked={deployValues.sslvpn}
                      />
                    }
                    label={
                      <Typography
                        sx={{
                          fontWeight: "500",
                          width: "280px",
                          fontSize: "15px",
                        }}
                      >
                        Secure User Access
                      </Typography>
                    }
                  />

                  <Tooltip title="Info">
                    <InfoIcon sx={{ color: "#b5b5b5" }} />
                  </Tooltip>
                </FlexBox>
                <FormHelperText style={{ color: "red" }}>
                  {/* {errors.myCustomFieldName ? errors.myCustomFieldName : ""} */}
                  {nameError ? "Please Select Atleast One Option" : ""}
                </FormHelperText>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <Button
                    size="small"
                    variant="contained"
                    sx={{
                      minWidth: "84px",
                      marginRight: "10px",
                    }}
                    onClick={() => {
                      clearStates();
                    }}
                  >
                    {" "}
                    Close
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    sx={{
                      minWidth: "84px",
                      marginRight: "10px",
                    }}
                    disabled={
                      !deployValues.waf &&
                      !deployValues.internal_segmentation &&
                      !deployValues.secure_nat_gw &&
                      !deployValues.sslvpn
                    }
                    onClick={() => {
                      if (
                        !deployValues.waf &&
                        !deployValues.internal_segmentation &&
                        !deployValues.secure_nat_gw &&
                        !deployValues.sslvpn
                      ) {
                        setNameError(true);
                      } else {
                        setStackOpen({
                          ...stackOpen,
                          first: false,
                          second: true,
                        });
                      }
                    }}
                  >
                    Next
                  </Button>
                </Box>
              </>
            ) : stackOpen.second ? (
              <SecondStep
                handleSubmit={handleSubmit}
                handleChange={handleChange}
                handleBlur={handleBlur}
                errors={errors}
                values={values}
                theme={theme}
                touched={touched}
                deployValues={deployValues}
                setDeployValues={setDeployValues}
                setStackOpen={setStackOpen}
                stackOpen={stackOpen}
                nameError={nameError}
                setNameError={setNameError}
                resetForm={resetForm}
                clearStates={clearStates}
              />
            ) : stackOpen.third ? (
              <ThirdStep
                handleClickThird={handleClickThird}
                deployValues={deployValues}
                setDeployValues={setDeployValues}
                setStackOpen={setStackOpen}
                stackOpen={stackOpen}
                theme={theme}
                setNameError={setNameError}
                nameError={nameError}
                codeLoader={codeLoader}
                resetForm={resetForm}
                clearStates={clearStates}
              />
            ) : (
              <ForthStep
                deployValues={deployValues}
                setDeployValues={setDeployValues}
                setStackOpen={setStackOpen}
                stackOpen={stackOpen}
                handleSubmitApi={handleSubmitApi}
                theme={theme}
                emailCode={emailCode}
                resetForm={resetForm}
                clearStates={clearStates}
              />
            )}

            {/* </form> */}
          </Box>
        )}
      </CustomDialog>
    </>
  );
};

export default DeployStack;
