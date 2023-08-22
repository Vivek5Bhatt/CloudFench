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
import { securityProfile } from "utils/apis/routes/security";
import { useTheme } from "@mui/material/styles";
import { toast } from "react-toastify";
import SecurityTable from "src/components/Tables/SecurityTable";
import { useRouter } from "next/router";
import { getCookie } from "cookies-next";

const WebSecurity = () => {
  const theme = useTheme();
  const [activity, setActivity] = useState([]);
  const [security, setSecurity] = useState([]);
  const [selectActivity, setSelectActivity] = useState({});
  const [loaderShow, setLoaderShow] = useState(true);

  const router = useRouter();
  const currentPageUrl = router.pathname;
  const userId = getCookie("userId");

  const handleChange = async (event) => {
    setSelectActivity(event.target.value);
    setSecurity([]);
    setLoaderShow(true);
    handleSecurityData(event.target.value);
  };

  const handleSecurityData = async (deploymentData) => {
    try {
      setLoaderShow(true);
      const requestData = {
        userId: userId,
        deploymentId: deploymentData.id,
        connectorId: deploymentData.StackConnector[0].connectorId,
        secretManagerRegion: deploymentData.user.secretManagerRegion,
        securityType: "secure_nat_gw",
        profileType: "web",
        eventType: "get",
      };
      const data = await securityProfile(requestData);
      if (data.data.data) {
        setSecurity(data.data.data.groups);
        setLoaderShow(false);
      } else {
        setLoaderShow(false);
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
        setSelectActivity(data.data[0]);
        handleSecurityData(data.data[0]);
        setActivity(data.data);
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
        </Grid>
        <Grid
          item
          xs={12}
          sx={{
            paddingTop: "10px !important",
          }}
        >
          <SecurityTable
            security={security}
            setSecurity={setSecurity}
            loaderShow={loaderShow}
            setLoaderShow={setLoaderShow}
            selectActivity={selectActivity}
          />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  );
};

export default WebSecurity;
