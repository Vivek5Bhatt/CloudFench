// ** React
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
// ** MUI Imports
import Grid from "@mui/material/Grid";
// ** Styled Component Import
import ApexChartWrapper from "src/theme/styles/libs/react-apexcharts";
import BreadcrumbHeading from "src/components/BreadcrumbHeading";
import Card from "@mui/material/Card";
// ** Demo Components Imports
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { trafficActivityLogs } from "utils/apis/routes/monitorLogs";
import TableDrawer from "src/components/Tables/Drawer";
// import { toast } from "react-toastify";
import CachedIcon from "@mui/icons-material/Cached";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
const TrafficActivity = () => {
  const [activity, setActivity] = useState([]);
  const [selectActivity, setSelectActivity] = useState({});
  const [trafficActivities, setTrafficActivities] = useState([]);
  const [loaderShow, setLoaderShow] = useState(true);
  const [checkLogs, setCheckLogs] = useState(false);
  const [limit, setLimit] = useState(100);
  const [page, setPage] = useState(0);
  const [total, setTotal] = useState(0);

  const theme = useTheme();
  const router = useRouter();
  const currentPageUrl = router.pathname;

  const handleChange = async (event) => {
    setSelectActivity(event.target.value);
    setTrafficActivities([]);
    // setLimit(0);
    setPage(0);
    setTotal(0);
  };

  const handleLogsData = async () => {
    try {
      setTrafficActivities([]);
      if (!selectActivity) {
        return;
      }
      setLoaderShow(true);
      const offSet = page * limit;
      const data = {
        deploymentId: selectActivity?.id,
        limit: limit,
        offset: offSet,
      };
      const activityLogs = await trafficActivityLogs(data);
      if (activityLogs) {
        setLoaderShow(false);
        setTrafficActivities(activityLogs?.data?.payload?.data);
        setTotal(activityLogs?.data?.payload?.total || 0);
      }
    } catch (error) {
      // toast.error(
      //   error?.response?.data?.error ||
      //     error?.message ||
      //     "something went wrong"
      // );
      setLoaderShow(false);
      return;
    }
  };

  useEffect(() => {
    if (Object.keys(selectActivity).length) {
      handleLogsData();
    }
  }, [selectActivity, page, limit]);

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
                <Select
                  value={selectActivity}
                  onChange={handleChange}
                  id="select-deployment"
                >
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
          <Card sx={{ position: "relative" }}>
            <IconButton
              aria-haspopup="true"
              onClick={handleLogsData}
              sx={{
                padding: "6px",
                color: theme.palette.action.active,
                position: "absolute",
                top: "9px",
                right: "48px",
                zIndex: "9",
              }}
              id="reload"
            >
              <CachedIcon />
            </IconButton>
            <TableDrawer
              trafficActivities={trafficActivities}
              selectActivity={selectActivity}
              setCheckLogs={setCheckLogs}
              setSelectActivity={setSelectActivity}
              setActivity={setActivity}
              loaderShow={loaderShow}
              setLimit={setLimit}
              limit={limit}
              total={total}
              setPage={setPage}
              page={page}
              className="table_materialbx"
            />
          </Card>
        </Grid>
      </Grid>
    </ApexChartWrapper>
  );
};

export default TrafficActivity;
