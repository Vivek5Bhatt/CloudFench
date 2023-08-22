import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import React, { useState } from "react";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import { styled, useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Collapse from "@mui/material/Collapse";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import CustomSwitchToggle from "src/components/customSwitchToggle";
import AllowSwitchToggle from "src/components/AllowSwitchToggle";
import CustomToggle from "src/components/CustomToggle";
import TabsStyle from "src/components/Tabs/tabsStyle";
import { Button, CardContent, Tooltip } from "@mui/material";
import ListCheckbox from "src/components/ListCheckbox";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import TabsDestination from "src/components/Tabs/tabsStyle/tabsDestination";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import { firstLetterCapital } from "utils/commonFunctions";
import { getCookie } from "cookies-next";
import Loader from "src/components/Loader";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { securityProfile } from "utils/apis/routes/security";
import { toast } from "react-toastify";
import ConfirmationDialog from "src/components/Modals/confirmationDialog";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import ListItemText from "@mui/material/ListItemText";
import Chip from "@mui/material/Chip";
import CustomDropDown from "src/components/DropDown";
import Checkbox from "@mui/material/Checkbox";
import CustomChip from "src/components/Chip";

// basic table style
const BasicTableStyle = styled(Box)(({ theme }) => ({
  "& .MuiTable-root tbody tr": {
    backgroundColor: "transparent",
  },

  "& .MuiToolbar-dense": {
    backgroundColor: "transparent",
  },
  "& .MuiTable-root tbody tr:hover td": {
    backgroundColor: "transparent",
  },
  "& .MuiTable-root thead tr": {
    backgroundColor: "transparent",
  },
  "& .MuiTable-root thead tr th": {
    color: theme.palette.primary.contrastText,
    textTransform: "capitalize",
    backgroundColor: theme.palette.primary.main,
  },
  "& .MuiTable-root thead tr th .MuiDivider-root": {
    borderColor: theme.palette.primary.contrastText,
    opacity: "0.5",
  },
  "& .MuiTable-root thead tr th .MuiButtonBase-root .MuiSvgIcon-root": {
    color: theme.palette.primary.contrastText,
    textTransform: "capitalize",
    backgroundColor: "transparent",
  },
  "& .MuiTable-root tbody tr td": {
    color: theme.palette.text.primary,
    fontSize: "13px",
    fontWeight: "500",
    height: "34px",
    verticalAlign: "middle",
    paddingLeft: "0px !important",
    paddingRight: "0px !important",
  },
  "& .MuiTable-root tbody tr:nth-of-type(2) td": {
    paddingLeft: "0px !important",
    paddingRight: "0px !important",
  },
  "& .MuiTable-root thead tr th:last-child .Mui-TableHeadCell-ResizeHandle-Wrapper":
    {
      right: "8px",
    },

  "& .MuiTableCell-head": {
    whiteSpace: "nowrap",
    paddingLeft: "8px",
    paddingRight: "8px",
  },
  "& .MuiTableCell-body": {
    paddingLeft: "8px",
    paddingRight: "8px",
  },

  "& .nowrap_bx tr td": {
    whiteSpace: "nowrap",
  },
  "& .nowrap_bx tr td svg": {
    width: "18px",
  },
  "& .icon_td": {
    display: "flex",
    alignItems: "center",
    lineHeight: "24px",
    minHeight: "24px",
    "& .MuiSvgIcon-root": {
      width: "18px",
      height: "auto",
      marginRight: "4px",
    },
    "& .flag_icon": {
      marginRight: "4px",
      display: "flex",
    },
  },
  "& .truncate": {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    width: "auto",
  },
}));
// basic table style end

const actionOpt = [
  {
    value: "accept",
    label: "Allow",
  },
  {
    value: "deny",
    label: "Block",
  },
];

const statusOpt = [
  {
    value: "enable",
    label: "Enable",
  },
  {
    value: "disable",
    label: "Disable",
  },
];

const logOpt = [
  {
    value: "all",
    label: "Enable",
  },
  {
    value: "disable",
    label: "Disable",
  },
];

const SecurityPoliciesTable = ({
  policies,
  setPolicies,
  oldPolicies,
  setOldPolicies,
  services,
  destinations,
  sources,
  createPoliciesDatas,
  loaderShow,
  loaderAdd,
  setLoaderAdd,
  selectActivity,
  address,
  isEditMode,
  setIsEditMode,
  validateRow,
  setValidateRow,
  modifyPolicyDatas,
  openToggle,
  setOpenToggle,
  editAbleData,
  setEditAbleData,
}) => {
  const [searchServices, setSearchServices] = useState("");
  const [openDelete, setOpenDelete] = useState(false);
  const [openModel, setOpenModel] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState({});
  const [newEditData, setNewEditData] = useState([]);
  const [isOpenBtn, seIsOpenBtn] = useState();
  const [tempValidateData, setTempValidateData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [value, setValue] = useState("11");

  const theme = useTheme();
  const userId = getCookie("userId");
  const open = Boolean(anchorEl);

  const handleClick = (event, index) => {
    setAnchorEl({ event: event.currentTarget, index: index });
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleCloseDelete = () => setOpenDelete(false);

  const handleToggleOpen = (id, tab) => {
    setValue(tab);
    const tabData = {
      id,
      tab,
    };
    let temp = [];
    openToggle.map((item) => {
      temp.push(item);
    });
    const find = temp.findIndex((item) => item.id == id);
    if (find > -1) {
      temp[find].tab = tab;
      setOpenToggle(temp);
    } else {
      setOpenToggle([...openToggle, tabData]);
    }
  };

  const handleToggleClose = (id, tab) => {
    const tabData = {
      id,
      tab,
    };
    if (openToggle.find((item) => item.id === id)) {
      const temp = openToggle.filter((data) => data.id !== id);
      setOpenToggle(temp);
      return;
    }
    setOpenToggle([...openToggle, tabData]);
  };

  const handleValidate = (id, index, tab) => {
    const findRow = validateRow.find((item) => item === id);
    if (!findRow) {
      const checking = openToggle.find((item) => item.id === id);
      setValidateRow([...validateRow, id]);
      handleToggleOpen(index, tab);
    } else {
      const clone = [...validateRow];
      const newClone = clone.filter((data) => data !== id);
      setValidateRow(newClone);
      handleToggleClose(index, tab);
    }
  };

  const deleteModel = (id, index) => {
    setSelectedPolicy({ id, index });
    setOpenDelete(true);
    setAnchorEl(null);
  };

  const handleAction = (button) => {
    seIsOpenBtn(button);
    setOpenModel(true);
  };

  const closePoliciesDatas = () => {
    setPolicies(oldPolicies);
    setNewEditData([]);
    setOpenToggle([]);
  };

  const deletePoliciesData = async () => {
    try {
      if (selectedPolicy.id === null) {
        const clone = [...policies];
        clone.splice(selectedPolicy.index, 1);
        setPolicies(clone);
        return;
      } else {
        const requestData = {
          userId: userId,
          deploymentId: selectActivity.id,
          connectorId: selectActivity.StackConnector[0].connectorId,
          secretManagerRegion: selectActivity.user.secretManagerRegion,
          eventType: "delete",
          type: "policies",
          securityType: "secure_nat_gw",
          policyId: selectedPolicy.id,
        };
        const data = await securityProfile(requestData);
        if (data?.data?.data?.policies?.length) {
          const finalPolicyData = modifyPolicyDatas(data.data.data.policies);
          setPolicies(finalPolicyData);
          setOldPolicies(finalPolicyData);
          toast.success(data.data.message);
          return data.data.data.policies;
        } else {
          toast.error(data.data.message || "something went wrong");
        }
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.error || err?.message || "something went wrong"
      );
      return;
    }
  };

  const validateEditData = (data = []) => {
    let errorCount = 0;
    let errorMessage = [];

    data.map((item) => {
      if (!item?.policyId) {
        errorCount += 1;
        errorMessage.push("PolicyId can not be empty");
      } else {
        if (Object.keys(item).length == 1) {
          errorCount += 1;
          errorMessage.push(
            `Atleast 1 data is required for policyId: ${item?.policyId}`
          );
        }
      }
    });
    const policiesIds = data.map((item) => item?.policyId);
    const findDuplicates = (arr) =>
      arr.filter((item, index) => arr.indexOf(item) !== index);
    if (policiesIds) {
      const dupEntries = findDuplicates(policiesIds);
      if (dupEntries.length > 0) {
        errorCount += 1;
        errorMessage.push("Duplicate policyId are not allowed");
      }
    }

    if (errorCount > 0) {
      return {
        status: false,
        message: errorMessage[0],
      };
    } else {
      return {
        status: true,
        message: null,
      };
    }
  };

  const handleMappedData = () => {
    let cloneNewEdutData = newEditData.map((el) => {
      return { ...el };
    });
    const mapped = cloneNewEdutData.map((data) => {
      const isSrcAddress = tempValidateData.filter((item) => {
        if (item.policyId === data.policyId) {
          return true;
        } else {
          return false;
        }
      });
      const isSrcAddressFinal = isSrcAddress?.length ? isSrcAddress[0] : {};
      if (Object.keys(isSrcAddressFinal)?.length == 0) {
        delete data.srcaddr;
        delete data.dstaddr;
        delete data.service;
        delete data.action;
        delete data.status;
        delete data.logtraffic;
        delete data["webfilter-profile"];
        delete data.comments;
      }

      return { ...data };
    });
    return mapped;
  };

  const checkValidate = () => {
    if (!isEditMode) {
      handleAction("ok");
      return;
    }
    const mapped = handleMappedData();

    const validateData = validateEditData(mapped);
    if (!validateData?.status) {
      toast.error("Please validate your changes before applying.");
      setLoaderAdd(false);
      return;
    }
    handleAction("ok");
  };
  const editPoliciesDatas = async () => {
    try {
      setLoaderAdd(true);

      // let cloneNewEdutData = newEditData.map((el) => {
      //   return { ...el };
      // });
      // console.log(newEditData, "newEditDataweqwe");
      // const mapped = cloneNewEdutData.map((data) => {
      //   const isSrcAddress = tempValidateData.filter((item) => {
      //     if (item.policyId === data.policyId) {
      //       return true;
      //     } else {
      //       return false;
      //     }
      //   });
      //   const isSrcAddressFinal = isSrcAddress?.length ? isSrcAddress[0] : {};
      //   if (Object.keys(isSrcAddressFinal)?.length == 0) {
      //     delete data.srcaddr;
      //     delete data.dstaddr;
      //     delete data.service;
      //     delete data.action;
      //     delete data.status;
      //     delete data.logtraffic;
      //     delete data["webfilter-profile"];
      //     delete data.comments;
      //   }

      //   return { ...data };
      // });

      const mapped = handleMappedData();

      const requestData = {
        userId: userId,
        deploymentId: selectActivity.id,
        connectorId: selectActivity.StackConnector[0].connectorId,
        secretManagerRegion: selectActivity.user.secretManagerRegion,
        eventType: "put",
        type: "policies",
        securityType: "secure_nat_gw",
        putData: mapped,
      };

      const response = await securityProfile(requestData);
      if (response?.data?.data?.policies?.length) {
        const finalPolicyData = modifyPolicyDatas(response.data.data.policies);
        setPolicies(finalPolicyData);
        setOldPolicies(finalPolicyData);
        setLoaderAdd(false);
        setIsEditMode(false);
        setValidateRow([]);
        setOpenToggle([]);
        setOpenModel(false);
        setTempValidateData([]);
        setNewEditData([]);
        setEditAbleData(null);
        toast.success(response.data.message);
        return response.data.data.policies;
      } else {
        toast.error(response.data.message || "something went wrong");
        setLoaderAdd(false);
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.error || err?.message || "something went wrong"
      );
      return;
    }
  };

  const updateClickableRow = (clone, keyType, val, index, policy) => {
    let currentData = clone[index];
    const findIndex = newEditData.findIndex(
      (item) => item.policyId == currentData?.policyid
    );
    let newArr = [...newEditData];
    if (keyType === "internet-service-name") {
      newArr[findIndex] = {
        ...newArr[findIndex],
        "internet-service": val?.length ? "enable" : "disable",
        service: [],
      };
      setNewEditData(newArr);
    }
    if (findIndex > -1) {
      newArr[findIndex] = {
        ...newArr[findIndex],
        [keyType]: val,
      };
      setNewEditData(newArr);
    } else {
      setNewEditData([
        ...newEditData,
        {
          policyId: policy.policyid,
          [keyType]: val,
        },
      ]);
    }
  };

  const checkDisabled = (policyid) => {
    if (policyid) {
      if (!validateRow.includes(policyid)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const handleChangeComment = (index, policy, event) => {
    let clone = policies.map((item) => {
      return {
        ...item,
      };
    });
    clone[index]["comments"] = event.target.value;
    setPolicies(clone);
    isEditMode &&
      updateClickableRow(clone, "comments", event.target.value, index, policy);
  };

  return (
    <>
      <Card sx={{ marginTop: "0px" }}>
        <Box
          className="icon_td"
          sx={{
            padding: "6px 8px",
            display: "flex",
            alignItems: "center",
            lineHeight: "1",
            justifyContent: "flex-end",
          }}
        >
          <Box
            className="flag_icon"
            sx={{
              display: "flex",
              marginRight: "4px",
            }}
          ></Box>
          <Stack direction="row" spacing={1}>
            <Button
              type="button"
              size="small"
              color="success"
              variant="contained"
              disabled={
                loaderAdd ||
                !policies?.find(
                  (item) => item.policyid === null || newEditData?.length
                )
              }
              sx={{
                borderRadius: "3px",
                minWidth: "60px",
                cursor: "pointer",
                height: "25px",
                "& .cstm_loaderbx": {
                  backgroundColor: "rgba(255, 255, 255, 0.40)",
                },
              }}
              onClick={() => {
                checkValidate();
                // handleAction("ok");
              }}
            >
              {loaderAdd && <Loader />}
              Apply
            </Button>
            <Chip
              size="small"
              label="Cancel"
              color="error"
              sx={{
                borderRadius: "3px",
                minWidth: "60px",
                cursor: "pointer",
              }}
              onClick={() => handleAction("cancel")}
              disabled={
                !policies?.find(
                  (item) => item.policyid === null || newEditData?.length
                )
              }
            />
          </Stack>
        </Box>
        <Box className="table_material_inner table_collapse_allow">
          <BasicTableStyle className="cstm_material_tablebx newbox">
            <TableContainer
              className="cstm_checktable_bxx"
              sx={{
                height: "calc(100vh - 196px)",
                [theme.breakpoints.down("sm")]: {
                  height: "calc(100vh - 196px)",
                },
              }}
            >
              <Table stickyHeader aria-label="sticky table" sx={{}}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: "200px" }}>Source</TableCell>
                    <TableCell sx={{ width: "200px" }}>Destination</TableCell>
                    <TableCell sx={{ width: "200px" }}>Service</TableCell>
                    <TableCell sx={{ width: "100px" }}>Action</TableCell>
                    <TableCell sx={{ width: "200px" }}>Security</TableCell>
                    <TableCell sx={{ width: "100px" }}>Status</TableCell>
                    <TableCell sx={{ width: "100px" }}>Log traffic</TableCell>
                    <TableCell sx={{ width: "200px" }}>Description</TableCell>
                    <TableCell
                      sx={{ width: "100px", minWidth: "90px" }}
                    ></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody
                  hover="true"
                  role="checkbox"
                  tabIndex={-1}
                  className="nowrap_bx"
                >
                  {!policies?.length ? (
                    <TableRow>
                      <TableCell
                        colSpan={13}
                        sx={{
                          borderBottom: "none",
                        }}
                      >
                        <Box
                          sx={{
                            position: "relative",
                            minHeight: "calc(100vh - 300px)",
                            display: "flex",
                            alignItems: "center",
                            flexWrap: "wrap",
                            justifyContent: "center",
                            [theme.breakpoints.down("sm")]: {
                              minHeight: "calc(100vh - 360px)",
                            },
                            "& .cstm_loaderbx svg": {
                              width: "auto !important",
                            },
                          }}
                        >
                          {loaderShow && <Loader />}
                          No Data Found
                        </Box>
                      </TableCell>
                    </TableRow>
                  ) : (
                    policies.map((policy, index) => {
                      return (
                        <React.Fragment key={index}>
                          <TableRow
                            className={
                              newEditData.some(
                                (item) => item.policyId === policy.policyid
                              ) || policy.policyid === null
                                ? theme.palette.mode === "light"
                                  ? "anyChangeRowTr"
                                  : "anyChangeRowTrDark"
                                : policy.status === "disable"
                                ? "disableRowTr"
                                : ""
                            }
                            hover
                            sx={{
                              "&:last-of-type td, &:last-of-type th": {
                                border: 0,
                              },
                            }}
                          >
                            <TableCell>
                              <Box className="icon_td px_8">
                                <Box
                                  className="table_subtilebx truncate"
                                  onClick={() => handleToggleOpen(index, "11")}
                                >
                                  {policy?.srcaddr?.length > 0 ? (
                                    policy?.srcaddr?.map((source, index) => {
                                      return (
                                        <Box
                                          key={index}
                                          className="table_subtilename truncate"
                                          sx={{
                                            width: "auto !important",
                                            cursor: "pointer",
                                            display: "flex",
                                            alignItems: "center",
                                          }}
                                        >
                                          {/* {source.type === "vpc" ? (
                                            <Box
                                              sx={{
                                                marginRight: "5px",
                                              }}
                                            >
                                              <Image
                                                src={VpnIcon}
                                                alt="VPC Icon"
                                                width={20}
                                              />
                                            </Box>
                                          ) : source.s_id ? (
                                            <Box
                                              sx={{
                                                marginRight: "5px",
                                              }}
                                            >
                                              <Image
                                                src={SubnetIcon}
                                                alt="Subnet Icon"
                                                width={20}
                                              />
                                            </Box>
                                          ) : (
                                            ""
                                          )} */}
                                          {source.name
                                            ? firstLetterCapital(source.name)
                                            : source.s_name
                                            ? firstLetterCapital(source.s_name)
                                            : source.vpc_id
                                            ? firstLetterCapital(source.vpc_id)
                                            : source.s_id
                                            ? firstLetterCapital(source.s_id)
                                            : "All"}
                                        </Box>
                                      );
                                    })
                                  ) : (
                                    <Box
                                      key={index}
                                      className="table_subtilename truncate"
                                      sx={{
                                        width: "auto !important",
                                        cursor: "pointer",
                                      }}
                                    >
                                      All
                                    </Box>
                                  )}
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box className="icon_td px_8">
                                <Box
                                  className="table_subtilebx truncate"
                                  onClick={() => handleToggleOpen(index, "12")}
                                >
                                  {policy?.["internet-service-name"]?.length >
                                  0 ? (
                                    policy?.["internet-service-name"]?.map(
                                      (destination, index) => {
                                        return (
                                          <Box
                                            key={index}
                                            className="table_subtilename truncate"
                                            sx={{
                                              width: "auto !important",
                                              cursor: "pointer",
                                            }}
                                          >
                                            {firstLetterCapital(
                                              destination?.name
                                            )}
                                          </Box>
                                        );
                                      }
                                    )
                                  ) : (
                                    <Box
                                      key={index}
                                      className="table_subtilename truncate"
                                      sx={{
                                        width: "auto !important",
                                        cursor: "pointer",
                                      }}
                                    >
                                      All
                                    </Box>
                                  )}
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box className="icon_td px_8">
                                <Box
                                  onClick={() =>
                                    !policy?.["internet-service-name"]
                                      ?.length && handleToggleOpen(index, "13")
                                  }
                                >
                                  {policy?.["internet-service-name"]?.length >
                                  0 ? (
                                    <Box
                                      key={index}
                                      className="truncate"
                                      sx={{
                                        width: "auto !important",
                                        cursor: "pointer",
                                      }}
                                    >
                                      Internet-Service
                                    </Box>
                                  ) : policy?.service?.length > 0 ? (
                                    policy?.service?.map((service, index) => {
                                      return (
                                        <Box
                                          key={index}
                                          className="truncate"
                                          sx={{
                                            width: "auto !important",
                                            cursor: "pointer",
                                          }}
                                        >
                                          {firstLetterCapital(service.name)}
                                        </Box>
                                      );
                                    })
                                  ) : (
                                    "All"
                                  )}
                                </Box>
                              </Box>
                            </TableCell>

                            <TableCell>
                              <Box className="icon_td px_8">
                                <CustomChip
                                  label={
                                    policies[index]["action"] === "accept"
                                      ? "Allow"
                                      : "Block"
                                  }
                                  iconType={
                                    policies[index]["action"] === "accept"
                                  }
                                />

                                {/* <AllowSwitchToggle
                                  policy={policy}
                                  policies={policies}
                                  setPolicies={setPolicies}
                                  selectedIndex={index}
                                  isEditMode={isEditMode}
                                  setNewEditData={setNewEditData}
                                  newEditData={newEditData}
                                  editAbleData={editAbleData}
                                  updateClickableRow={(val) => {
                                    let clone = policies.map((item) => {
                                      return {
                                        ...item,
                                      };
                                    });
                                    let newV = val ? "accept" : "deny";
                                    updateClickableRow(
                                      clone,
                                      "action",
                                      newV,
                                      index,
                                      policy
                                    );
                                  }}
                                  validateRow={validateRow}
                                ></AllowSwitchToggle> */}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box className="icon_td px_8">
                                <Box className="truncate">Web Security</Box>
                                <Box
                                  sx={{ paddingLeft: "5px", display: "flex" }}
                                >
                                  <CustomChip
                                    label={
                                      policies[index]["webfilter-profile"] ===
                                      "cloudfence-default"
                                        ? ""
                                        : ""
                                    }
                                    iconType={
                                      policies[index]["webfilter-profile"] ===
                                      "cloudfence-default"
                                    }
                                    changeIconColor={
                                      policies[index]["webfilter-profile"] ===
                                      "cloudfence-default"
                                        ? true
                                        : false
                                    }
                                    isOnlyTickIcon={true}
                                  />
                                  {/* <CustomSwitchToggle
                                    policy={policy}
                                    policies={policies}
                                    setPolicies={setPolicies}
                                    selectedIndex={index}
                                    setNewEditData={setNewEditData}
                                    newEditData={newEditData}
                                    editAbleData={editAbleData}
                                    updateClickableRow={(val) => {
                                      let clone = policies.map((item) => {
                                        return {
                                          ...item,
                                        };
                                      });
                                      let newV = val
                                        ? "cloudfence-default"
                                        : "";
                                      updateClickableRow(
                                        clone,
                                        "webfilter-profile",
                                        newV,
                                        index,
                                        policy
                                      );
                                    }}
                                    validateRow={validateRow}
                                    isEditMode={isEditMode}
                                    checkDisabled={checkDisabled}
                                  ></CustomSwitchToggle> */}
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box className="icon_td px_8">
                                <Box
                                  sx={{ paddingLeft: "5px", display: "flex" }}
                                >
                                  <CustomChip
                                    label={
                                      policies[index]["status"] === "enable"
                                        ? "Enable"
                                        : "Disable"
                                    }
                                    iconType={
                                      policies[index]["status"] === "enable"
                                    }
                                  />
                                  {/* <CustomToggle
                                    value={
                                      policy.status === "enable" ? true : false
                                    }
                                    onChange={(val) => {
                                      let clone = policies.map((item) => {
                                        return {
                                          ...item,
                                        };
                                      });
                                      clone[index]["status"] = val
                                        ? "enable"
                                        : "disable";
                                      setPolicies(clone);
                                      let newV = val ? "enable" : "disable";
                                      isEditMode &&
                                        updateClickableRow(
                                          clone,
                                          "status",
                                          newV,
                                          index,
                                          policy
                                        );
                                    }}
                                    disabled={checkDisabled(policy.policyid)}
                                  /> */}
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box className="icon_td px_8">
                                <Box
                                  sx={{ paddingLeft: "5px", display: "flex" }}
                                >
                                  <CustomChip
                                    label={
                                      policies[index]["logtraffic"] === "all"
                                        ? "Enable"
                                        : "Disable"
                                    }
                                    iconType={
                                      policies[index]["logtraffic"] === "all"
                                    }
                                  />
                                  {/* <CustomToggle
                                    value={
                                      policy.logtraffic === "all" ? true : false
                                    }
                                    onChange={(val) => {
                                      let clone = policies.map((item) => {
                                        return {
                                          ...item,
                                        };
                                      });
                                      clone[index]["logtraffic"] = val
                                        ? "all"
                                        : "disable";
                                      setPolicies(clone);
                                      let newV = val ? "all" : "disable";
                                      isEditMode &&
                                        updateClickableRow(
                                          clone,
                                          "logtraffic",
                                          newV,
                                          index,
                                          policy
                                        );
                                    }}
                                    disabled={checkDisabled(policy.policyid)}
                                  /> */}
                                </Box>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box
                                className="truncate px_8"
                                sx={{
                                  width: "100% !important",
                                  paddingTop: "2px",
                                  paddingBottom: "2px",
                                }}
                              >
                                {policy.policyid === null ||
                                (isEditMode &&
                                  validateRow.includes(policy.policyid)) ? (
                                  <TextField
                                    className="resize_field"
                                    id="standard-multiline-static"
                                    multiline
                                    fullWidth
                                    minRows={1}
                                    size="small"
                                    variant="outlined"
                                    value={policy.comments}
                                    onChange={handleChangeComment.bind(
                                      this,
                                      index,
                                      policy
                                    )}
                                    sx={{
                                      "& .MuiInputBase-root": {
                                        padding: "5.5px 10px",
                                        fontSize: "14px",
                                      },
                                    }}
                                  />
                                ) : (
                                  policy.comments
                                )}
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box
                                className="icon_td px_8"
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  lineHeight: "1",
                                }}
                              >
                                {policy.policyid !== null ? (
                                  <IconButton
                                    color="success"
                                    aria-label="add an alarm"
                                    sx={{
                                      backgroundColor: "rgba(86, 202, 0, 0.08)",
                                      marginRight: "5px",
                                      padding: "6px",
                                    }}
                                    onClick={() => {
                                      setIsEditMode(true);
                                      setEditAbleData(policy.policyid);
                                      handleValidate(
                                        policy.policyid,
                                        index,
                                        "11"
                                      );
                                    }}
                                  >
                                    <EditOutlinedIcon
                                      sx={{
                                        fontSize: "20px",
                                        marginRight: "0px !important",
                                      }}
                                    />
                                  </IconButton>
                                ) : (
                                  ""
                                )}
                                <Box
                                  sx={{
                                    " & .MuiMenu-paper": {
                                      boxShadow:
                                        "0px 2px 10px 0px rgba(58, 53, 65, 0.1) !important",
                                    },
                                  }}
                                >
                                  <IconButton
                                    size="small"
                                    className="card-more-options"
                                    aria-controls={
                                      open ? "basic-menu" : undefined
                                    }
                                    aria-haspopup="true"
                                    aria-expanded={open ? "true" : undefined}
                                    onClick={(event) =>
                                      handleClick(event, index)
                                    }
                                    sx={{
                                      color: "text.secondary",
                                      width: "30px",
                                      height: "30px",
                                      backgroundColor:
                                        theme.palette.background.policiesicon,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                    }}
                                  >
                                    <MoreHorizIcon
                                      sx={{ marginRight: "0px !important" }}
                                    />
                                  </IconButton>
                                  {anchorEl?.index === index && (
                                    <Menu
                                      id="basic-menu"
                                      anchorEl={anchorEl.event}
                                      open={anchorEl?.index === index}
                                      onClose={handleClose}
                                      MenuListProps={{
                                        "aria-labelledby": "basic-button",
                                      }}
                                      sx={{
                                        "& .MuiMenuItem-root": {
                                          padding: "0px",
                                        },
                                        " & .MuiMenuItem-root:hover ": {
                                          backgroundColor:
                                            "transparent !important",
                                        },
                                      }}
                                    >
                                      <MenuItem
                                        sx={{
                                          margin: "0 10px",
                                        }}
                                        onClick={() =>
                                          deleteModel(policy.policyid, index)
                                        }
                                      >
                                        <IconButton
                                          // onClick={() =>
                                          //   deleteModel(policy.policyid, index)
                                          // }
                                          color="error"
                                          aria-label="add to shopping cart"
                                          sx={{
                                            backgroundColor:
                                              "rgba(255, 76, 81, 0.08)",
                                            padding: "4px",
                                          }}
                                        >
                                          <DeleteOutlineOutlinedIcon
                                            sx={{
                                              fontSize: "15px",
                                              marginRight: "0px !important",
                                            }}
                                          />
                                        </IconButton>
                                        <ListItemText
                                          // onClick={() =>
                                          //   deleteModel(policy.policyid, index)
                                          // }
                                          sx={{
                                            marginLeft: "5px",
                                            " & .MuiTypography-body1": {
                                              fontSize: "13px",
                                            },
                                          }}
                                        >
                                          Delete
                                        </ListItemText>
                                      </MenuItem>
                                    </Menu>
                                  )}
                                </Box>
                              </Box>
                            </TableCell>
                          </TableRow>
                          {openToggle?.find((item) => item.id === index) && (
                            <TableRow className="table_collapse_row">
                              <TableCell
                                style={{ paddingBottom: 0, paddingTop: 0 }}
                                colSpan={9}
                              >
                                <Collapse
                                  in={openToggle}
                                  timeout="auto"
                                  unmountOnExit
                                >
                                  <Box
                                    className="cstm_tabbox"
                                    sx={{
                                      backgroundColor:
                                        theme.palette.background.default,
                                    }}
                                  >
                                    <Grid container spacing={2}>
                                      <Grid item xs={12} md={12} lg={12}>
                                        <Card sx={{ minHeight: "100%" }}>
                                          {/* tabs start */}
                                          <Box
                                            className="tab_content_box"
                                            sx={{
                                              width: "100%",
                                              typography: "body1",
                                              position: "relative",
                                            }}
                                          >
                                            <IconButton
                                              aria-label="close-icon"
                                              className="close_icnbtn"
                                              sx={{ zIndex: "9", top: "12px" }}
                                            >
                                              <CloseIcon
                                                onClick={() => {
                                                  // setEditAbleData(policy.policyid);
                                                  // handleValidate(
                                                  //   policy.policyid,
                                                  //   index,
                                                  //   "11"
                                                  // );
                                                  // setIsEditMode(true);
                                                  // setEditAbleData(null);

                                                  setIsEditMode(false);

                                                  handleToggleClose(
                                                    index,
                                                    value
                                                  );
                                                  const policiesData =
                                                    policies.filter(
                                                      (item) =>
                                                        item.policyid === null
                                                    );
                                                  const finalPoliciesData = [
                                                    ...oldPolicies,
                                                    ...policiesData,
                                                  ];
                                                  setPolicies(
                                                    finalPoliciesData
                                                  );
                                                  const editData =
                                                    newEditData.filter(
                                                      (item) =>
                                                        item.policyId !==
                                                        policy.policyid
                                                    );
                                                  setNewEditData(editData);
                                                }}
                                              />
                                            </IconButton>
                                            {policy.policyid !== null && (
                                              <Tooltip title="Validate">
                                                <IconButton
                                                  aria-label="close-icon"
                                                  className="close_icnbtn"
                                                  sx={{
                                                    mr: "30px",
                                                    zIndex: "9",
                                                    top: "12px",
                                                  }}
                                                  onClick={() => {
                                                    const findData =
                                                      newEditData.find(
                                                        (item) =>
                                                          item.policyId ===
                                                          policy.policyid
                                                      );
                                                    setTempValidateData(
                                                      (prev) => [
                                                        ...prev,
                                                        findData,
                                                      ]
                                                    );
                                                  }}
                                                >
                                                  <TaskAltIcon
                                                    color={
                                                      loaderAdd ||
                                                      !policies?.find(
                                                        (item) =>
                                                          item.policyid ===
                                                            null ||
                                                          newEditData?.length
                                                      )
                                                        ? ""
                                                        : tempValidateData?.find(
                                                            (item) =>
                                                              item?.policyId ===
                                                              policy?.policyid
                                                          )
                                                        ? "success"
                                                        : "warning"
                                                    }
                                                  />
                                                </IconButton>
                                              </Tooltip>
                                            )}

                                            <TabContext value={value}>
                                              <Box
                                                sx={{
                                                  borderBottom: 1,
                                                  borderColor: "divider",
                                                  paddingRight: "70px",
                                                }}
                                              >
                                                <TabList
                                                  onChange={handleChange}
                                                  aria-label="lab API tabs example"
                                                  variant="scrollable"
                                                  scrollButtons="auto"
                                                >
                                                  <Tab
                                                    label="Source"
                                                    value="11"
                                                  />
                                                  <Tab
                                                    label="Destination"
                                                    value="12"
                                                  />
                                                  {!policy?.[
                                                    "internet-service-name"
                                                  ]?.length && (
                                                    <Tab
                                                      label="Service"
                                                      value="13"
                                                    />
                                                  )}
                                                  <Tab
                                                    label="Action"
                                                    value="14"
                                                  />
                                                  <Tab
                                                    label="Security"
                                                    value="15"
                                                  />
                                                  <Tab
                                                    label="Status"
                                                    value="16"
                                                  />
                                                  <Tab
                                                    label="Log Traffic"
                                                    value="17"
                                                  />
                                                </TabList>
                                              </Box>
                                              <TabPanel value="11">
                                                <CardContent
                                                  sx={{
                                                    padding: "10px !important",
                                                    position: "relative",
                                                  }}
                                                >
                                                  <Typography
                                                    variant="h5"
                                                    sx={{
                                                      fontSize:
                                                        "18px !important",
                                                      fontWeight: "600",
                                                      paddingRight: "20px",
                                                      [theme.breakpoints.down(
                                                        "sm"
                                                      )]: {
                                                        fontSize:
                                                          "16px !important",
                                                      },
                                                    }}
                                                  >
                                                    Source
                                                  </Typography>
                                                  <TabsStyle
                                                    sources={sources}
                                                    policies={policies}
                                                    setPolicies={setPolicies}
                                                    selectedIndex={index}
                                                    isEditMode={isEditMode}
                                                    policy={policy}
                                                    setNewEditData={
                                                      setNewEditData
                                                    }
                                                    newEditData={newEditData}
                                                    editAbleData={editAbleData}
                                                    updateClickableRow={(
                                                      val
                                                    ) => {
                                                      let clone = policies.map(
                                                        (item) => {
                                                          return {
                                                            ...item,
                                                          };
                                                        }
                                                      );
                                                      updateClickableRow(
                                                        clone,
                                                        "srcaddr",
                                                        val,
                                                        index,
                                                        policy
                                                      );
                                                    }}
                                                    validateRow={validateRow}
                                                    checkDisabled={
                                                      checkDisabled
                                                    }
                                                  />
                                                </CardContent>
                                              </TabPanel>
                                              <TabPanel value="12">
                                                <CardContent
                                                  sx={{
                                                    padding: "10px !important",
                                                    position: "relative",
                                                    maxWidth: "500px",
                                                  }}
                                                >
                                                  <Box
                                                    className="list_upper_tabs"
                                                    sx={{
                                                      padding: "15px",
                                                      border: "1px solid",
                                                      borderColor:
                                                        theme.palette.grey[200],
                                                      borderRadius: "6px",
                                                    }}
                                                  >
                                                    <Typography
                                                      variant="h5"
                                                      sx={{
                                                        fontSize:
                                                          "18px !important",
                                                        fontWeight: "600",
                                                        paddingRight: "20px",
                                                        [theme.breakpoints.down(
                                                          "sm"
                                                        )]: {
                                                          fontSize:
                                                            "16px !important",
                                                        },
                                                      }}
                                                    >
                                                      Destination
                                                    </Typography>
                                                    <TabsDestination
                                                      policy={policy}
                                                      datas={destinations}
                                                      policies={policies}
                                                      setPolicies={setPolicies}
                                                      selectedIndex={index}
                                                      address={address}
                                                      isEditMode={isEditMode}
                                                      setNewEditData={
                                                        setNewEditData
                                                      }
                                                      newEditData={newEditData}
                                                      editAbleData={
                                                        editAbleData
                                                      }
                                                      updateClickableRow={
                                                        updateClickableRow
                                                      }
                                                      validateRow={validateRow}
                                                      checkDisabled={
                                                        checkDisabled
                                                      }
                                                    />
                                                  </Box>
                                                </CardContent>
                                              </TabPanel>
                                              <TabPanel value="13">
                                                <CardContent
                                                  sx={{
                                                    padding: "10px !important",
                                                    position: "relative",
                                                    maxWidth: "500px",
                                                  }}
                                                >
                                                  <Box
                                                    className="list_upper_tabs"
                                                    sx={{
                                                      padding: "15px",
                                                      border: "1px solid",
                                                      borderColor:
                                                        theme.palette.grey[200],
                                                      borderRadius: "6px",
                                                    }}
                                                  >
                                                    <Typography
                                                      variant="h5"
                                                      sx={{
                                                        fontSize:
                                                          "18px !important",
                                                        fontWeight: "600",
                                                        paddingRight: "20px",
                                                        [theme.breakpoints.down(
                                                          "sm"
                                                        )]: {
                                                          fontSize:
                                                            "16px !important",
                                                        },
                                                      }}
                                                    >
                                                      Service
                                                    </Typography>
                                                    <Box
                                                      sx={{
                                                        paddingTop: "10px",
                                                      }}
                                                    >
                                                      <TextField
                                                        sx={{
                                                          "& .MuiInputBase-input":
                                                            {
                                                              paddingTop:
                                                                "6.5px",
                                                              paddingBottom:
                                                                "6.5px",
                                                            },
                                                        }}
                                                        id="input-with-icon-textfield"
                                                        placeholder="Search..."
                                                        InputProps={{
                                                          startAdornment: (
                                                            <InputAdornment position="start">
                                                              <SearchOutlinedIcon />
                                                            </InputAdornment>
                                                          ),
                                                        }}
                                                        variant="outlined"
                                                        size="small"
                                                        fullWidth
                                                        value={searchServices}
                                                        onChange={(event) => {
                                                          setSearchServices(
                                                            event.target.value
                                                          );
                                                        }}
                                                      />
                                                    </Box>
                                                    <ListCheckbox
                                                      datas={services}
                                                      type="service"
                                                      policies={policies}
                                                      setPolicies={setPolicies}
                                                      selectedIndex={index}
                                                      searchDatas={
                                                        searchServices
                                                      }
                                                      isEditMode={isEditMode}
                                                      policy={policy}
                                                      setNewEditData={
                                                        setNewEditData
                                                      }
                                                      newEditData={newEditData}
                                                      editAbleData={
                                                        editAbleData
                                                      }
                                                      updateClickableRow={(
                                                        val
                                                      ) => {
                                                        let clone =
                                                          policies.map(
                                                            (item) => {
                                                              return {
                                                                ...item,
                                                              };
                                                            }
                                                          );
                                                        updateClickableRow(
                                                          clone,
                                                          val.service,
                                                          val.editData,
                                                          index,
                                                          policy
                                                        );
                                                      }}
                                                      validateRow={validateRow}
                                                      checkDisabled={
                                                        checkDisabled
                                                      }
                                                    />
                                                  </Box>
                                                </CardContent>
                                              </TabPanel>
                                              <TabPanel value="14">
                                                <CardContent
                                                  sx={{
                                                    padding:
                                                      "20px 10px !important",
                                                    position: "relative",
                                                  }}
                                                >
                                                  <Box
                                                    sx={{
                                                      display: "flex",
                                                      alignItems: "center",
                                                      flexWrap: "wrap",
                                                    }}
                                                  >
                                                    <Typography
                                                      variant="body2"
                                                      display="inline-block"
                                                      sx={{
                                                        paddingRight: "15px",
                                                      }}
                                                    >
                                                      Action :
                                                    </Typography>
                                                    <CustomDropDown
                                                      onChange={(val) => {
                                                        let clone =
                                                          policies.map(
                                                            (item) => {
                                                              return {
                                                                ...item,
                                                              };
                                                            }
                                                          );
                                                        clone[index]["action"] =
                                                          val;

                                                        // isEditMode
                                                        // ?
                                                        updateClickableRow(
                                                          clone,
                                                          "action",
                                                          val,
                                                          index,
                                                          policy
                                                        );
                                                        // :
                                                        setPolicies(clone);
                                                      }}
                                                      options={actionOpt}
                                                      value={
                                                        policies[index][
                                                          "action"
                                                        ]
                                                      }
                                                      sx={{
                                                        width: "200px",
                                                        height: "40px",
                                                      }}
                                                      disabled={checkDisabled(
                                                        policy.policyid
                                                      )}
                                                    />
                                                  </Box>
                                                </CardContent>
                                              </TabPanel>

                                              <TabPanel value="15">
                                                <CardContent
                                                  sx={{
                                                    padding: "10px !important",
                                                    position: "relative",
                                                  }}
                                                >
                                                  <Box
                                                    sx={{
                                                      display: "flex",
                                                      alignItems: "center",
                                                      flexWrap: "wrap",
                                                    }}
                                                  >
                                                    <Typography
                                                      variant="body2"
                                                      display="inline-block"
                                                      // sx={{
                                                      //   paddingRight: "15px",
                                                      // }}
                                                    >
                                                      Web Security
                                                    </Typography>
                                                    <Checkbox
                                                      disabled={
                                                        policies[index][
                                                          "action"
                                                        ] === "deny" ||
                                                        checkDisabled(
                                                          policy.policyid
                                                        )
                                                      }
                                                      onChange={(e) => {
                                                        let clone =
                                                          policies.map(
                                                            (item) => {
                                                              return {
                                                                ...item,
                                                              };
                                                            }
                                                          );
                                                        let newV = e.target
                                                          .checked
                                                          ? "cloudfence-default"
                                                          : "";
                                                        clone[index][
                                                          "webfilter-profile"
                                                        ] = newV;
                                                        updateClickableRow(
                                                          clone,
                                                          "webfilter-profile",
                                                          newV,
                                                          index,
                                                          policy
                                                        );
                                                        setPolicies(clone);
                                                      }}
                                                      checked={
                                                        policies[index][
                                                          "webfilter-profile"
                                                        ] ===
                                                        "cloudfence-default"
                                                      }
                                                    />
                                                  </Box>
                                                </CardContent>
                                              </TabPanel>

                                              <TabPanel value="16">
                                                <CardContent
                                                  sx={{
                                                    padding: "10px !important",
                                                    position: "relative",
                                                  }}
                                                >
                                                  <Box
                                                    sx={{
                                                      display: "flex",
                                                      alignItems: "center",
                                                      flexWrap: "wrap",
                                                    }}
                                                  >
                                                    <Typography
                                                      variant="body2"
                                                      display="inline-block"
                                                      sx={{
                                                        paddingRight: "15px",
                                                      }}
                                                    >
                                                      Status :
                                                    </Typography>
                                                    <CustomDropDown
                                                      onChange={(val) => {
                                                        let clone =
                                                          policies.map(
                                                            (item) => {
                                                              return {
                                                                ...item,
                                                              };
                                                            }
                                                          );
                                                        clone[index]["status"] =
                                                          val;

                                                        updateClickableRow(
                                                          clone,
                                                          "status",
                                                          val,
                                                          index,
                                                          policy
                                                        );
                                                        setPolicies(clone);
                                                      }}
                                                      options={statusOpt}
                                                      value={
                                                        policies[index][
                                                          "status"
                                                        ]
                                                      }
                                                      sx={{
                                                        width: "200px",
                                                        height: "40px",
                                                      }}
                                                      disabled={checkDisabled(
                                                        policy.policyid
                                                      )}
                                                    />
                                                  </Box>
                                                </CardContent>
                                              </TabPanel>

                                              <TabPanel value="17">
                                                <CardContent
                                                  sx={{
                                                    padding: "10px !important",
                                                    position: "relative",
                                                  }}
                                                >
                                                  <Box
                                                    sx={{
                                                      display: "flex",
                                                      alignItems: "center",
                                                      flexWrap: "wrap",
                                                    }}
                                                  >
                                                    <Typography
                                                      variant="body2"
                                                      display="inline-block"
                                                      sx={{
                                                        paddingRight: "15px",
                                                      }}
                                                    >
                                                      Log Traffic :
                                                    </Typography>
                                                    <CustomDropDown
                                                      onChange={(val) => {
                                                        let clone =
                                                          policies.map(
                                                            (item) => {
                                                              return {
                                                                ...item,
                                                              };
                                                            }
                                                          );
                                                        clone[index][
                                                          "logtraffic"
                                                        ] = val;

                                                        // isEditMode
                                                        //   ?
                                                        updateClickableRow(
                                                          clone,
                                                          "logtraffic",
                                                          val,
                                                          index,
                                                          policy
                                                        );
                                                        setPolicies(clone);
                                                      }}
                                                      options={logOpt}
                                                      value={
                                                        policies[index][
                                                          "logtraffic"
                                                        ]
                                                      }
                                                      sx={{
                                                        width: "200px",
                                                        height: "40px",
                                                      }}
                                                      disabled={checkDisabled(
                                                        policy.policyid
                                                      )}
                                                    />
                                                  </Box>
                                                </CardContent>
                                              </TabPanel>
                                            </TabContext>
                                          </Box>
                                          {/* tabs ends */}
                                        </Card>
                                      </Grid>
                                    </Grid>
                                  </Box>
                                </Collapse>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </BasicTableStyle>
        </Box>
        {openDelete && (
          <ConfirmationDialog
            open={openDelete}
            handleClose={handleCloseDelete}
            handleOldData={deletePoliciesData}
            buttonType="delete"
            comingForm="policy"
          />
        )}
        <ConfirmationDialog
          open={openModel}
          handleClose={() => setOpenModel(false)}
          handleOldData={closePoliciesDatas}
          handleNewData={
            validateRow?.length ? editPoliciesDatas : createPoliciesDatas
          }
          buttonType={isOpenBtn}
          comingForm="policy"
        />
      </Card>
    </>
  );
};

export default SecurityPoliciesTable;
