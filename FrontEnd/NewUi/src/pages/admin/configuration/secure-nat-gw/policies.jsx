import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
// ** MUI Imports
import Grid from "@mui/material/Grid";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
// ** Styled Component Import
import ApexChartWrapper from "src/theme/styles/libs/react-apexcharts";
import BreadcrumbHeading from "src/components/BreadcrumbHeading";
// ** Demo Components Imports
import { deploymentsDefault } from "utils/apis/routes/monitorLogs";
import { useTheme } from "@mui/material/styles";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";
import SecurityPoliciesTable from "src/components/Tables/SecurityPoliciesTable";
import ControlPointOutlinedIcon from "@mui/icons-material/ControlPointOutlined";
import Button from "@mui/material/Button";
import { securityProfile } from "utils/apis/routes/security";

const Policies = () => {
  const theme = useTheme();
  const [sources, setSources] = useState([]);
  const [subnets, setSubnets] = useState([]);
  const [services, setServices] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [address, setAddress] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [oldPolicies, setOldPolicies] = useState([]);
  const [activity, setActivity] = useState([]);
  const [selectActivity, setSelectActivity] = useState({});
  const [loaderShow, setLoaderShow] = useState(false);
  const [loaderAdd, setLoaderAdd] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [validateRow, setValidateRow] = useState([]);
  const [openToggle, setOpenToggle] = useState([]);
  const [editAbleData, setEditAbleData] = useState(null);

  const router = useRouter();
  const currentPageUrl = router.pathname;
  const userId = getCookie("userId");

  const handleChange = async (event) => {
    setSelectActivity(event.target.value);
    handleSourceServiceDestinationData(event.target.value);
    getPoliciesDatas(event.target.value);
    setLoaderShow(true);
    setPolicies([]);
    setIsEditMode(false);
    setEditAbleData(null);
    setValidateRow([]);
    setOpenToggle([]);
  };

  const handleAddPolicy = () => {
    const policyData = {
      policyid: null,
      srcaddr: [{ name: "all" }],
      dstaddr: [{ name: "all" }],
      service: [{ name: "ALL" }],
      "internet-service": "disable",
      "internet-service-name": [],
      "webfilter-profile": "",
      action: "deny",
      comments: "",
      status: "enable",
      logtraffic: "all",
    };
    setPolicies((prev) => [...prev, policyData]);
    setIsEditMode(false);
    setValidateRow([]);
    // handleValidate(
    //   policy.policyid,
    //   index,
    //   "11"
    // );
  };

  const handleSourceServiceDestinationData = async (deploymentData) => {
    try {
      const requestData = {
        userId: userId,
        deploymentId: deploymentData.id,
        connectorId: deploymentData.StackConnector[0].connectorId,
        secretManagerRegion: deploymentData.user.secretManagerRegion,
        eventType: "get-selection",
        type: "policies",
      };
      const data = await securityProfile(requestData);
      if (data.data.data) {
        setDestinations(data.data.data["internet-service"]);
        setServices(data.data.data.services);
        setSources(data.data.data.source);
        const allSubnets = [];
        const sourcesBase = data?.data?.data?.source || [];
        sourcesBase.map((item) => {
          item.subnets.map((sub) => {
            allSubnets.push(sub);
          });
        });
        setSubnets(allSubnets);
        setAddress([{ name: "all" }]);
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.error || err?.message || "something went wrong"
      );
      return;
    }
  };

  const handleDeployments = async () => {
    try {
      const data = await deploymentsDefault();
      if (data.data) {
        setActivity(data.data);
        setSelectActivity(data.data[0]);
        handleSourceServiceDestinationData(data.data[0]);
        getPoliciesDatas(data.data[0]);
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.error || err?.message || "something went wrong"
      );
      return;
    }
  };

  const modifyPolicyDatas = (policies) => {
    const modifyData = policies.map((item) => {
      return {
        ...item,
        srcaddr: item.srcaddr.map((dst) => {
          if (dst?.name?.includes("vpc")) {
            const findSourceData = sources.find(
              (src) => src?.vpc_id == dst?.name
            );
            if (findSourceData) {
              return findSourceData;
            } else {
              return dst;
            }
          } else {
            const findSourceData = subnets.find(
              (src) => src?.s_id == dst?.name
            );
            if (findSourceData) {
              return findSourceData;
            } else {
              return dst;
            }
          }
        }),
      };
    });
    return modifyData;
  };

  const getPoliciesDatas = async (deploymentData) => {
    try {
      setLoaderShow(true);
      const requestData = {
        userId: userId,
        deploymentId: deploymentData.id,
        connectorId: deploymentData.StackConnector[0].connectorId,
        secretManagerRegion: deploymentData.user.secretManagerRegion,
        eventType: "get",
        type: "policies",
        securityType: "secure_nat_gw",
      };
      const data = await securityProfile(requestData);
      if (data?.data?.data?.policies?.length) {
        const finalPolicyData = modifyPolicyDatas(data.data.data.policies);
        setPolicies(finalPolicyData);
        setOldPolicies(finalPolicyData);
        setLoaderShow(false);
      } else {
        setPolicies([]);
        setOldPolicies([]);
        setLoaderShow(false);
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.error || err?.message || "something went wrong"
      );
      return;
    }
  };

  const createPoliciesDatas = async () => {
    try {
      setLoaderAdd(true);
      const requestData = {
        userId: userId,
        deploymentId: selectActivity.id,
        connectorId: selectActivity.StackConnector[0].connectorId,
        secretManagerRegion: selectActivity.user.secretManagerRegion,
        eventType: "post",
        type: "policies",
        securityType: "secure_nat_gw",
        data: policies.filter((item) => item.policyid === null),
      };
      const data = await securityProfile(requestData);
      if (data?.data?.data?.policies.length) {
        const finalPolicyData = modifyPolicyDatas(data.data.data.policies);
        setPolicies(finalPolicyData);
        setOldPolicies(finalPolicyData);
        setOpenToggle([]);
        setLoaderAdd(false);
        toast.success(data.data.message);
        return data.data.data.policies;
      } else {
        toast.error(data.data.message || "something went wrong");
        setLoaderAdd(false);
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.error || err?.message || "something went wrong"
      );
      return;
    }
  };

  useEffect(() => {
    handleDeployments();
  }, []);

  useEffect(() => {
    if (subnets && sources) {
      const finalPolicyData = modifyPolicyDatas(policies);
      setPolicies(finalPolicyData);
      setOldPolicies(finalPolicyData);
    }
  }, [subnets, sources]);

  return (
    <ApexChartWrapper>
      <Grid container spacing={5}>
        <Grid
          item
          xs={12}
          sx={{
            paddingTop: "0px !important",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0px",
              gap: "10px 0",
              paddingTop: "7px",
              flexWrap: "wrap",
            }}
          >
            <BreadcrumbHeading url={currentPageUrl} />
            <Box className="subheader_bar">
              <Button
                size="small"
                variant="contained"
                sx={{
                  minWidth: "84px",
                  marginRight: "10px",
                }}
                startIcon={<ControlPointOutlinedIcon />}
                onClick={handleAddPolicy}
              >
                Add Policy
              </Button>
              <FormControl
                size="small"
                sx={{
                  minWidth: "206px",

                  "& .MuiInputBase-formControl": {
                    backgroundColor: theme.palette.background.paper,
                    fontSize: "14px",
                  },
                  "& .MuiSelect-select": {
                    padding: "6.5px 14px",
                  },
                }}
              >
                <Select value={selectActivity} onChange={handleChange}>
                  {activity?.map((active, index) => {
                    return (
                      <MenuItem key={index} value={active}>
                        {active.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            paddingTop: "10px !important",
          }}
        >
          <SecurityPoliciesTable
            policies={policies}
            setPolicies={setPolicies}
            oldPolicies={oldPolicies}
            setOldPolicies={setOldPolicies}
            services={services}
            destinations={destinations}
            sources={sources}
            createPoliciesDatas={createPoliciesDatas}
            loaderShow={loaderShow}
            loaderAdd={loaderAdd}
            setLoaderAdd={setLoaderAdd}
            selectActivity={selectActivity}
            address={address}
            setIsEditMode={setIsEditMode}
            isEditMode={isEditMode}
            validateRow={validateRow}
            setValidateRow={setValidateRow}
            subnets={subnets}
            modifyPolicyDatas={modifyPolicyDatas}
            openToggle={openToggle}
            setOpenToggle={setOpenToggle}
            editAbleData={editAbleData}
            setEditAbleData={setEditAbleData}
          ></SecurityPoliciesTable>
        </Grid>
      </Grid>
    </ApexChartWrapper>
  );
};

export default Policies;
