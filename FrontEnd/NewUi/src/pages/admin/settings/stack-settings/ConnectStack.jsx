import {
  Button,
  FormControl,
  MenuItem,
  Select,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Box, useTheme } from "@mui/system";
import { useState, useEffect } from "react";
import CustomDialog from "src/components/Dialog";
import { deploymentsDefault } from "utils/apis/routes/monitorLogs";
import InfoIcon from "@mui/icons-material/Info";
import {
  addStackConnector,
  cloudConnector,
  getStackSources,
} from "utils/apis/routes/settings";

import { useCaseServiceName } from "utils/commonFunctions";
import StackVpcCards from "./StackVpcCards";
import CustomLoader from "src/components/Loader/CustomLoader";
import { toast } from "react-toastify";

const BackNexBtn = ({
  nextStep,
  backStep,
  closeBtn,
  isBack,
  nextDisabled,
  nextBtnText,
  clearVal,
}) => {
  return (
    <Box
      sx={{
        mt: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Button
        size="small"
        variant="contained"
        sx={{
          minWidth: "84px",
          marginRight: "10px",
        }}
        onClick={() => {
          closeBtn();
          clearVal();
        }}
      >
        Close
      </Button>
      {isBack && (
        <Button
          size="small"
          variant="contained"
          sx={{
            minWidth: "84px",
            marginRight: "10px",
          }}
          onClick={() => {
            backStep();
          }}
        >
          {" "}
          Back
        </Button>
      )}
      <Button
        size="small"
        variant="contained"
        sx={{
          minWidth: "84px",
          marginRight: "10px",
        }}
        onClick={() => nextStep()}
        disabled={nextDisabled}
      >
        {nextBtnText ? nextBtnText : "Next"}
      </Button>
    </Box>
  );
};

const FirstStep = ({
  selectValue,
  setSelectValue,
  selectDeployment,
  setSteps,
  onClose,
  steps,
  filtered,
  clearVal,
}) => {
  return (
    <>
      <Typography sx={{ fontSize: "13px", fontWeight: 600, color: "#a19595" }}>
        Select the security stack
      </Typography>
      <Typography sx={{ fontSize: "10px", color: "#a19595", mb: "10px" }}>
        Your environment will be protected behind this security stack
      </Typography>
      <FormControl fullWidth>
        <Select
          id="select-cloud"
          sx={{ height: "45px" }}
          name="cloud"
          required
          onChange={(e) =>
            setSelectValue({
              ...selectValue,
              securityStack: e.target.value,
            })
          }
          value={selectValue.securityStack}
        >
          {(selectDeployment || []).map((active, index) => {
            return (
              <MenuItem key={index} value={active}>
                {active?.name}
              </MenuItem>
            );
          })}
        </Select>
        {Object.keys(selectValue.securityStack).length ? (
          <Box sx={{ mt: "10px", py: "10px" }}>
            <Box sx={{ display: "flex", pb: "8px" }}>
              <Typography
                sx={{ width: "100px", fontSize: "13px", fontWeight: "600" }}
              >
                {" "}
                Region:{" "}
              </Typography>
              <Typography
                sx={{
                  fontSize: "13px",

                  color: "#a19595",
                  fontWeight: "400",
                }}
              >
                {selectValue.securityStack.region}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", pb: "8px" }}>
              <Typography
                sx={{ width: "100px", fontSize: "13px", fontWeight: "600" }}
              >
                {" "}
                UseCase:{" "}
              </Typography>
              {filtered.map((filter, key) => {
                return (
                  <Typography
                    key={key}
                    sx={{
                      color: "#a19595",
                      fontSize: "13px",
                      fontWeight: "400",
                    }}
                  >
                    {useCaseServiceName[filter]}
                  </Typography>
                );
              })}
            </Box>
          </Box>
        ) : (
          ""
        )}
      </FormControl>

      <BackNexBtn
        closeBtn={onClose}
        isBack={false}
        nextStep={() => {
          setSteps({ ...steps, first: false, second: true });
        }}
        nextDisabled={Object.keys(selectValue?.securityStack).length === 0}
        clearVal={clearVal}
      />
    </>
  );
};

const ConnectStack = (props) => {
  const { open, onClose, connectorsList, getDeplouments } = props || {};
  const theme = useTheme();
  const [selectDeployment, setSelectDeployment] = useState([]);
  const [vpcList, setVpcList] = useState([]);
  const [vpcLoader, setVpcLoader] = useState(false);
  const [addSubnet, setAddSubnet] = useState([]);
  const [addVpc, setAddVpc] = useState({});
  const [searchVal, setSearchVal] = useState("");

  const [selectValue, setSelectValue] = useState({
    securityStack: {},
    cloudConnector: {},
    selectedSubnet: [],
    selectedVpc: "",
  });
  const [steps, setSteps] = useState({
    first: true,
    second: false,
    third: false,
  });

  const defaultDeploy = async () => {
    const data = await deploymentsDefault("stackConnector");
    if (data) {
      setSelectDeployment(data?.data);
    }
  };

  const getVpcList = async () => {
    const requestData = {
      connectorId: selectValue?.cloudConnector.id,
      region: selectValue?.securityStack.region,
      deploymentId: selectValue?.securityStack.id,
    };
    const data = await getStackSources(requestData);

    if (data) {
      setVpcList(data?.data?.Vpcs);
      setVpcLoader(false);
    }
  };
  useEffect(() => {
    defaultDeploy();
  }, []);

  const filtered = Object.keys(
    selectValue?.securityStack?.services || {}
  ).filter((key) => {
    return selectValue.securityStack.services[key];
  });

  const { cloudConnector, securityStack, selectedVpc, selectedSubnet } =
    selectValue || {};

  const handleConnect = async () => {
    if (selectedSubnet.length) {
      if (
        selectedSubnet[0]?.AvailabilityZone ===
        selectedSubnet[1]?.AvailabilityZone
      ) {
        toast.error("Subnets has to be in different availability zones.");
        return;
      }
    }
    setVpcLoader(true);
    let apiData = {
      vpc: selectedVpc,
      subnets: selectedSubnet, //selectedSubnet.map((sbnt) => sbnt.SubnetId),
      region: securityStack.region,
      connectorId: cloudConnector.id,
      deploymentId: securityStack.id,
    };
    const res = await addStackConnector(apiData);

    if (res?.data) {
      getDeplouments();
      setVpcLoader(false);
      onClose();
      setSelectValue({
        ...selectValue,
        securityStack: {},
        cloudConnector: {},
        selectedSubnet: [],
        selectedVpc: "",
      });
    }
  };

  const clearVal = () => {
    setSelectValue({
      ...selectValue,
      securityStack: {},
      cloudConnector: {},
      selectedSubnet: [],
      selectedVpc: "",
    });
  };
  return (
    <CustomDialog
      open={open}
      onClose={onClose}
      className={steps.third && "xl_modal"}
    >
      <Typography
        sx={{
          fontWeight: "700",
          color: theme.palette.text.primary,
          mb: "10px",
        }}
      >
        Connect your environment to the Security stack
      </Typography>
      {steps.third && (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography sx={{ fontSize: "10px", color: "#a19595", mr: "10px" }}>
              We recommend to select subnets in different availability zones
            </Typography>
            <InfoIcon sx={{ color: "#b5b5b5" }} />
          </Box>
          <TextField
            value={searchVal}
            onChange={(e) => {
              setSearchVal(e.target.value);
            }}
            placeholder="Search..."
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "6px",
              },
              "& .MuiInputBase-input": {
                padding: "11px",
              },
            }}
          />
        </Box>
      )}
      {steps.first ? (
        <>
          <FirstStep
            selectValue={selectValue}
            setSelectValue={setSelectValue}
            selectDeployment={selectDeployment}
            setSteps={setSteps}
            onClose={onClose}
            steps={steps}
            filtered={filtered}
            clearVal={clearVal}
          />
        </>
      ) : steps.second ? (
        <>
          <Typography
            sx={{ fontSize: "13px", fontWeight: 600, color: "#a19595" }}
          >
            Select the Cloud Connector
          </Typography>
          <Typography sx={{ fontSize: "10px", color: "#a19595", mb: "10px" }}>
            Get access to your cloud environment using the connector below
          </Typography>
          <FormControl fullWidth>
            <Select
              id="select-cloud"
              sx={{ height: "45px" }}
              name="cloud"
              required
              onChange={(e) =>
                setSelectValue({
                  ...selectValue,
                  cloudConnector: e.target.value,
                })
              }
              value={selectValue.cloudConnector}
            >
              {(connectorsList || []).map((active, index) => {
                return (
                  <MenuItem key={index} value={active}>
                    {active?.name}
                  </MenuItem>
                );
              })}
            </Select>
            {Object.keys(selectValue.cloudConnector).length ? (
              <Box sx={{ mt: "10px", py: "10px" }}>
                <Box sx={{ display: "flex", pb: "8px" }}>
                  <Typography
                    sx={{ width: "100px", fontSize: "13px", fontWeight: "600" }}
                  >
                    {" "}
                    Account ID:{" "}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "13px",

                      color: "#a19595",
                      fontWeight: "400",
                    }}
                  >
                    {selectValue.cloudConnector.accountId}
                  </Typography>
                </Box>
                {/* <Box sx={{ display: "flex", pb: "8px" }}>
                  <Typography
                    sx={{ width: "100px", fontSize: "13px", fontWeight: "600" }}
                  >
                    {" "}
                    Key:{" "}
                  </Typography>

                  <Typography
                    sx={{
                      color: "#a19595",
                      fontSize: "13px",
                      fontWeight: "400",
                    }}
                  >
                    {selectValue.cloudConnector.accessKey}
                  </Typography>
                </Box> */}
              </Box>
            ) : (
              ""
            )}
          </FormControl>
          <BackNexBtn
            isBack
            closeBtn={onClose}
            backStep={() => setSteps({ ...steps, first: true, second: false })}
            nextStep={() => {
              setSteps({
                ...steps,
                first: false,
                second: false,
                third: true,
              });
              setVpcLoader(true);
              getVpcList();
            }}
            nextDisabled={Object.keys(selectValue?.cloudConnector).length === 0}
            clearVal={clearVal}
          />
        </>
      ) : (
        <>
          {vpcLoader ? (
            <CustomLoader minHeight="45vh" />
          ) : (
            <Box>
              <StackVpcCards
                selectValue={selectValue}
                setSelectValue={setSelectValue}
                selectDeployment={selectDeployment}
                setSteps={setSteps}
                onClose={onClose}
                steps={steps}
                filtered={filtered}
                vpcList={vpcList}
                setVpcLoader={setVpcLoader}
                addSubnet={addSubnet}
                setAddSubnet={setAddSubnet}
                addVpc={addVpc}
                setAddVpc={setAddVpc}
                searchVal={searchVal}
              />
              <BackNexBtn
                closeBtn={onClose}
                isBack={true}
                nextStep={() => {
                  handleConnect();
                }}
                backStep={() => {
                  setSteps({
                    ...steps,
                    first: false,
                    second: true,
                    third: false,
                  });
                }}
                nextBtnText="Connect"
                nextDisabled={
                  Object.keys(selectValue.selectedVpc).length === 0 ||
                  selectValue.selectedSubnet.length === 0
                    ? true
                    : false
                }
                clearVal={clearVal}
              />
            </Box>
          )}
        </>
      )}
    </CustomDialog>
  );
};

export default ConnectStack;
