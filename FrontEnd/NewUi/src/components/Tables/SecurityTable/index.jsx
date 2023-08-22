import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import Loader from "src/components/Loader";
import { securityProfile } from "utils/apis/routes/security";
import { toast } from "react-toastify";
import ConfirmationDialog from "src/components/Modals/confirmationDialog";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
// import IconButton from "@mui/material/IconButton";
// import CheckIcon from "@mui/icons-material/Check";
import { getCookie } from "cookies-next";
import CustomLoader from "src/components/Loader/CustomLoader";

const SecurityTable = ({
  security,
  setSecurity,
  loaderShow,
  setLoaderShow,
  selectActivity,
}) => {
  const [open, setOpen] = useState([]);
  const [openAllowBlock, setOpenAllowBlock] = useState(false);
  const [groups, setGroups] = useState([]);
  const [checkSelected, setCheckSelected] = useState([]);
  const [selectedRow, setSelectedRow] = useState({});
  const [actionButton, setActionButton] = useState("");
  const [updateAction, setUpdateAction] = useState([]);

  const theme = useTheme();
  const userId = getCookie("userId");

  const handleAction = (button) => {
    setActionButton(button);
    setOpenAllowBlock(true);
  };

  const handleOldData = () => {
    setGroups(security);
    setCheckSelected(selectedRow);
    setUpdateAction([]);
  };

  const handleNewData = async () => {
    try {
      const requestData = {
        userId: userId,
        deploymentId: selectActivity.id,
        connectorId: selectActivity.StackConnector[0].connectorId,
        secretManagerRegion: selectActivity.user.secretManagerRegion,
        securityType: "secure_nat_gw",
        profileType: "web",
        eventType: "put",
        data: updateAction,
      };
      const data = await securityProfile(requestData);
      if (data.data.data) {
        setSecurity(data.data.data.groups);
        setCheckSelected(selectedRow);
        setUpdateAction([]);
        return data.data;
      }
    } catch (err) {
      handleClose();
      toast.error(
        err?.response?.data?.error || err?.message || "something went wrong"
      );
      return;
    }
  };

  const handleUpdateAction = (button) => {
    let updateActionData = [];
    const temp = [];
    groups.map((item) => {
      temp.push(item);
    });
    const mapped = temp.map((data) => {
      let selectedData = [];
      if (checkSelected[data.id]) {
        selectedData = checkSelected[data.id];
      }
      return {
        ...data,
        categories: data.categories.map((category) => {
          let buttonAction = category.action;
          if (selectedData.includes(category.id)) {
            buttonAction = button;
            updateActionData.push({
              id: category.id,
              action: buttonAction,
            });
          }
          return { ...category, action: buttonAction };
        }),
      };
    });
    setGroups(mapped);
    setUpdateAction((prev) => {
      return [...prev, ...updateActionData];
    });
    // setCheckSelected(selectedRow);
  };

  const columns = [
    { field: "", headerName: "Id" },
    {
      field: "category",
      headerName: "Category",
      renderCell: (params) => {
        return (
          <Box
            className="truncate"
            sx={{
              fontSize: "13px",
              fontWeight: "500",
              color: theme.palette.text.primary,
            }}
          >
            {params.value}
          </Box>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      renderCell: (params) => {
        return (
          <Box
            className="listing_group "
            sx={{
              "& .MuiSvgIcon-root": {
                fontSize: "14px !important",
                lineHeight: "1",
                marginLeft: "0px !important",
              },
            }}
          >
            <Chip
              size="small"
              variant="text"
              icon={
                params.value === "monitor" ? (
                  <CheckCircleIcon color="success" />
                ) : (
                  <BlockIcon color="error" />
                )
              }
              label={params.value === "monitor" ? "Allow" : "Block"}
              sx={{
                backgroundColor: "transparent",
                borderRadius: "0px",
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
            />
          </Box>
        );
      },
    },
  ];

  const handleClick = (id) => {
    if (open.includes(id)) {
      const temp = open.filter((data) => data !== id);
      setOpen(temp);
      return;
    }
    setOpen([...open, id]);
  };

  const handleClose = () => {
    setOpenAllowBlock(false);
  };

  useEffect(() => {
    if (security) {
      setGroups([...security]);
      // setLoaderShow(false);
    }
  }, [security]);

  useEffect(() => {
    let groupIds = {};
    groups.map((item) => {
      groupIds[item.id] = [];
    });
    setSelectedRow(groupIds);
  }, [groups]);

  return (
    <>
      <Card sx={{ marginTop: "0px" }}>
        {groups.length ? (
          <Box
            sx={{
              padding: "10px",
            }}
          >
            <Box
              className="icon_td"
              sx={{
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
                <Chip
                  size="small"
                  label="Allow"
                  color="success"
                  sx={{
                    borderRadius: "3px",
                    minWidth: "60px",
                    cursor: "pointer",
                  }}
                  disabled={
                    Object.values(checkSelected)?.every(
                      (item) => item.length == 0
                    )
                      ? true
                      : false
                  }
                  onClick={() => handleUpdateAction("monitor")}
                />
                <Chip
                  size="small"
                  label="Block"
                  color="error"
                  sx={{
                    borderRadius: "3px",
                    minWidth: "60px",
                    cursor: "pointer",
                  }}
                  disabled={
                    Object.values(checkSelected).every(
                      (item) => item.length == 0
                    )
                      ? true
                      : false
                  }
                  onClick={() => handleUpdateAction("block")}
                />
              </Stack>
            </Box>
          </Box>
        ) : null}
        <Box className="table_material_inner table_collapse_allow">
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
              "& .MuiTable-root thead tr th .MuiButtonBase-root .MuiSvgIcon-root":
                {
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

              "& .cstm_datatable .MuiDataGrid-footerContainer": {
                display: "none",
              },
              "& .cstm_datatable .MuiDataGrid-columnHeaders": {
                display: "none",
              },
              "& .cstm_datatable": {
                border: "none",
                borderRadius: "0px",
              },
              "& .cstm_datatable .MuiDataGrid-cellContent": {
                fontSize: "13px",
                color: theme.palette.text.primary,
                fontSize: "13px",
                fontWeight: "500",
              },
              "& .cstm_datatable .MuiDataGrid-cellCheckbox": {
                display: "none",
              },
              "& .cstm_datatable .MuiDataGrid-cell": {
                minHeight: "26px !important",
                maxHeight: "initial !important",
                border: "none",
              },
              "& .cstm_datatable .MuiDataGrid-row": {
                minHeight: "26px !important",
                maxHeight: "26px",
              },

              "& .cstm_datatable .MuiDataGrid-footerContainer": {
                display: "none",
              },
              "& .cstm_datatable .MuiDataGrid-columnHeaders": {
                display: "none",
              },
              "& .cstm_datatable": {
                border: "none",
                borderRadius: "0px",
              },
              "& .cstm_datatable .MuiDataGrid-cellContent": {
                fontSize: "13px",
                color: theme.palette.text.primary,
                fontSize: "13px",
                fontWeight: "500",
              },
              "& .cstm_datatable .MuiDataGrid-cellCheckbox": {
                display: "none",
              },
              "& .cstm_datatable .MuiDataGrid-cell": {
                minHeight: "26px !important",
                maxHeight: "initial !important",
                border: "none",
                cursor: "default",
              },
              "& .cstm_datatable .MuiDataGrid-row": {
                minHeight: "initial !important",
                maxHeight: "initial",
              },

              "& .cstm_checktable_bx thead tr th:first-of-type": {
                minWidth: "150px",
                width: "350px",
                [theme.breakpoints.down("md")]: {
                  width: "240px",
                },
                [theme.breakpoints.down("sm")]: {
                  minWidth: "150px",
                  width: "150px",
                },
                [theme.breakpoints.up("1400")]: {
                  width: "400px",
                },
              },
              "& .cstm_checktable_bx thead tr th:last-child": {
                minWidth: "100px",
                width: "220px",
                maxWidth: "100% !important",
                [theme.breakpoints.down("md")]: {
                  width: "150px",
                },
                [theme.breakpoints.down("sm")]: {
                  minWidth: "90px",
                  width: "90px",
                },
                [theme.breakpoints.up("1400")]: {
                  width: "30%",
                },
                [theme.breakpoints.up("1600")]: {
                  width: "35%",
                },
              },
              "& .cstm_datatable .MuiDataGrid-row .MuiDataGrid-cell:nth-of-type(2)":
                {
                  minWidth: "150px",
                  width: "350px",
                  maxWidth: "100% !important",
                  flex: "0 0 auto",
                  [theme.breakpoints.down("md")]: {
                    width: "240px",
                  },
                  [theme.breakpoints.down("sm")]: {
                    width: "150px",
                  },
                  [theme.breakpoints.up("1400")]: {
                    width: "400px",
                  },
                },
              "& .cstm_checktable_bx .td_one": {
                [theme.breakpoints.down("md")]: {
                  maxWidth: "240px",
                },
                [theme.breakpoints.down("sm")]: {
                  maxWidth: "150px",
                },
              },

              "& .cstm_datatable .MuiDataGrid-row .MuiDataGrid-cell:nth-of-type(4)":
                {
                  minWidth: "100px",
                  width: "220px",
                  maxWidth: "100% !important",
                  flex: "0 0 auto",
                  [theme.breakpoints.down("md")]: {
                    width: "150px",
                  },
                  [theme.breakpoints.down("sm")]: {
                    width: "90px",
                  },
                  [theme.breakpoints.up("1400")]: {
                    width: "30%",
                  },
                  [theme.breakpoints.up("1600")]: {
                    width: "35%",
                  },
                },
              "& .cstm_datatable .MuiDataGrid-row .MuiDataGrid-cell:nth-of-type(3)":
                {
                  minWidth: "100px",
                  width: "100%",
                  maxWidth: "100% !important",
                },
              "& .cstm_datatable .MuiDataGrid-row .MuiDataGrid-cell:nth-of-type(3) .truncate ":
                {
                  [theme.breakpoints.down("sm")]: {
                    maxWidth: "240px !important",
                  },
                },

              "& .cstm_datatable .MuiDataGrid-row .MuiDataGrid-cell:last-child":
                {
                  display: "none",
                },
              "& .cstm_datatable .MuiDataGrid-row .MuiDataGrid-cell": {
                paddingLeft: "8px",
                paddingRight: "8px",
              },
              "& .cstm_datatable .MuiDataGrid-virtualScrollerRenderZone": {
                width: "100%",
                position: "relative",
                maxHeight: "3000px",
                overflowY: "auto",
              },
              "& .cstm_datatable .MuiDataGrid-virtualScrollerContent": {
                height: "auto !important",
              },

              "& .cstm_datatable .MuiDataGrid-virtualScrollerRenderZone .MuiDataGrid-row":
                {
                  width: "100%",
                },

              "& .cstm_datatable .MuiDataGrid-cell:focus": {
                outline: "none !important",
              },
              "& .cstm_datatable .MuiDataGrid-cell:focus-within": {
                outline: "none !important",
              },
              "& .cstm_datatable .MuiDataGrid-row:hover": {
                backgroundColor: "transparent",
              },
              "& .cstm_datatable .MuiDataGrid-row.Mui-selected": {
                backgroundColor: "transparent",
              },
              "& .cstm_datatable .MuiDataGrid-row.Mui-selected:hover": {
                backgroundColor: "transparent",
              },
              "& .cstm_datatable .MuiDataGrid-row.Mui-selected .MuiDataGrid-cell":
                {
                  backgroundColor: theme.palette.background.allowbg,
                  borderBottom: "1px solid",
                  borderColor: theme.palette.background.bdrline,
                },
              "& .cstm_datatable .MuiDataGrid-row.Mui-selected .MuiDataGrid-cell:nth-of-type(2)":
                {
                  backgroundColor: "transparent",
                  borderBottom: "none",
                },
            }}
          >
            {loaderShow ? (
              <CustomLoader minHeight="60vh" />
            ) : (
              <TableContainer
                className="cstm_checktable_bx"
                sx={{
                  height: "calc(100vh - 240px)",
                  [theme.breakpoints.down("sm")]: {
                    height: "calc(100vh - 300px)",
                  },
                }}
              >
                <Table
                  stickyHeader
                  aria-label="sticky table"
                  sx={{
                    "& .MuiTableCell-head": {
                      whiteSpace: "nowrap",
                      paddingLeft: "8px",
                      paddingRight: "8px",
                    },
                    "& .MuiTableCell-body": {
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
                  }}
                >
                  <TableHead>
                    <TableRow>
                      {/* <TableCell>#</TableCell> */}
                      <TableCell className="th_one">Name</TableCell>
                      <TableCell className="th_two">Web Categories</TableCell>
                      <TableCell className="th_three">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody
                    hover="true"
                    role="checkbox"
                    tabIndex={-1}
                    className="nowrap_bx"
                  >
                    {!groups?.length ? (
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
                            No Data Found
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : (
                      groups?.map((group, index) => {
                        return (
                          <React.Fragment key={index}>
                            <TableRow
                              hover
                              sx={{
                                "&:last-of-type td, &:last-of-type th": {
                                  border: 0,
                                },
                              }}
                              key={index}
                            >
                              {/* <TableCell>
                              <Box
                                className="icon_td px_8"
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  lineHeight: "24px",
                                  minHeight: "24px",
                                  cursor: "pointer",
                                }}
                              >
                                <Box
                                  className="truncate"
                                  sx={{ width: "auto !important" }}
                                >
                                  {group?.id}
                                </Box>
                              </Box>
                            </TableCell> */}
                              <TableCell className="td_one">
                                <Box
                                  className="icon_td px_8"
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    lineHeight: "24px",
                                    minHeight: "24px",
                                  }}
                                >
                                  <Box
                                    className="truncate"
                                    sx={{ width: "auto !important" }}
                                  >
                                    {group?.name}
                                  </Box>
                                </Box>
                              </TableCell>
                              <TableCell className="td_two">
                                <Box
                                  className="icon_td px_8"
                                  sx={{
                                    display: "inline-flex !important",
                                    alignItems: "center",
                                    lineHeight: "24px",
                                    minHeight: "24px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleClick(group?.id)}
                                >
                                  <Box
                                    className="flag_icon"
                                    sx={{
                                      display: "flex",
                                      marginRight: "4px",
                                    }}
                                  >
                                    <FormatListBulletedIcon
                                      sx={{
                                        fontSize: "16px",
                                        marginRight: "10px",
                                      }}
                                    ></FormatListBulletedIcon>
                                  </Box>
                                  <Box
                                    className="truncate"
                                    sx={{
                                      width: "auto !important",
                                      paddingRight: "5px",
                                    }}
                                  >
                                    Web Categories{" "}
                                    <Typography
                                      variant="body2"
                                      display="inline-block"
                                      gutterBottom
                                      sx={{
                                        marginBottom: "0px",
                                        fontSize: "10px",
                                        fontWeight: "700",
                                        color: theme.palette.primary.main,
                                      }}
                                    >
                                      ({group?.categories?.length})
                                    </Typography>
                                  </Box>
                                </Box>
                              </TableCell>
                              <TableCell className="td_three">
                                {/* {open && (
                          <Box
                            className="icon_td px_8"
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
                            ></Box>
                            <Stack direction="row" spacing={1}>
                              <Chip
                                size="small"
                                label="Allow"
                                color="success"
                                sx={{
                                  borderRadius: "3px",
                                }}
                                disabled={
                                  Object.values(checkSelected).every(
                    (item) => item.length == 0
                  ) ? true : false
                                }
                                onClick={() => handleAction("monitor")}
                              />
                              <Chip
                                size="small"
                                label="Block"
                                color="error"
                                sx={{
                                  borderRadius: "3px",
                                }}
                                disabled={
                                  Object.values(checkSelected).every(
                    (item) => item.length == 0
                  ) ? true : false
                                }
                                onClick={() => handleAction("block")}
                              />
                            </Stack>
                          </Box>
                        )} */}
                                {/* <Box
                                className="icon_td action_btnicon"
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  lineHeight: "1",
                                  "& .MuiSvgIcon-root": {
                                    marginRight: "0px !important",
                                    width: "16px!important",
                                  },
                                }}
                              >
                                <IconButton
                                  color="success"
                                  aria-label="add an alarm"
                                  sx={{
                                    backgroundColor: "rgba(86, 202, 0, 0.08)",
                                    marginRight: "5px",
                                    padding: "4px",
                                  }}
                                  disabled={
                                    Object.values(checkSelected)?.every(
                                      (item) => item.length == 0
                                    )
                                      ? true
                                      : false
                                  }
                                  onClick={() => handleUpdateAction("monitor")}
                                >
                                  <CheckIcon />
                                </IconButton>
                                <IconButton
                                  color="error"
                                  aria-label="add to shopping cart"
                                  sx={{
                                    backgroundColor: "rgba(255, 76, 81, 0.08)",
                                    padding: "4px",
                                  }}
                                  disabled={
                                    Object.values(checkSelected).every(
                                      (item) => item.length == 0
                                    )
                                      ? true
                                      : false
                                  }
                                  onClick={() => handleUpdateAction("block")}
                                >
                                  <BlockIcon />
                                </IconButton>
                              </Box> */}
                              </TableCell>
                            </TableRow>
                            {open.includes(group?.id) && (
                              <TableRow>
                                <TableCell colSpan={3}>
                                  <DataGrid
                                    className="cstm_datatable"
                                    rows={group?.categories || []}
                                    columns={columns}
                                    autoHeight={true}
                                    initialState={{
                                      pagination: null,
                                    }}
                                    pageSizeOptions={null}
                                    hideFooterPagination={true}
                                    checkboxSelection
                                    onRowSelectionModelChange={(
                                      newSelectionModel
                                    ) => {
                                      setCheckSelected((prev) => {
                                        return {
                                          ...prev,
                                          [group.id]: newSelectionModel,
                                        };
                                      });
                                    }}
                                    rowSelectionModel={checkSelected[group.id]}
                                  />
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
            )}
          </Box>
        </Box>
      </Card>
      {groups.length ? (
        <Box
          sx={{
            padding: "20px 0 0 0",
          }}
        >
          <Box
            className="icon_td"
            sx={{
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
                size="small"
                variant="contained"
                sx={{
                  minWidth: "84px",
                }}
                disabled={updateAction?.length === 0 ? true : false}
                onClick={() => handleAction("ok")}
              >
                Apply
              </Button>
              <Button
                size="small"
                variant="outlined"
                sx={{
                  minWidth: "84px",
                  marginLeft: "10px !important",
                }}
                disabled={updateAction?.length === 0 ? true : false}
                onClick={() => handleAction("cancel")}
              >
                Cancel
              </Button>
            </Stack>
          </Box>
        </Box>
      ) : null}
      <ConfirmationDialog
        open={openAllowBlock}
        handleClose={handleClose}
        handleOldData={handleOldData}
        handleNewData={handleNewData}
        buttonType={actionButton}
      />
    </>
  );
};

export default SecurityTable;
