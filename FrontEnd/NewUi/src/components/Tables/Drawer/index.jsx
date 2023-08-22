import { useState, useEffect, useMemo } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import CloseIcon from "@mui/icons-material/Close";
import WebAssetIcon from "@mui/icons-material/WebAsset";
import moment from "moment";
import MaterialTable from "src/components/Tables/MaterialTable";
import AwsIcon from "public/images/awsimg/aws.svg";
import Image from "next/image";
import CheckIcon from "@mui/icons-material/Check";
import Popover from "@mui/material/Popover";
import { shortContent, firstLetterCapital } from "utils/commonFunctions";
import AWSEC2 from "public/images/awsimg/aws-ec2.svg";
import AWSLambda from "public/images/awsimg/aws-lambda-1.svg";
import AWSRds from "public/images/awsimg/aws-rds.svg";
import AWSLB from "public/images/awsimg/load-balancer-icon-3.png";
import AWStransitGW from "public/images/awsimg/20_vpc-customer-gateway.500b29e8da.png";
import AWSElasticache from "public/images/awsimg/aws-Elasti-cache.svg";
import AWSLoadBalancer from "public/images/awsimg/aws-load-balancer.svg";
// ** Countries json
import Countries from "utils/countries.json";

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open, rightsectionanchor }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      width: rightsectionanchor == "right" ? `calc(100% - 370px)` : "100%",
      height: rightsectionanchor == "right" ? "100%" : `calc(100% - 370px)`,
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginRight: 0,
    }),
  })
);

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-start",
}));

export default function TableDrawer({
  trafficActivities,
  setSelectActivity,
  selectActivity,
  setActivity,
  loaderShow,
  setLimit,
  limit,
  total,
  setPage,
  page,
}) {
  const [open, setOpen] = useState(false);
  const [openSourceHover, setOpenSourceHover] = useState(false);
  const [srcinfo, setSrcinfo] = useState(null);
  const [activitySelected, setActivitySelected] = useState({});
  const [tableData, setTableData] = useState([]);
  const [isEmptyData, setIsEmptyData] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [rightsectionanchor, setrightsectionanchor] = useState("right");

  const handleClose = () => {
    setOpenSourceHover(false);
    setAnchorEl(null);
  };

  const actionShow = (action) => {
    if (action === "deny") {
      return <CloseIcon color="error" />;
    } else if (
      action === "client-rst" ||
      action === "server-rst" ||
      action === "close" ||
      action === "accept" ||
      action === "timeout" ||
      action === "start"
    ) {
      return <CheckIcon color="success" />;
    }
  };

  const getAWSIconAndClass = (rowData, isSource = false, type = 1) => {
    try {
      if (rowData) {
        let data = "";
        if (isSource) {
          data =
            rowData?.srcinfo && rowData?.srcinfo?.Type
              ? rowData?.srcinfo?.Type
              : "";
        } else {
          data =
            rowData?.dstinfo && rowData?.dstinfo?.Type
              ? rowData?.dstinfo?.Type
              : "";
        }
        switch (data) {
          case "ec2":
            return type == 1 ? (
              <Box
                className="flag_icon"
                sx={{
                  display: "flex",
                  marginRight: "4px",
                }}
              >
                <Image src={AWSEC2} alt="aws ec2" width={18} />
              </Box>
            ) : (
              "ec2-box"
            );
          case "lambda":
            return type == 1 ? (
              <Box
                className="flag_icon"
                sx={{
                  display: "flex",
                  marginRight: "4px",
                }}
              >
                <Image src={AWSLambda} alt="aws lambda" width={18} />
              </Box>
            ) : (
              "lambda-box"
            );
          case "rds":
            return type == 1 ? (
              <Box
                className="flag_icon"
                sx={{
                  display: "flex",
                  marginRight: "4px",
                }}
              >
                <Image src={AWSRds} alt="aws rds" width={18} />
              </Box>
            ) : (
              "rds-box"
            );
          case "elasticache":
            AWSElasticache;
            return type == 1 ? (
              <Box
                className="flag_icon"
                sx={{
                  display: "flex",
                  marginRight: "4px",
                }}
              >
                <Image src={AWSElasticache} alt="aws elasticache" width={18} />
              </Box>
            ) : (
              "elasticache-box"
            );
          case "loadbalancer":
            return type == 1 ? (
              <Box
                className="flag_icon"
                sx={{
                  display: "flex",
                  marginRight: "4px",
                }}
              >
                <Image
                  src={AWSLoadBalancer}
                  alt="aws loadbalancer"
                  width={18}
                />
              </Box>
            ) : (
              "loadbalancer-box"
            );

          case "lb":
            return type == 1 ? (
              <Box
                className="flag_icon"
                sx={{
                  display: "flex",
                  marginRight: "4px",
                }}
              >
                <Image src={AWSLB} alt="aws lb" width={18} />
              </Box>
            ) : (
              "lb"
            );

          case "transitGW":
            return type == 1 ? (
              <Box
                className="flag_icon"
                sx={{
                  display: "flex",
                  marginRight: "4px",
                }}
              >
                <Image src={AWStransitGW} alt="aws transitGW" width={18} />
              </Box>
            ) : (
              "transitGW"
            );
          default:
            return "";
        }
      }
      return "";
    } catch (err) {
      return "";
    }
  };

  const flagShow = (countryName) => {
    const countryCode = Countries.find(
      (country) => country.name === countryName
    );
    return countryCode?.code ? (
      <Image
        src={`https://purecatamphetamine.github.io/country-flag-icons/3x2/${countryCode?.code}.svg`}
        alt="Country Flag"
        width={20}
        height={15}
      />
    ) : (
      ""
    );
  };

  const trafficTableColumns = useMemo(
    () => [
      {
        accessorKey: "date",
        header: "Date",
        size: 100,
        enableColumnFilter: false,
      },
      {
        accessorKey: "time",
        header: "Time",
        size: 100,
        enableColumnFilter: false,
      },
      {
        accessorKey: "selectActivity.name", //access nested data with dot notation
        header: "Deployment",
        size: 150,
        enableColumnFilter: false,
        Cell: ({ renderedCellValue }) => (
          <Box
            className="icon_td"
            sx={{
              display: "flex",
              alignItems: "center",
              lineHeight: "1",
            }}
          >
            <Box
              className="flag_icon"
              sx={{
                display: "flex",
                marginRight: "4px",
              }}
            >
              <Image src={AwsIcon} alt="aws icon" width={18} />
            </Box>
            <Box className="truncate">{renderedCellValue}</Box>
          </Box>
        ),
      },
      {
        accessorKey: "selectActivity.cloud",
        header: "Cloud",
        size: 100,
        enableColumnFilter: false,
        Cell: ({ renderedCellValue }) => (
          <Box className="truncate">{renderedCellValue}</Box>
        ),
      },
      {
        accessorKey: "selectActivity.region",
        header: "Region",
        size: 120,
        enableColumnFilter: false,
        Cell: ({ renderedCellValue }) => (
          <Box className="truncate">{renderedCellValue}</Box>
        ),
      },
      {
        accessorKey: "action",
        header: "Action",
        size: 100,
        enableColumnFilter: false,
        muiTableHeadCellProps: {
          align: "center",
        },
        Cell: ({ renderedCellValue }) => (
          <Box
            className={`icon_td`}
            sx={{
              display: "flex",
              alignItems: "center",
              lineHeight: "1.2",
              fontWeight: "500",
              fontSize: "13px",
              textTransform: "capitalize",
              color: theme.palette.primary.contrastText,
              "& .MuiSvgIcon-root": {
                width: "18px",
                height: "auto",
                margin: "0 auto",
              },
            }}
          >
            {actionShow(renderedCellValue)}
          </Box>
        ),
      },
      {
        accessorKey: "utmaction",
        header: "Threat Action",
        size: 150,
        enableColumnFilter: false,
      },
      {
        accessorKey: "threats",
        header: "Threat",
        size: 100,
        enableColumnFilter: false,
      },
      {
        accessorKey: "threattyps",
        header: "Threat Type",
        size: 150,
        enableColumnFilter: false,
      },
      {
        accessorKey: "crlevel",
        header: "Level",
        size: 100,
        enableColumnFilter: false,
      },
      {
        accessorKey: "policyname",
        header: "Policy Name",
        size: 150,
        enableColumnFilter: false,
      },
      {
        accessorKey: "sourceName",
        header: "Source",
        size: 150,
        enableColumnFilter: false,
        Cell: ({ renderedCellValue, row }) => (
          <Box
            className={`icon_td ${getAWSIconAndClass(row?.original, true, 2)}`}
            sx={{
              display: "flex",
              alignItems: "center",
              lineHeight: "1.5",
              fontWeight: "500",
              fontSize: "13px",
              textTransform: "capitalize",
              borderRadius: "30px",
              padding: "3px 7px",
              "& .MuiSvgIcon-root": {
                width: "16px",
                height: "auto",
                marginRight: "4px",
              },
            }}
          >
            {getAWSIconAndClass(row?.original, true)}
            <Box className="truncate">{renderedCellValue}</Box>
          </Box>
        ),
      },
      {
        accessorKey: "srcport",
        header: "Source port",
        size: 150,
        enableColumnFilter: false,
      },
      {
        accessorKey: "sCountry",
        header: "Source Country",
        size: 180,
        enableColumnFilter: false,
        Cell: ({ renderedCellValue }) => (
          <Box
            className="icon_td"
            sx={{
              display: "flex",
              alignItems: "center",
              lineHeight: "1",
            }}
          >
            <Box
              className="flag_icon"
              sx={{
                display: "flex",
                "& svg": {
                  marginRight: "4px",
                  width: "18px",
                },
                "& img": {
                  marginRight: "4px",
                  border: "1px solid #eee",
                },
              }}
            >
              {flagShow(renderedCellValue)}
            </Box>
            <Box className="truncate">{renderedCellValue}</Box>
          </Box>
        ),
      },
      {
        accessorKey: "srcinfo.VPCId",
        header: "Source VPC Id",
        size: 160,
        enableColumnFilter: false,
      },
      {
        accessorKey: "srcinfo.VPCName",
        header: "Source VPC Name",
        size: 180,
        enableColumnFilter: false,
      },
      {
        accessorKey: "srcinfo.SubnetId",
        header: "Source Subnet Id",
        size: 180,
        enableColumnFilter: false,
      },
      {
        accessorKey: "srcinfo.SubnetName",
        header: "Source Subnet Name",
        size: 200,
        enableColumnFilter: false,
      },
      {
        accessorKey: "srcinfo.Type",
        header: "Source Resource Type",
        size: 200,
        enableColumnFilter: false,
      },
      {
        accessorKey: "destinationName",
        header: "Destination",
        size: 180,
        enableColumnFilter: false,
        Cell: ({ renderedCellValue, row }) => (
          <Box
            className={`icon_td ${getAWSIconAndClass(row?.original, false, 2)}`}
            sx={{
              display: "flex",
              alignItems: "center",
              lineHeight: "1.5",
              fontWeight: "500",
              fontSize: "13px",
              textTransform: "capitalize",
              borderRadius: "30px",
              padding: "3px 7px",
              "& .MuiSvgIcon-root": {
                width: "16px",
                height: "auto",
                marginRight: "4px",
              },
            }}
          >
            {getAWSIconAndClass(row?.original, false, 1)}
            <Box className="truncate">{renderedCellValue}</Box>
          </Box>
        ),
      },
      {
        accessorKey: "dstport",
        header: "Destination port",
        size: 180,
        enableColumnFilter: false,
      },
      {
        accessorKey: "dstinetsvc",
        header: "Destination Service",
        size: 180,
        enableColumnFilter: false,
      },
      {
        accessorKey: "hostname",
        header: "Hostname",
        size: 140,
        enableColumnFilter: false,
      },
      {
        accessorKey: "dCountry",
        header: "Destination Country",
        size: 180,
        enableColumnFilter: false,
        Cell: ({ renderedCellValue }) => (
          <Box
            className="icon_td"
            sx={{
              display: "flex",
              alignItems: "center",
              lineHeight: "1",
            }}
          >
            <Box
              className="flag_icon"
              sx={{
                display: "flex",
                "& svg": {
                  marginRight: "4px",
                  width: "18px",
                },
                "& img": {
                  marginRight: "4px",
                  border: "1px solid #eee",
                },
              }}
            >
              {flagShow(renderedCellValue)}
            </Box>
            <Box className="truncate">{renderedCellValue}</Box>
          </Box>
        ),
      },
      {
        accessorKey: "dstregion",
        header: "Destination Region",
        size: 180,
        enableColumnFilter: false,
      },
      {
        accessorKey: "dstcity",
        header: "Destination City",
        size: 180,
        enableColumnFilter: false,
      },
      {
        accessorKey: "dstreputation",
        header: "Destination Reputation",
        size: 200,
        enableColumnFilter: false,
      },
      {
        accessorKey: "dstinfo.VPCId",
        header: "Destination VPC Id",
        size: 200,
        enableColumnFilter: false,
      },
      {
        accessorKey: "dstinfo.VPCName",
        header: "Destination VPC Name",
        size: 200,
        enableColumnFilter: false,
      },
      {
        accessorKey: "dstinfo.SubnetId",
        header: "Destination Subnet Id",
        size: 200,
        enableColumnFilter: false,
      },
      {
        accessorKey: "dstinfo.SubnetName",
        header: "Destination Subnet Name",
        size: 240,
        enableColumnFilter: false,
      },
      {
        accessorKey: "dstinfo.Type",
        header: "Destination Resource Type",
        size: 240,
        enableColumnFilter: false,
      },
      {
        accessorKey: "service",
        header: "Service",
        size: 120,
        enableColumnFilter: false,
      },
      {
        accessorKey: "app",
        header: "Application",
        size: 150,
        enableColumnFilter: false,
      },
      {
        accessorKey: "appcat",
        header: "Application Category",
        size: 200,
        enableColumnFilter: false,
        Cell: ({ renderedCellValue }) => (
          <Box className="truncate">{renderedCellValue}</Box>
        ),
      },
      {
        accessorKey: "proto",
        header: "Protocol",
        size: 120,
        enableColumnFilter: false,
      },
      {
        accessorKey: "duration",
        header: "Duration",
        size: 120,
        enableColumnFilter: false,
        Cell: ({ renderedCellValue }) => (
          <Box className="truncate">{renderedCellValue}</Box>
        ),
      },
      {
        accessorKey: "sentbyte",
        header: "Sent Bytes",
        size: 150,
        enableColumnFilter: false,
        Cell: ({ renderedCellValue }) => (
          <Box className="truncate">{renderedCellValue}</Box>
        ),
      },
      {
        accessorKey: "rcvdbyte",
        header: "Received Bytes",
        size: 180,
        enableColumnFilter: false,
        Cell: ({ renderedCellValue }) => (
          <Box className="truncate">{renderedCellValue}</Box>
        ),
      },
      {
        accessorKey: "sentpkt",
        header: "Sent Packets",
        size: 180,
        enableColumnFilter: false,
        Cell: ({ renderedCellValue }) => (
          <Box className="truncate">{renderedCellValue}</Box>
        ),
      },
      {
        accessorKey: "rcvdpkt",
        header: "Received Packets",
        size: 180,
        enableColumnFilter: false,
        Cell: ({ renderedCellValue }) => (
          <Box className="truncate">{renderedCellValue}</Box>
        ),
      },
    ],
    []
  );

  const theme = useTheme();

  const handleDrawerClose = () => {
    setrightsectionanchor("right");
    setOpen(false);
  };

  useEffect(() => {
    try {
      let selectActivityData = selectActivity
        ? selectActivity
        : { name: "", region: "" };
      const data = [];
      for (let i = 0; i < trafficActivities.length; i++) {
        data.push({
          ...trafficActivities[i],
          selectActivity: selectActivityData,
          date: moment(trafficActivities[i]?.date).format("DD/MM/YYYY"),
          sourceName:
            trafficActivities[i]?.srcinfo?.Name &&
            trafficActivities[i]?.srcinfo?.Name != ""
              ? shortContent(trafficActivities[i]?.srcinfo?.Name)
              : trafficActivities[i]?.srcinfo?.Description &&
                trafficActivities[i]?.srcinfo?.Description != ""
              ? shortContent(trafficActivities[i]?.srcinfo?.Description)
              : shortContent(trafficActivities[i]?.srcip),
          destinationName:
            trafficActivities[i]?.dstinfo?.Name &&
            trafficActivities[i]?.dstinfo?.Name != ""
              ? shortContent(trafficActivities[i]?.dstinfo?.Name)
              : trafficActivities[i]?.dstinfo?.Description &&
                trafficActivities[i]?.dstinfo?.Description != ""
              ? shortContent(trafficActivities[i]?.dstinfo?.Description)
              : shortContent(trafficActivities[i]?.dstip),
          sCountry: decodeURIComponent(trafficActivities[i].srccountry),
          dCountry: decodeURIComponent(trafficActivities[i].dstcountry),
        });
      }
      let isLogsEmpty =
        trafficActivities && trafficActivities.length === 0 ? true : false;
      setIsEmptyData(isLogsEmpty);
      setTableData(data);
    } catch (err) {}
  }, [trafficActivities, selectActivity]);

  return (
    <Box
      className={`${
        rightsectionanchor == "right" ? "right-drawer-box" : "bottom-drawer-box"
      }`}
      sx={{
        display: "block",
        flexWrap: "wrap",
        "& .listing_bx": {
          display: "flex",
          flexWrap: "wrap",
          width: "100%",
          margin: "0 -0.2rem",
        },
        "& .listing_bx .MuiTypography-body2": {
          flex: "0 0 50%",
          maxWidth: "50%",
          padding: "0 0.2rem",
        },
        "& .outer_listbx": {
          padding: "8px 0px",
        },
        "& .outer_listbx .MuiTypography-h6": {
          fontSize: "12px",
          backgroundColor: theme.palette.background.textbg,
          textTransform: "uppercase",
          padding: "10px 10px",
          borderRadius: "6px",
          fontWeight: "700",
          marginBottom: "10px",
        },
        "& .MuiList-root": {
          paddingTop: "0px",
        },
        "& .MuiListItem-root": {
          paddingBottom: "4px",
        },
        "& .outer_listbx_body ul li .MuiTypography-body2": {
          fontSize: "13px",
          wordBreak: "break-all",
          color: theme.palette.text.primary,
        },
        "& .outer_listbx_body ul li strong.MuiTypography-body2": {
          fontWeight: "700",
        },
        "& .outer_listbx_body ul li span.MuiTypography-body2": {
          fontWeight: "500",
        },
      }}
    >
      <Main
        open={open}
        rightsectionanchor={rightsectionanchor}
        className="table_material_inner"
        sx={{
          padding: "0px",
        }}
      >
        <MaterialTable
          isEmptyData={isEmptyData}
          loaderShow={loaderShow}
          setOpen={setOpen}
          setSelectActivity={setSelectActivity}
          setActivity={setActivity}
          setActivitySelected={setActivitySelected}
          setLimit={setLimit}
          limit={limit}
          total={total}
          setPage={setPage}
          page={page}
          setOpenSourceHover={setOpenSourceHover}
          setSrcinfo={setSrcinfo}
          tableData={tableData}
          callingFrom={"trafficActivity"}
          columns={trafficTableColumns}
          setAnchorEl={setAnchorEl}
          rightsectionanchor={rightsectionanchor}
          trafficActivities={trafficActivities}
        />
      </Main>
      <Drawer
        className="table_drawer_top"
        sx={{
          width: rightsectionanchor == "right" ? "400px" : "100%",
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: rightsectionanchor == "right" ? "400px" : "100%",
          },
          "& .outer_listbx_body": {
            padding: "0 15px",
          },
          "& .outer_listbx_body ul li .MuiTypography-body2": {
            fontSize: "13px",
            wordBreak: "break-all",
          },
          "& .outer_listbx_body ul li strong.MuiTypography-body2": {
            fontWeight: "700",
          },
          "& .outer_listbx_body ul li span.MuiTypography-body2": {
            fontWeight: "500",
          },
          "& .MuiDivider-root": {
            marginBottom: "10px",
            borderColor: theme.palette.action.hover,
          },
          "& .outer_listbx .MuiTypography-h6": {
            fontSize: "12px",
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            textTransform: "uppercase",
            padding: "8px 8px",
            borderRadius: "6px",
            fontWeight: "700",
            marginBottom: "6px",
          },
          "& .MuiListItem-root": {
            paddingBottom: "2px",
          },
          "& .MuiList-root": {
            paddingBottom: "2px",
          },
        }}
        variant="persistent"
        anchor={rightsectionanchor}
        open={open}
      >
        <Box
          className="right-header-close"
          sx={{
            position: "sticky",
            top: "0px",
            left: "0px",
            right: "0px",
            width: "100%",
            zIndex: "9",
            backgroundColor: theme.palette.background.paper,
            "& .MuiButtonBase-root": {
              top: "4px",
              right: "4px",
              padding: "4px",
            },
          }}
        >
          <DrawerHeader
            sx={{
              justifyContent: "flex-end",
              minHeight: "30px",
              padding: "2px",
              "& .MuiIconButton-root .MuiSvgIcon-root": {
                width: "18px",
                height: "auto",
              },
              "& .MuiDivider-root": {
                margin: "0.1rem 0",
              },
            }}
          >
            {rightsectionanchor === "bottom" ? (
              <IconButton
                onClick={(e) => {
                  e.preventDefault();
                  setrightsectionanchor("right");
                }}
              >
                <WebAssetIcon
                  className="rotate_icon_bottom"
                  sx={{ transform: "rotate(90deg) !important" }}
                />
              </IconButton>
            ) : (
              <IconButton
                onClick={(e) => {
                  e.preventDefault();
                  setrightsectionanchor("bottom");
                }}
              >
                <WebAssetIcon
                  className="rotate_icon_right"
                  sx={{
                    transform: "rotate(180deg) !important",
                  }}
                />
              </IconButton>
            )}
            <IconButton onClick={handleDrawerClose}>
              {rightsectionanchor === "right" ? <CloseIcon /> : <CloseIcon />}
            </IconButton>
          </DrawerHeader>
          <Divider />
        </Box>
        <Box className="outer_listbx">
          <Box className="outer_listbx_body">
            <Typography variant="h6" fontWeight={600} className="bg1">
              General
            </Typography>
            <List>
              <ListItem disablePadding>
                <Box className="listing_bx">
                  <Typography
                    variant="body2"
                    component="strong"
                    fontWeight={600}
                  >
                    Date :
                  </Typography>
                  <Typography variant="body2" component="span">
                    {activitySelected?.date}
                  </Typography>
                </Box>
              </ListItem>
              <ListItem disablePadding>
                <Box className="listing_bx">
                  <Typography
                    variant="body2"
                    component="strong"
                    fontWeight={600}
                  >
                    Time :
                  </Typography>
                  <Typography variant="body2" component="span">
                    {activitySelected?.time}
                  </Typography>
                </Box>
              </ListItem>
              <ListItem disablePadding>
                <Box className="listing_bx">
                  <Typography
                    variant="body2"
                    component="strong"
                    fontWeight={600}
                  >
                    Deployment :
                  </Typography>
                  <Typography
                    variant="body2"
                    component="span"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      "& img": {
                        marginRight: "5px",
                      },
                    }}
                  >
                    <Image src={AwsIcon} alt="aws icon" width={18} />
                    {selectActivity?.name}
                  </Typography>
                </Box>
              </ListItem>
              <ListItem disablePadding>
                <Box className="listing_bx">
                  <Typography
                    variant="body2"
                    component="strong"
                    fontWeight={600}
                  >
                    Cloud :
                  </Typography>
                  <Typography variant="body2" component="span">
                    {selectActivity?.cloud}
                  </Typography>
                </Box>
              </ListItem>
              <ListItem disablePadding>
                <Box className="listing_bx">
                  <Typography
                    variant="body2"
                    component="strong"
                    fontWeight={600}
                  >
                    Region :
                  </Typography>
                  <Typography variant="body2" component="span">
                    {selectActivity?.region}
                  </Typography>
                </Box>
              </ListItem>
            </List>
          </Box>
          <Divider />
          <Box className="outer_listbx_body">
            <Typography variant="h6" fontWeight={600} className="bg1">
              Action
            </Typography>
            <List>
              <ListItem disablePadding>
                <Box className="listing_bx">
                  <Typography
                    variant="body2"
                    component="strong"
                    fontWeight={600}
                  >
                    Action :
                  </Typography>
                  <Typography variant="body2" component="span">
                    {activitySelected?.action}
                  </Typography>
                </Box>
              </ListItem>
              <ListItem disablePadding>
                <Box className="listing_bx">
                  <Typography
                    variant="body2"
                    component="strong"
                    fontWeight={600}
                  >
                    Threat Action :
                  </Typography>
                  <Typography variant="body2" component="span">
                    {activitySelected?.utmaction}
                  </Typography>
                </Box>
              </ListItem>
              <ListItem disablePadding>
                <Box className="listing_bx">
                  <Typography
                    variant="body2"
                    component="strong"
                    fontWeight={600}
                  >
                    Threat :
                  </Typography>
                  <Typography variant="body2" component="span">
                    {activitySelected?.threats}
                  </Typography>
                </Box>
              </ListItem>
              <ListItem disablePadding>
                <Box className="listing_bx">
                  <Typography
                    variant="body2"
                    component="strong"
                    fontWeight={600}
                  >
                    Threat Type :
                  </Typography>
                  <Typography variant="body2" component="span">
                    {activitySelected?.threattyps}
                  </Typography>
                </Box>
              </ListItem>
              <ListItem disablePadding>
                <Box className="listing_bx">
                  <Typography
                    variant="body2"
                    component="strong"
                    fontWeight={600}
                  >
                    Level :
                  </Typography>
                  <Typography variant="body2" component="span">
                    {activitySelected?.crlevel}
                  </Typography>
                </Box>
              </ListItem>
              <ListItem disablePadding>
                <Box className="listing_bx">
                  <Typography
                    variant="body2"
                    component="strong"
                    fontWeight={600}
                  >
                    Policy Name :
                  </Typography>
                  <Typography variant="body2" component="span">
                    {activitySelected?.policyname}
                  </Typography>
                </Box>
              </ListItem>
            </List>
          </Box>
          <Divider />
          <Box className="outer_listbx_body">
            <Typography variant="h6" fontWeight={600} className="bg1">
              Source
            </Typography>
            <List>
              <ListItem disablePadding>
                <Box className="listing_bx">
                  <Typography
                    variant="body2"
                    component="strong"
                    fontWeight={600}
                  >
                    Source IP :
                  </Typography>
                  <Typography variant="body2" component="span">
                    {activitySelected?.srcip}
                  </Typography>
                </Box>
              </ListItem>
              <ListItem disablePadding>
                <Box className="listing_bx">
                  <Typography
                    variant="body2"
                    component="strong"
                    fontWeight={600}
                  >
                    Source Name :
                  </Typography>
                  <Typography variant="body2" component="span">
                    {activitySelected?.srcname}
                  </Typography>
                </Box>
              </ListItem>
              <ListItem disablePadding>
                <Box className="listing_bx">
                  <Typography
                    variant="body2"
                    component="strong"
                    fontWeight={600}
                  >
                    Source Port :
                  </Typography>
                  <Typography variant="body2" component="span">
                    {activitySelected?.srcport}
                  </Typography>
                </Box>
              </ListItem>
              <ListItem disablePadding>
                <Box className="listing_bx">
                  <Typography
                    variant="body2"
                    component="strong"
                    fontWeight={600}
                  >
                    Source Country :
                  </Typography>
                  <Typography variant="body2" component="span">
                    {activitySelected?.srccountry}
                  </Typography>
                </Box>
              </ListItem>
              <ListItem disablePadding>
                <Box className="listing_bx">
                  <Typography
                    variant="body2"
                    component="strong"
                    fontWeight={600}
                  >
                    VPC Id:
                  </Typography>
                  <Typography variant="body2" component="span">
                    {activitySelected?.srcinfo?.VPCId}
                  </Typography>
                </Box>
              </ListItem>
              <ListItem disablePadding>
                <Box className="listing_bx">
                  <Typography
                    variant="body2"
                    component="strong"
                    fontWeight={600}
                  >
                    VPC Name:
                  </Typography>
                  <Typography variant="body2" component="span">
                    {activitySelected?.srcinfo?.VPCName}
                  </Typography>
                </Box>
              </ListItem>
              <ListItem disablePadding>
                <Box className="listing_bx">
                  <Typography
                    variant="body2"
                    component="strong"
                    fontWeight={600}
                  >
                    Subnet Id:
                  </Typography>
                  <Typography variant="body2" component="span">
                    {activitySelected?.srcinfo?.SubnetId}
                  </Typography>
                </Box>
              </ListItem>
              <ListItem disablePadding>
                <Box className="listing_bx">
                  <Typography
                    variant="body2"
                    component="strong"
                    fontWeight={600}
                  >
                    Subnet Name:
                  </Typography>
                  <Typography variant="body2" component="span">
                    {activitySelected?.srcinfo?.SubnetName}
                  </Typography>
                </Box>
              </ListItem>
              <ListItem disablePadding>
                <Box className="listing_bx">
                  <Typography
                    variant="body2"
                    component="strong"
                    fontWeight={600}
                  >
                    Resource Type :
                  </Typography>
                  <Typography variant="body2" component="span">
                    {firstLetterCapital(activitySelected?.srcinfo?.Type)}
                  </Typography>
                </Box>
              </ListItem>
            </List>
          </Box>
          <Divider />
          <Box className="outer_listbx_body">
            <Typography variant="h6" fontWeight={600} className="bg1">
              Destination
            </Typography>
            <List>
              <ListItem disablePadding>
                <Box className="listing_bx">
                  <Typography
                    variant="body2"
                    component="strong"
                    fontWeight={600}
                  >
                    Destination IP :
                  </Typography>
                  <Typography variant="body2" component="span">
                    {activitySelected?.dstip}
                  </Typography>
                </Box>
              </ListItem>
              <ListItem disablePadding>
                <Box className="listing_bx">
                  <Typography
                    variant="body2"
                    component="strong"
                    fontWeight={600}
                  >
                    Destination Name :
                  </Typography>
                  <Typography variant="body2" component="span">
                    {activitySelected?.dstname}
                  </Typography>
                </Box>
              </ListItem>
              <ListItem disablePadding>
                <Box className="listing_bx">
                  <Typography
                    variant="body2"
                    component="strong"
                    fontWeight={600}
                  >
                    Destination Port :
                  </Typography>
                  <Typography variant="body2" component="span">
                    {activitySelected?.dstport}
                  </Typography>
                </Box>
              </ListItem>
              <ListItem disablePadding>
                <Box className="listing_bx">
                  <Typography
                    variant="body2"
                    component="strong"
                    fontWeight={600}
                  >
                    Destination Service :
                  </Typography>
                  <Typography variant="body2" component="span">
                    {activitySelected?.dstinetsvc}
                  </Typography>
                </Box>
              </ListItem>
              <ListItem disablePadding>
                <Box className="listing_bx">
                  <Typography
                    variant="body2"
                    component="strong"
                    fontWeight={600}
                  >
                    Hostname :
                  </Typography>
                  <Typography variant="body2" component="span">
                    {activitySelected?.hostname}
                  </Typography>
                </Box>
              </ListItem>
              <ListItem disablePadding>
                <Box className="listing_bx">
                  <Typography
                    variant="body2"
                    component="strong"
                    fontWeight={600}
                  >
                    Destination Country :
                  </Typography>
                  <Typography variant="body2" component="span">
                    {decodeURIComponent(activitySelected?.dstcountry)}
                  </Typography>
                </Box>
              </ListItem>
              <ListItem disablePadding>
                <Box className="listing_bx">
                  <Typography
                    variant="body2"
                    component="strong"
                    fontWeight={600}
                  >
                    Destination Region :
                  </Typography>
                  <Typography variant="body2" component="span">
                    {activitySelected?.dstregion}
                  </Typography>
                </Box>
              </ListItem>
              <ListItem disablePadding>
                <Box className="listing_bx">
                  <Typography
                    variant="body2"
                    component="strong"
                    fontWeight={600}
                  >
                    Destination City :
                  </Typography>
                  <Typography variant="body2" component="span">
                    {activitySelected?.dstcity}
                  </Typography>
                </Box>
              </ListItem>
              <ListItem disablePadding>
                <Box className="listing_bx">
                  <Typography
                    variant="body2"
                    component="strong"
                    fontWeight={600}
                  >
                    Destination Reputation :
                  </Typography>
                  <Typography variant="body2" component="span">
                    {activitySelected?.dstreputation}
                  </Typography>
                </Box>
              </ListItem>
              <ListItem disablePadding>
                <Box className="listing_bx">
                  <Typography
                    variant="body2"
                    component="strong"
                    fontWeight={600}
                  >
                    VPC Id:
                  </Typography>
                  <Typography variant="body2" component="span">
                    {activitySelected?.dstinfo?.VPCId}
                  </Typography>
                </Box>
              </ListItem>
              <ListItem disablePadding>
                <Box className="listing_bx">
                  <Typography
                    variant="body2"
                    component="strong"
                    fontWeight={600}
                  >
                    VPC Name:
                  </Typography>
                  <Typography variant="body2" component="span">
                    {activitySelected?.dstinfo?.VPCName}
                  </Typography>
                </Box>
              </ListItem>
              <ListItem disablePadding>
                <Box className="listing_bx">
                  <Typography
                    variant="body2"
                    component="strong"
                    fontWeight={600}
                  >
                    Subnet Id:
                  </Typography>
                  <Typography variant="body2" component="span">
                    {activitySelected?.dstinfo?.SubnetId}
                  </Typography>
                </Box>
              </ListItem>
              <ListItem disablePadding>
                <Box className="listing_bx">
                  <Typography
                    variant="body2"
                    component="strong"
                    fontWeight={600}
                  >
                    Subnet Name:
                  </Typography>
                  <Typography variant="body2" component="span">
                    {activitySelected?.dstinfo?.SubnetName}
                  </Typography>
                </Box>
              </ListItem>
              <ListItem disablePadding>
                <Box className="listing_bx">
                  <Typography
                    variant="body2"
                    component="strong"
                    fontWeight={600}
                  >
                    Resource Type :
                  </Typography>
                  <Typography variant="body2" component="span">
                    {firstLetterCapital(activitySelected?.dstinfo?.Type)}
                  </Typography>
                </Box>
              </ListItem>
            </List>
          </Box>
          <Divider />
          <Box className="outer_listbx_body">
            <Typography variant="h6" fontWeight={600} className="bg1">
              Application
            </Typography>
            <List>
              <ListItem disablePadding>
                <Box className="listing_bx">
                  <Typography
                    variant="body2"
                    component="strong"
                    fontWeight={600}
                  >
                    Service :
                  </Typography>
                  <Typography variant="body2" component="span">
                    {activitySelected?.service}
                  </Typography>
                </Box>
              </ListItem>
              <ListItem disablePadding>
                <Box className="listing_bx">
                  <Typography
                    variant="body2"
                    component="strong"
                    fontWeight={600}
                  >
                    Application :
                  </Typography>
                  <Typography variant="body2" component="span">
                    {activitySelected?.app}
                  </Typography>
                </Box>
              </ListItem>
              <ListItem disablePadding>
                <Box className="listing_bx">
                  <Typography
                    variant="body2"
                    component="strong"
                    fontWeight={600}
                  >
                    Application Category :
                  </Typography>
                  <Typography variant="body2" component="span">
                    {activitySelected?.appcat}
                  </Typography>
                </Box>
              </ListItem>
              <ListItem disablePadding>
                <Box className="listing_bx">
                  <Typography
                    variant="body2"
                    component="strong"
                    fontWeight={600}
                  >
                    Protocol :
                  </Typography>
                  <Typography variant="body2" component="span">
                    {activitySelected?.proto}
                  </Typography>
                </Box>
              </ListItem>
            </List>
          </Box>
          <Divider />
          <Box className="outer_listbx_body">
            <Typography variant="h6" fontWeight={600} className="bg1">
              Data
            </Typography>
            <List>
              <ListItem disablePadding>
                <Box className="listing_bx">
                  <Typography
                    variant="body2"
                    component="strong"
                    fontWeight={600}
                  >
                    Duration (seconds) :
                  </Typography>
                  <Typography variant="body2" component="span">
                    {activitySelected?.duration}
                  </Typography>
                </Box>
              </ListItem>
              <ListItem disablePadding>
                <Box className="listing_bx">
                  <Typography
                    variant="body2"
                    component="strong"
                    fontWeight={600}
                  >
                    Sent Bytes :
                  </Typography>
                  <Typography variant="body2" component="span">
                    {activitySelected?.sentbyte}
                  </Typography>
                </Box>
              </ListItem>
              <ListItem disablePadding>
                <Box className="listing_bx">
                  <Typography
                    variant="body2"
                    component="strong"
                    fontWeight={600}
                  >
                    Received Bytes :
                  </Typography>
                  <Typography variant="body2" component="span">
                    {activitySelected?.rcvdbyte}
                  </Typography>
                </Box>
              </ListItem>
              <ListItem disablePadding>
                <Box className="listing_bx">
                  <Typography
                    variant="body2"
                    component="strong"
                    fontWeight={600}
                  >
                    Sent Packets :
                  </Typography>
                  <Typography variant="body2" component="span">
                    {activitySelected?.sentpkt}
                  </Typography>
                </Box>
              </ListItem>
              <ListItem disablePadding>
                <Box className="listing_bx">
                  <Typography
                    variant="body2"
                    component="strong"
                    fontWeight={600}
                  >
                    Received Packets :
                  </Typography>
                  <Typography variant="body2" component="span">
                    {activitySelected?.rcvdpkt}
                  </Typography>
                </Box>
              </ListItem>
            </List>
          </Box>
        </Box>
      </Drawer>
      <Popover
        id={srcinfo?.rowId}
        open={openSourceHover}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transitionDuration={{
          enter: 800,
        }}
        sx={{
          pointerEvents: "none",
          width: "100%",
          maxWidth: "550px",
          flexShrink: 0,
          padding: "20px",
          "& .MuiPopover-paper": {
            boxShadow: "0px 16px 48px -1px rgba(0, 0, 0, 0.12) !important",
          },
          "& .MuiDrawer-paper": {
            width: "96%",
            maxWidth: "550px",
            height: "auto",
            boxShadow: "0 0 35px 0 rgba(154, 161, 171, 0.15)",
            border: "none",
            top: "20px",
            padding: "15px",
            margin: "0 auto",
            borderRadius: "6px",
          },
        }}
      >
        <Box className="right-header-close"></Box>
        <Box className="outer_listbx">
          <Box
            className="outer_listbx_body"
            sx={{
              padding: "20px 30px 20px 20px",
              "& .listing_bx strong.MuiTypography-body2": {
                color: theme.palette.text.primary,
              },
            }}
          >
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{
                color: theme.palette.primary.dark,
              }}
            >
              {srcinfo?.callingFrom} Info
            </Typography>
            <List>
              <ListItem disablePadding>
                <Box className="listing_bx">
                  <Typography
                    variant="body2"
                    component="strong"
                    fontWeight={600}
                    fontSize={13}
                  >
                    IP :{" "}
                  </Typography>
                  <Typography variant="body2" component="span" fontSize={13}>
                    {srcinfo?.ip}
                  </Typography>
                </Box>
              </ListItem>
              <ListItem disablePadding>
                <Box className="listing_bx">
                  <Typography
                    variant="body2"
                    component="strong"
                    fontWeight={600}
                    fontSize={13}
                  >
                    Type :{" "}
                  </Typography>
                  <Typography variant="body2" component="span" fontSize={13}>
                    {firstLetterCapital(srcinfo?.Type)}
                  </Typography>
                </Box>
              </ListItem>
              <ListItem disablePadding>
                <Box className="listing_bx">
                  <Typography
                    variant="body2"
                    component="strong"
                    fontWeight={600}
                    fontSize={13}
                  >
                    Name :{" "}
                  </Typography>
                  <Typography variant="body2" component="span" fontSize={13}>
                    {srcinfo?.Name}
                  </Typography>
                </Box>
              </ListItem>
              <ListItem disablePadding>
                <Box className="listing_bx">
                  <Typography
                    variant="body2"
                    component="strong"
                    fontWeight={600}
                    fontSize={13}
                  >
                    Description :{" "}
                  </Typography>
                  <Typography variant="body2" component="span" fontSize={13}>
                    {srcinfo?.Description}
                  </Typography>
                </Box>
              </ListItem>
              <ListItem disablePadding>
                <Box className="listing_bx">
                  <Typography
                    variant="body2"
                    component="strong"
                    fontWeight={600}
                    fontSize={13}
                  >
                    VPC Id:{" "}
                  </Typography>
                  <Typography variant="body2" component="span" fontSize={13}>
                    {srcinfo?.VPCId}
                  </Typography>
                </Box>
              </ListItem>
              <ListItem disablePadding>
                <Box className="listing_bx">
                  <Typography
                    variant="body2"
                    component="strong"
                    fontWeight={600}
                    fontSize={13}
                  >
                    VPC Name:{" "}
                  </Typography>
                  <Typography variant="body2" component="span" fontSize={13}>
                    {srcinfo?.VPCName}
                  </Typography>
                </Box>
              </ListItem>
              <ListItem disablePadding>
                <Box className="listing_bx">
                  <Typography
                    variant="body2"
                    component="strong"
                    fontWeight={600}
                    fontSize={13}
                  >
                    Subnet Id:{" "}
                  </Typography>
                  <Typography variant="body2" component="span" fontSize={13}>
                    {srcinfo?.SubnetId}
                  </Typography>
                </Box>
              </ListItem>
              <ListItem disablePadding>
                <Box className="listing_bx">
                  <Typography
                    variant="body2"
                    component="strong"
                    fontWeight={600}
                    fontSize={13}
                  >
                    Subnet Name:{" "}
                  </Typography>
                  <Typography variant="body2" component="span" fontSize={13}>
                    {srcinfo?.SubnetName}
                  </Typography>
                </Box>
              </ListItem>
            </List>
          </Box>
        </Box>
      </Popover>
    </Box>
  );
}
