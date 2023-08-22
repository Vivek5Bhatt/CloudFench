// ** MUI Imports
import { useState } from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Grid from "@mui/material/Grid";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import Popover from "@mui/material/Popover";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import VpnIcon from "public/images/awsimg/vpcicon_grey.svg";

import VpnIconWhite from "public/images/awsimg/vpcicon_white.svg";
import SubnetIconWhite from "public/images/awsimg/subnet-icon-white.svg";

import VpnGreenIcon from "public/images/awsimg/vpcicon-green.svg";
import SubnetIcon from "public/images/awsimg/subnet-icon-grey.svg";
import SubnetGreenIcon from "public/images/awsimg/subnet-green.svg";
import Image from "next/image";
import { shortContent } from "utils/commonFunctions";

const TabsStyle = ({
  sources,
  policies,
  setPolicies,
  selectedIndex,
  isEditMode,
  policy,
  editAbleData,
  updateClickableRow,
  checkDisabled,
}) => {
  const [value, setValue] = useState("1");
  const [openSourceHover, setOpenSourceHover] = useState(false);
  const [srcinfo, setSrcinfo] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const theme = useTheme();
  const page_size = 3;

  let clone = policies.map((item) => {
    return {
      ...item,
    };
  });
  let temp = [...clone[selectedIndex].srcaddr];

  const handlePopoverOpen = (event, item) => {
    setAnchorEl(event.currentTarget);
    setOpenSourceHover(true);
    setSrcinfo(item);
  };

  const handlePopoverClose = () => {
    setOpenSourceHover(false);
    setSrcinfo(null);
    setAnchorEl(null);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSourcesCheckBox = (index, data, bool) => {
    if (bool) {
      temp = temp.filter((item) => item.name !== "all");
      temp.push(data);
      clone[selectedIndex]["srcaddr"] = temp;
      setPolicies(clone);
      if (isEditMode) {
        const editData = clone.filter((item) => item.policyid === editAbleData);
        updateClickableRow(editData[0].srcaddr);
      }
    } else {
      temp = temp.filter(
        (item) => item.name !== data.name || item.s_id !== data.s_id
      );
      if (temp.length === 0) {
        temp.push({ name: "all" });
      }
      clone[selectedIndex]["srcaddr"] = temp;
      setPolicies(clone);
      if (isEditMode) {
        const editData = clone.filter((item) => item.policyid === editAbleData);
        updateClickableRow(editData[0].srcaddr);
      }
    }
  };

  return (
    <>
      <Box
        className="tab_content_box"
        sx={{ width: "100%", typography: "body1" }}
      >
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList
              onChange={handleChange}
              aria-label="lab API tabs example"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="VPC/Subnet " value="1" />
              <Tab label="EC2" value="2" />
              <Tab label="Databases / Cache" value="3" />
              <Tab label="Discovered labels" value="4" />
              <Tab label="Discovered labels" value="4" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <Box className="cstm_tree_structure">
              <Grid container spacing={2}>
                {sources.map((item, index) => {
                  const totalPages = Math.ceil(item.subnets.length / page_size);
                  const partSubnet = Array.from({ length: totalPages });
                  return (
                    <Grid item sm={6} md={4} lg={4} xl={4} key={index}>
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
                                onMouseOver={(event) => {
                                  handlePopoverOpen(event, item);
                                }}
                                onMouseLeave={handlePopoverClose}
                                className={
                                  temp.find((source) => {
                                    return (
                                      source?.name?.includes(item?.vpc_id) ||
                                      source?.vpc_id?.includes(item?.vpc_id)
                                    );
                                  })
                                    ? "root_checked"
                                    : ""
                                }
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
                                    checked={
                                      temp.find((source) => {
                                        return (
                                          source?.name?.includes(
                                            item?.vpc_id
                                          ) ||
                                          source?.vpc_id?.includes(item?.vpc_id)
                                        );
                                      })
                                        ? true
                                        : false
                                    }
                                    onClick={(event) => {
                                      handleSourcesCheckBox(
                                        item.vpc_id,
                                        item,
                                        event.target.checked
                                      );
                                    }}
                                  />
                                }
                                label={shortContent(
                                  item.name ? item.name : item.vpc_id,
                                  12
                                )}
                                disabled={checkDisabled(policy?.policyid)}
                              />
                            </Box>
                            {partSubnet.map((data, index) => {
                              return (
                                <ul key={index}>
                                  {item.subnets
                                    .slice(
                                      index * page_size,
                                      index * page_size + page_size
                                    )
                                    .map((subnet, index) => {
                                      const findData = temp.find((item) => {
                                        const findSubnet = item.subnets?.find(
                                          (data) => data.s_id === subnet.s_id
                                        );
                                        return findSubnet;
                                      });
                                      return (
                                        <li key={index}>
                                          <Box className="sub_root">
                                            <FormControlLabel
                                              onMouseOver={(event) => {
                                                setAnchorEl(
                                                  event.currentTarget
                                                );
                                                setOpenSourceHover(true);
                                                setSrcinfo(subnet);
                                              }}
                                              onMouseLeave={(event) => {
                                                setOpenSourceHover(false);
                                                setSrcinfo(null);
                                                setAnchorEl(null);
                                              }}
                                              className={
                                                temp.find((source) => {
                                                  return (
                                                    source?.name?.includes(
                                                      item?.vpc_id
                                                    ) ||
                                                    source?.vpc_id?.includes(
                                                      item?.vpc_id
                                                    ) ||
                                                    source.name ===
                                                      subnet.s_id ||
                                                    source.s_id === subnet.s_id
                                                  );
                                                }) ||
                                                findData?.subnets.find(
                                                  (item) => {
                                                    return (
                                                      item.s_id === subnet.s_id
                                                    );
                                                  }
                                                )
                                                  ? "root_checked"
                                                  : ""
                                              }
                                              control={
                                                <Checkbox
                                                  icon={
                                                    <Image
                                                      src={
                                                        theme.palette.mode ===
                                                        "light"
                                                          ? SubnetIcon
                                                          : SubnetIconWhite
                                                      }
                                                      alt="Subnet Grren Icon"
                                                    />
                                                  }
                                                  checkedIcon={
                                                    <Image
                                                      src={SubnetGreenIcon}
                                                      alt="Subnet Grren Icon"
                                                    />
                                                  }
                                                  onChange={(event) =>
                                                    handleSourcesCheckBox(
                                                      subnet.s_id,
                                                      subnet,
                                                      event.target.checked
                                                    )
                                                  }
                                                  checked={
                                                    temp.find((source) => {
                                                      return (
                                                        source?.name?.includes(
                                                          item?.vpc_id
                                                        ) ||
                                                        source?.vpc_id?.includes(
                                                          item?.vpc_id
                                                        ) ||
                                                        source.name ===
                                                          subnet.s_id ||
                                                        source.s_id ===
                                                          subnet.s_id
                                                      );
                                                    }) ||
                                                    findData?.subnets.find(
                                                      (item) => {
                                                        return (
                                                          item.s_id ===
                                                          subnet.s_id
                                                        );
                                                      }
                                                    )
                                                      ? true
                                                      : false
                                                  }
                                                />
                                              }
                                              label={shortContent(
                                                subnet.s_name
                                                  ? subnet.s_name
                                                  : subnet.s_id,
                                                12
                                              )}
                                              disabled={checkDisabled(
                                                policy?.policyid
                                              )}
                                            />
                                          </Box>
                                        </li>
                                      );
                                    })}
                                </ul>
                              );
                            })}
                          </li>
                        </ul>
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          </TabPanel>
          <TabPanel value="2">
            <Box className="coming_soon">
              <Typography
                variant="h6"
                sx={{ color: theme.palette.action.disabledBackground }}
              >
                Coming Soon..
              </Typography>
            </Box>
          </TabPanel>
          <TabPanel value="3">
            <Box className="coming_soon">
              <Typography
                variant="h6"
                sx={{ color: theme.palette.action.disabledBackground }}
              >
                Coming Soon..
              </Typography>
            </Box>
          </TabPanel>
          <TabPanel value="4">
            <Box className="coming_soon">
              <Typography
                variant="h6"
                sx={{ color: theme.palette.action.disabledBackground }}
              >
                Coming Soon..
              </Typography>
            </Box>
          </TabPanel>
        </TabContext>
      </Box>
      <Popover
        id="mouse-over-popover"
        open={openSourceHover}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
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
            width: "100%",
            maxWidth: "270px",
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
        disableRestoreFocus
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
              {srcinfo?.type === "vpc" ? "Vpc" : "Subnet"} Info
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
                    Id :{" "}
                  </Typography>
                  <Typography variant="body2" component="span" fontSize={13}>
                    {srcinfo?.type === "vpc" ? srcinfo?.vpc_id : srcinfo?.s_id}
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
                    {srcinfo?.type === "vpc"
                      ? srcinfo?.name
                      : srcinfo?.s_name
                      ? srcinfo?.s_name
                      : "N/A"}
                  </Typography>
                </Box>
              </ListItem>
            </List>
          </Box>
        </Box>
      </Popover>
    </>
  );
};

export default TabsStyle;
