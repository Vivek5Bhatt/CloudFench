import Grid from "@mui/material/Grid";
import ApexChartWrapper from "src/theme/styles/libs/react-apexcharts";
import Trophy from "src/components/Dashboard/Trophy";
import { useEffect, useState } from "react";
import { Card, IconButton } from "@mui/material";
import CustomBubble from "src/components/Dashboard/CustomBubble";
import DestinationTable from "src/components/Dashboard/DestinationTable";
import { toast } from "react-toastify";
import { deploymentsDefault } from "utils/apis/routes/monitorLogs";
import { FormControl } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useTheme } from "@emotion/react";
import { getDestinations } from "utils/apis/routes/dashboard";
import ThrotsBySource from "src/components/Dashboard/ThrotsBySource";
import CustomLoader from "src/components/Loader/CustomLoader";
import SubnetGraph from "src/components/Dashboard/SubnetGraph";
import SubnetTreeGraph from "src/components/Dashboard/SubnetTreeGraph";
import RefreshIcon from "@mui/icons-material/Refresh";
import AnyChart from "src/components/Dashboard/AnyChart";

const Dashboard = () => {
  const [trophyResize, setTrophyResize] = useState(6);
  const [bubbleSize, setBubbleSize] = useState(6);
  const [desTable, setDesTable] = useState(6);
  const [srcSize, setSrcSize] = useState(6);
  const [subSize, setSubSize] = useState(12);

  const [activity, setActivity] = useState([]);
  const [selectActivity, setSelectActivity] = useState({});
  const theme = useTheme();
  const [destinationList, setDestionationList] = useState([]);
  const [tableLoader, setTableLoader] = useState(true);
  const [applicationList, setApplicationList] = useState([]);
  const [topThreatList, setTopThreatList] = useState([]);
  const [threatSource, setThreatSource] = useState([]);
  const [appLoader, setAppLoader] = useState(true);
  const [bubbleLoader, setBubbleLoader] = useState(true);
  const [srcLoader, setSrcLoader] = useState(true);
  const [subnetLoader, setSubnetLoader] = useState(true);
  const [networkList, setNetworkList] = useState([]);
  const [daysData, setDaysData] = useState({
    app: "day",
    thre: "day",
    des: "day",
    sorce: "day",
    subnet: "day",
  });

  const getDeplouments = async () => {
    try {
      const data = await deploymentsDefault();
      if (data?.data) {
        setActivity(data.data);
        setSelectActivity(data?.data[0]);
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.error || err?.message || "something went wrong"
      );
      return;
    }
  };

  const { userId, id, StackConnector, user, region, cloud } =
    selectActivity || {};

  const getAllDestinations = async (graphType, time) => {
    let apiData = {
      userId: userId,
      deploymentId: id,
      connectorId: StackConnector && StackConnector[0]?.connectorId,
      secretManagerRegion: user?.secretManagerRegion,
      deploymentRegion: region,
      page: 1,
      limit: 100,
      time: time,
      type: "dashboard",
      graphType: graphType,
      accountId:
        StackConnector &&
        StackConnector[0] &&
        StackConnector[0]?.connector?.accountId,
      cloud: cloud,
    };

    let uniqueId = [
      ...new Set(StackConnector.map((item) => item.connector.accountId)),
    ];

    if (graphType === "network") {
      apiData.accountId = uniqueId;
    }
    try {
      const res = await getDestinations(apiData);

      if (res.data.statusCode === 200) {
        if (graphType === "topApplicaton") {
          setApplicationList(res?.data?.data);
          setAppLoader(false);
        } else if (graphType === "topDestination") {
          setDestionationList(res?.data?.data);
        } else if (graphType === "topThreatBySource") {
          setThreatSource(res?.data.data);
          setSrcLoader(false);
        } else if (graphType === "topThreat") {
          setTopThreatList(res?.data?.data);
          setBubbleLoader(false);
        } else if (graphType === "network") {
          setNetworkList(res?.data?.data);
          setSubnetLoader(false);
        }
        setTableLoader(false);
      } else if (res.data.statusCode === 500) {
        setBubbleLoader(false);
        setSrcLoader(false);
        setAppLoader(false);
        setTableLoader(false);
        setSubnetLoader(false);
      }
    } catch (err) {
      setBubbleLoader(false);
      setSrcLoader(false);
      setAppLoader(false);
      setTableLoader(false);
      setSubnetLoader(false);
      toast.error(
        err?.response?.data?.error || err?.message || "something went wrong"
      );
      return;
    }
  };
  useEffect(() => {
    if (Object.keys(selectActivity).length) {
      getAllDestinations("topApplicaton", daysData.app);
      getAllDestinations("topDestination", daysData.des);
      getAllDestinations("topThreat", daysData.thre);
      getAllDestinations("topThreatBySource", daysData.sorce);
      getAllDestinations("network", daysData.subnet);
      setTableLoader(true);
    }
  }, [selectActivity, activity]);

  useEffect(() => {
    getDeplouments();
  }, []);

  const handleChange = (event) => {
    setSelectActivity(event.target.value);
    setBubbleLoader(true);
    setSrcLoader(true);
    setAppLoader(true);
    setTableLoader(true);
    setSubnetLoader(true);
    setApplicationList([]);
    setDestionationList([]);
    setThreatSource([]);
    setTopThreatList([]);
    setNetworkList([]);
  };

  return (
    <>
      <ApexChartWrapper>
        <Grid container spacing={5}>
          <Grid
            item
            xs={12}
            md={12}
            sx={{
              paddingTop: "7px !important",
            }}
          >
            <FormControl
              size="small"
              sx={{
                minWidth: "206px",
                marginLeft: "auto",
                display: "flex",
                alignItems: "flex-end",
                flexDirection: "row",
                justifyContent: "end",
                "& .MuiInputBase-formControl": {
                  backgroundColor: theme.palette.background.paper,
                  fontSize: "14px",
                },
                "& .MuiSelect-select": {
                  padding: "6.5px 14px",
                },
              }}
            >
              <IconButton
                onClick={() => {
                  setAppLoader(true);
                  getAllDestinations("topApplicaton", daysData.app);
                  setBubbleLoader(true);
                  getAllDestinations("topThreat", daysData.thre);
                  setTableLoader(true);
                  getAllDestinations("topDestination", daysData.des);
                  setSrcLoader(true);
                  getAllDestinations("topThreatBySource", daysData.sorce);
                  setSubnetLoader(true);
                  getAllDestinations("network", daysData.subnet);
                }}
                sx={{ mr: "20px" }}
              >
                <RefreshIcon />
              </IconButton>
              <Select
                id="select-deployment"
                value={selectActivity}
                onChange={handleChange}
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
          </Grid>
          <Grid
            item
            xs={trophyResize}
            md={trophyResize}
            sx={{
              paddingTop: "10px !important",
            }}
          >
            <Card sx={{ minHeight: "100%" }}>
              {appLoader ? (
                <CustomLoader />
              ) : (
                <Trophy
                  tableLoader={tableLoader}
                  value={trophyResize}
                  onChange={setTrophyResize}
                  applicationList={applicationList}
                  daysData={daysData}
                  setDaysData={(val) => {
                    setAppLoader(true);
                    setDaysData({ ...daysData, app: val });
                    getAllDestinations("topApplicaton", val);
                  }}
                  refreshClick={() => {
                    setAppLoader(true);
                    getAllDestinations("topApplicaton", daysData.app);
                  }}
                />
              )}
            </Card>
          </Grid>
          <Grid
            item
            xs={bubbleSize}
            md={bubbleSize}
            sx={{
              paddingTop: "10px !important",
            }}
          >
            <Card sx={{ p: "10px", minHeight: "100%" }}>
              {bubbleLoader ? (
                <CustomLoader />
              ) : (
                <CustomBubble
                  value={bubbleSize}
                  onChange={setBubbleSize}
                  topThreatList={topThreatList}
                  daysData={daysData}
                  setDaysData={(val) => {
                    setDaysData({ ...daysData, thre: val });
                    setBubbleLoader(true);
                    getAllDestinations("topThreat", val);
                  }}
                  refreshClick={() => {
                    setBubbleLoader(true);
                    getAllDestinations("topThreat", daysData.thre);
                  }}
                />
              )}
            </Card>
          </Grid>

          <Grid
            item
            xs={desTable}
            md={desTable}
            sx={{
              paddingTop: "10px !important",
            }}
          >
            <Card sx={{ p: "10px", minHeight: "100%" }}>
              {tableLoader ? (
                <CustomLoader />
              ) : (
                <DestinationTable
                  value={desTable}
                  onChange={setDesTable}
                  destinationList={destinationList}
                  tableLoader={tableLoader}
                  daysData={daysData}
                  setDaysData={(val) => {
                    setTableLoader(true);
                    setDaysData({ ...daysData, des: val });
                    getAllDestinations("topDestination", val);
                  }}
                  refreshClick={() => {
                    setTableLoader(true);
                    getAllDestinations("topDestination", daysData.des);
                  }}
                />
              )}
            </Card>
          </Grid>
          <Grid
            item
            xs={srcSize}
            md={srcSize}
            sx={{
              paddingTop: "10px !important",
            }}
          >
            <Card sx={{ p: "10px", minHeight: "100%" }}>
              {srcLoader ? (
                <CustomLoader />
              ) : (
                <ThrotsBySource
                  value={srcSize}
                  onChange={setSrcSize}
                  threatSource={threatSource}
                  daysData={daysData}
                  srcLoader={srcLoader}
                  setDaysData={(val) => {
                    setDaysData({ ...daysData, sorce: val });
                    setSrcLoader(true);
                    getAllDestinations("topThreatBySource", val);
                  }}
                  refreshClick={() => {
                    setSrcLoader(true);
                    getAllDestinations("topThreatBySource", daysData.sorce);
                  }}
                />
              )}
            </Card>
          </Grid>

          <Grid
            item
            xs={subSize}
            md={subSize}
            sx={{
              paddingTop: "10px !important",
            }}
          >
            <Card sx={{ p: "10px", minHeight: "550px" }}>
              {subnetLoader ? (
                <CustomLoader />
              ) : (
                // <AnyChart
                //   value={subSize}
                //   onChange={setSubSize}
                //   daysData={daysData}
                //   setDaysData={(val) => {
                //     setSubnetLoader(true);
                //     setDaysData({ ...daysData, subnet: val });
                //     getAllDestinations("network", val);
                //   }}
                //   refreshClick={() => {
                //     setSubnetLoader(true);
                //     getAllDestinations("network", daysData.subnet);
                //   }}
                //   netList={networkList}
                // />
                <SubnetGraph
                  value={subSize}
                  onChange={setSubSize}
                  daysData={daysData}
                  setDaysData={(val) => {
                    setSubnetLoader(true);
                    setDaysData({ ...daysData, subnet: val });
                    getAllDestinations("network", val);
                  }}
                  refreshClick={() => {
                    setSubnetLoader(true);
                    getAllDestinations("network", daysData.subnet);
                  }}
                  networkList={networkList}
                />
              )}
            </Card>
          </Grid>
        </Grid>
      </ApexChartWrapper>
    </>
  );
};

export default Dashboard;
