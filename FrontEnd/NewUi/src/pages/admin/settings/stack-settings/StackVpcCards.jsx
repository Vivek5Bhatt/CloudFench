import { Checkbox, FormControlLabel, Grid } from "@mui/material";
import { Box, useTheme } from "@mui/system";
import Image from "next/image";
import VpnIcon from "public/images/awsimg/vpcicon_grey.svg";

import VpnIconWhite from "public/images/awsimg/vpcicon_white.svg";
import SubnetIconWhite from "public/images/awsimg/subnet-icon-white.svg";

import VpnGreenIcon from "public/images/awsimg/vpcicon-green.svg";
import SubnetIcon from "public/images/awsimg/subnet-icon-grey.svg";
import SubnetGreenIcon from "public/images/awsimg/subnet-green.svg";
import { shortContent } from "utils/commonFunctions";
import Typography from "@mui/material/Typography";
import Popover from "@mui/material/Popover";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { useState } from "react";

const StackVpcCards = (props) => {
  const [openSourceHover, setOpenSourceHover] = useState(false);
  const [srcinfo, setSrcinfo] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const {
    selectValue,
    setSelectValue,
    vpcList,
    setVpcLoader,
    addSubnet,
    setAddSubnet,
    searchVal,
  } = props || {};

  const theme = useTheme();

  const handleVpcClick = async (vpcItem) => {
    if (vpcItem) {
      setSelectValue({
        ...selectValue,
        selectedVpc: vpcItem,
        selectedSubnet: [],
      });
    }
  };

  const vpcLabel = (item) => {
    let name = item?.Tags?.find((tag) => {
      if (tag?.Key === "Name") {
        return tag;
      }
    });
    return name?.Value;
  };

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
  return (
    <>
      <Box className="cstm_tree_structure">
        <Grid container spacing={2}>
          {(vpcList || [])
            .filter(
              (_item) =>
                _item?.VpcId?.toLowerCase().includes(searchVal.toLowerCase()) ||
                vpcLabel(_item)
                  ?.toLowerCase()
                  .includes(searchVal.toLowerCase()) ||
                _item.subnets.filter(
                  (_sub) =>
                    _sub?.SubnetId?.toLowerCase().includes(
                      searchVal.toLowerCase()
                    ) ||
                    vpcLabel(_sub)
                      ?.toLowerCase()
                      .includes(searchVal.toLowerCase())
                ).length > 0
            )
            .map((item, vpcIndex) => {
              return (
                <Grid key={vpcIndex} item sm={6} md={4} lg={4} xl={4}>
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
                            sx={{
                              backgroundColor:
                                item.connected &&
                                `${theme.palette.action.disabledBackground} !important`,
                              cursor:
                                item.connected && "not-allowed !important",
                            }}
                            className={
                              item.VpcId === selectValue.selectedVpc.VpcId
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
                                  <Image src={VpnGreenIcon} alt="Vpn Icon" />
                                }
                                checked={
                                  item.VpcId === selectValue.selectedVpc.VpcId
                                }
                                onClick={() => handleVpcClick(item)}
                              />
                            }
                            label={shortContent(
                              vpcLabel(item) || item.VpcId,
                              10
                            )}
                            disabled={item.connected}
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
                                      {/* {subnet.VpcId === item.VpcId && ( */}
                                      {
                                        <li>
                                          <Box className="sub_root">
                                            <FormControlLabel
                                              sx={{
                                                backgroundColor:
                                                  item.connected &&
                                                  `${theme.palette.action.disabledBackground} !important`,
                                                cursor:
                                                  item.connected &&
                                                  "not-allowed !important",
                                              }}
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
                                                selectValue.selectedSubnet.find(
                                                  (sls) =>
                                                    subnet.SubnetId ===
                                                    sls.SubnetId
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
                                                  onChange={(e) => {
                                                    if (
                                                      Object.keys(
                                                        selectValue.selectedVpc
                                                      ).length
                                                    ) {
                                                      const _value =
                                                        selectValue.selectedSubnet.find(
                                                          (sls) =>
                                                            sls.SubnetId ===
                                                            subnet.SubnetId
                                                        );

                                                      const index =
                                                        selectValue.selectedSubnet.indexOf(
                                                          _value
                                                        );

                                                      if (index > -1) {
                                                        setSelectValue(
                                                          (prev) => {
                                                            prev.selectedSubnet.splice(
                                                              index,
                                                              1
                                                            );
                                                            return {
                                                              ...selectValue,
                                                              selectedSubnet:
                                                                prev.selectedSubnet,
                                                            };
                                                          }
                                                        );
                                                      } else {
                                                        if (
                                                          selectValue
                                                            .selectedSubnet
                                                            .length >= 2
                                                        ) {
                                                          e.preventDefault();
                                                          return;
                                                        }
                                                        setSelectValue(
                                                          (prev) => {
                                                            return {
                                                              ...selectValue,
                                                              selectedSubnet: [
                                                                ...prev.selectedSubnet,
                                                                subnet,
                                                              ],
                                                            };
                                                          }
                                                        );
                                                      }
                                                    }
                                                  }}
                                                  checked={
                                                    selectValue.selectedSubnet.find(
                                                      (sls) =>
                                                        subnet.SubnetId ===
                                                        sls.SubnetId
                                                    )
                                                      ? true
                                                      : false
                                                  }
                                                  disabled={
                                                    item.VpcId !=
                                                    selectValue.selectedVpc
                                                      .VpcId
                                                  }
                                                />
                                              }
                                              label={shortContent(
                                                vpcLabel(subnet) ||
                                                  subnet.SubnetId,
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
              );
            })}
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
                  {srcinfo?.VpcId ? "Vpc" : "Subnet"} Info
                </Typography>
                <List>
                  {!srcinfo?.VpcId && (
                    <ListItem disablePadding>
                      <Box className="listing_bx">
                        <Typography
                          variant="body2"
                          component="strong"
                          fontWeight={600}
                          fontSize={13}
                        >
                          AZ :{" "}
                        </Typography>
                        <Typography
                          variant="body2"
                          component="span"
                          fontSize={13}
                        >
                          {srcinfo?.AvailabilityZone}
                        </Typography>
                      </Box>
                    </ListItem>
                  )}
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
                      <Typography
                        variant="body2"
                        component="span"
                        fontSize={13}
                      >
                        {srcinfo?.VpcId ? srcinfo?.VpcId : srcinfo?.SubnetId}
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
                      <Typography
                        variant="body2"
                        component="span"
                        fontSize={13}
                      >
                        {vpcLabel(srcinfo) || srcinfo?.SubnetId}
                      </Typography>
                    </Box>
                  </ListItem>
                </List>
              </Box>
            </Box>
          </Popover>
        </Grid>
      </Box>
    </>
  );
};

export default StackVpcCards;
