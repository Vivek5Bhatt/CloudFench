import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { useTheme } from "@mui/material/styles";
import { toast } from "react-toastify";
import { stackConnectivity } from "utils/apis/routes/monitorLogs";
import CustomLoader from "src/components/Loader/CustomLoader";
import ConnectStack from "./ConnectStack";
import { cloudConnector } from "utils/apis/routes/settings";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Socket from "src/components/Socket/Socket";
import ErrorIcon from "@mui/icons-material/Error";
import { getFormatedDate, shortContent } from "utils/commonFunctions";
import AwsIcon from "public/images/awsimg/aws.svg";
import Image from "next/image";
import { Grid, FormControlLabel, Checkbox } from "@mui/material";
import CustomTable from "src/components/Tables/CustomTable";
import VpnIconWhite from "public/images/awsimg/vpcicon_white.svg";
import SubnetIconWhite from "public/images/awsimg/subnet-icon-white.svg";
import VpnIcon from "public/images/awsimg/vpcicon_grey.svg";

import VpnGreenIcon from "public/images/awsimg/vpcicon-green.svg";
import SubnetIcon from "public/images/awsimg/subnet-icon-grey.svg";
import SubnetGreenIcon from "public/images/awsimg/subnet-green.svg";

const StackTable = (props) => {
  const { openM, setOpenM } = props || {};
  const [stackList, setStatckList] = useState([]);
  const [loader, setLoader] = useState(true);
  const [connectorsList, setConnectorsList] = useState([]);
  const [toggleRow, setToggleRow] = useState(false);
  const [clickedRow, setClickedRow] = useState();

  const getDeplouments = async () => {
    try {
      const data = await stackConnectivity();
      if (data?.data) {
        setStatckList(data?.data);
        setLoader(false);
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.error || err?.message || "something went wrong"
      );
      setLoader(false);
      return;
    }
  };
  // useEffect(() => {
  //   getDeplouments();
  // }, []);

  const theme = useTheme();

  const getCloudConnector = async () => {
    const data = await cloudConnector();
    if (data) {
      setConnectorsList(data?.data);
    }
  };

  const getSelection = async () => {
    await getDeplouments();
    await getCloudConnector();
  };

  useEffect(() => {
    getSelection();
  }, []);

  const handleChangeStatus = (data) => {
    if (data) {
      setStatckList((prev) => {
        let mapped = prev.map((item) => {
          if (item.id === data.id) {
            return {
              ...item,
              status: data.status,
            };
          } else {
            return item;
          }
        });
        return mapped;
      });
    }
  };

  const columndD = (theme) => {
    const columns = [
      {
        id: "deployment",
        label: "Stack",
        // isBorder: `1px solid ${theme.palette.action.focus}`,
        textAlign: "left",
        isBodyAign: "left",
      },
      {
        id: "connector",
        label: "Cloud Connector",
        // isBorder: `1px solid ${theme.palette.action.focus}`,
        textAlign: "left",
        isBodyAign: "left",
      },
      {
        id: "status",
        label: "Status",
        // isBorder: `1px solid ${theme.palette.action.focus}`,
        textAlign: "left",
        isBodyAign: "left",
      },
      {
        id: "createdAt",
        label: "Date",
        // isBorder: `1px solid ${theme.palette.action.focus}`,
        textAlign: "left",
        isBodyAign: "left",
      },
    ];
    return columns;
  };

  const rows = () => {
    if (Array.isArray(stackList)) {
      if (stackList) {
        return stackList.map((row, index) => ({
          deployment: (
            <Box
              onClick={() => {
                setToggleRow(!toggleRow);
              }}
            >
              <Image src={AwsIcon} alt="aws icon" width={18} />{" "}
              {row.deployment.name}
            </Box>
          ),
          connector: (
            <Box
              onClick={() => {
                setToggleRow(!toggleRow);
              }}
            >
              {row.connector.name}{" "}
            </Box>
          ),
          status: (
            <Box>
              <ul className="progres_listingbx">
                {row.status === "connected" && (
                  <li>
                    <span className="iconbx ">
                      <CheckCircleIcon
                        sx={{
                          fontSize: "21px",
                          color: theme.palette.success.main,
                        }}
                      />
                    </span>
                    <span
                      className="tex_progres"
                      style={{ textTransform: "capitalize" }}
                    >
                      {row.status}
                    </span>
                  </li>
                )}

                {row.status === "connecting" && (
                  <li>
                    <span className="iconbx progress_circle">
                      <CircularProgress sx={{ color: "#a6a6a6" }} />
                    </span>
                    <span
                      className="tex_progres"
                      style={{ textTransform: "capitalize" }}
                    >
                      {row.status}
                    </span>
                  </li>
                )}

                {row.status === "error" && (
                  <li>
                    <span className="iconbx error_icon">
                      <ErrorIcon
                        sx={{
                          fontSize: "21px",
                          color: theme.palette.error.main,
                        }}
                      />
                    </span>
                    <span
                      className="tex_progres"
                      style={{ textTransform: "capitalize" }}
                    >
                      {row.status}
                    </span>
                  </li>
                )}
              </ul>
            </Box>
          ),
          createdAt: getFormatedDate(row.createdAt, "ddd MMM DD yyyy"),
        }));
      } else {
        return [];
      }
    } else {
      return [];
    }
  };

  return (
    <Card>
      <Socket on="stackConnectorProgress" callback={handleChangeStatus} />
      <Box className="table_material_inner">
        {!loader ? (
          <Box
            className="cstm_material_tablebx newbox"
            sx={{
              "& .MuiTable-root tbody tr": {
                backgroundColor: "transparent",
              },
              "& .MuiToolbar-dense": {
                backgroundColor: "transparent",
              },
              "& .MuiTable-root tbody tr:hover td": {
                backgroundColor: theme.palette.action.hover,
              },
              "& .MuiTable-root thead tr": {
                backgroundColor: theme.palette.primary.main,
              },
              "& .MuiTable-root thead tr th": {
                color: theme.palette.primary.contrastText,
                textTransform: "capitalize",
              },
              "& .MuiTable-root thead tr th .MuiDivider-root": {
                borderColor: theme.palette.primary.contrastText,
                opacity: "0.5",
              },
              "& .MuiTable-root thead tr th .MuiButtonBase-root .MuiSvgIcon-root":
                {
                  color: theme.palette.primary.contrastText,
                },
              "& .MuiTable-root tbody tr td": {
                color: theme.palette.text.primary,
                fontSize: "13px",
                fontWeight: "500",
                height: "34px",
              },
              "& .MuiTable-root thead tr th:last-child .Mui-TableHeadCell-ResizeHandle-Wrapper":
                {
                  right: "8px",
                },
            }}
          >
            <CustomTable
              rows={rows()}
              headCells={columndD(theme)}
              isPagination={true}
              iSexpandToggle={toggleRow}
              isClickedIndex={(index) => setClickedRow(index)}
            >
              {stackList[clickedRow]?.connectedResources.map(
                (item, vpcIndex) => {
                  return (
                    <Box key={vpcIndex} className="cstm_tree_structure">
                      <Grid container spacing={2}>
                        <Grid item sm={6} md={4} lg={4} xl={4}>
                          <Box
                            className="cstm_tree_inner"
                            sx={{
                              borderColor: theme.palette.action.focus,
                              "& li .main_root label": {
                                backgroundColor: theme.palette.background.paper,
                              },
                              "& li .main_root label.root_checked": {
                                backgroundColor: theme.palette.background.paper,
                              },
                              "& li .sub_root label": {
                                backgroundColor: theme.palette.background.paper,
                              },
                              "& li .sub_root label.root_checked": {
                                backgroundColor: theme.palette.background.paper,
                              },
                              "& li .sub_root label .MuiTypography-root": {
                                color: theme.palette.background.subroot,
                              },
                              "& li .main_root label .MuiTypography-root": {
                                color: theme.palette.background.subroot,
                              },
                            }}
                          >
                            <ul className="cstm_tree_body">
                              <li>
                                <Box className="main_root">
                                  <FormControlLabel
                                    label={shortContent(
                                      item?.name || item?.vpc_id,
                                      10
                                    )}
                                    className="root_checked"
                                    control={
                                      <Checkbox
                                        icon={
                                          <Image
                                            src={
                                              theme.palette.mode === "light"
                                                ? VpnIcon
                                                : VpnIconWhite
                                            }
                                            alt="Vpn Icon"
                                          />
                                        }
                                        checkedIcon={
                                          <Image
                                            src={VpnGreenIcon}
                                            alt="Vpn Icon"
                                          />
                                        }
                                        checked={true}
                                      />
                                    }
                                  />
                                </Box>

                                {item?.subnets.map((data, index) => {
                                  return (
                                    <ul key={index}>
                                      {item?.subnets
                                        .slice(index * 3, index * 3 + 3)
                                        .map((subnet, index) => {
                                          return (
                                            <>
                                              {
                                                <li>
                                                  <Box className="sub_root">
                                                    <FormControlLabel
                                                      className={"root_checked"}
                                                      control={
                                                        <Checkbox
                                                          icon={
                                                            <Image
                                                              src={
                                                                theme.palette
                                                                  .mode ===
                                                                "light"
                                                                  ? SubnetIcon
                                                                  : SubnetIconWhite
                                                              }
                                                              alt="Subnet Grren Icon"
                                                            />
                                                          }
                                                          checkedIcon={
                                                            <Image
                                                              src={
                                                                SubnetGreenIcon
                                                              }
                                                              alt="Subnet Grren Icon"
                                                            />
                                                          }
                                                          checked={true}
                                                        />
                                                      }
                                                      label={shortContent(
                                                        subnet?.s_name ||
                                                          subnet?.s_id,
                                                        7
                                                      )}
                                                    />
                                                  </Box>
                                                </li>
                                              }
                                            </>
                                          );
                                        })}
                                    </ul>
                                  );
                                })}
                              </li>
                            </ul>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  );
                }
              )}
            </CustomTable>
          </Box>
        ) : (
          <CustomLoader />
        )}
      </Box>
      {openM && (
        <ConnectStack
          open={openM}
          onClose={() => setOpenM(false)}
          connectorsList={connectorsList}
          getDeplouments={getDeplouments}
        />
      )}
    </Card>
  );
};

export default StackTable;
