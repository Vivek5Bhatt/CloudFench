import { useEffect, useMemo, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import { useTheme } from "@mui/material/styles";
import { toast } from "react-toastify";
import { deploymentsDefault } from "utils/apis/routes/monitorLogs";
import CustomLoader from "src/components/Loader/CustomLoader";
import { IconButton, Typography } from "@mui/material";
import DeployStack from "../deployStack";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AwsIcon from "public/images/awsimg/aws.svg";
import Image from "next/image";
import DeleteIcon from "@mui/icons-material/Delete";
import CustomConfirm from "src/components/Modals/confirmModal";
import { deleteDeployedStack } from "utils/apis/routes/settings";
import Socket from "src/components/Socket/Socket";
import { getFormatedDate, useCaseServiceName } from "utils/commonFunctions";
import ErrorIcon from "@mui/icons-material/Error";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

const MaterialBasicTable = (props) => {
  const { stackOpen, setStackOpen } = props || {};
  const [deployList, setDeployList] = useState([]);
  const [loader, setLoader] = useState(true);
  const [selectedDelete, setSelectedDelete] = useState({});
  const [openD, setOpenD] = useState(false);
  const [deleteLoader, setDeleteLoader] = useState(false);

  const getDeplouments = async () => {
    try {
      const data = await deploymentsDefault();
      if (data?.data) {
        setDeployList(data?.data);
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
  useEffect(() => {
    getDeplouments();
  }, []);

  const handleProgress = (data) => {
    if (data) {
      setDeployList((prev) => {
        let mapped = prev.map((item) => {
          if (item.id === data.id) {
            return {
              ...item,
              progress: data.progress,
            };
          } else {
            return item;
          }
        });
        return mapped;
      });
    }
  };

  const theme = useTheme();
  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        size: 150,
        Cell: ({ cell }) => (
          <Box>
            <Image src={AwsIcon} alt="aws icon" width={18} />{" "}
            {cell.row.original.name}
          </Box>
        ),
      },
      {
        accessorKey: "region",
        header: "Region",
        size: 200,
      },
      {
        accessorKey: "instance",
        header: "Size",
        size: 200,
        Cell: ({ cell }) =>
          cell?.row?.original.instance === "c6i.large"
            ? "Very Small"
            : " Small",
      },
      {
        accessorKey: "instance",
        header: "UseCase",
        size: 200,
        Cell: ({ cell }) => {
          var filtered = Object.keys(cell?.row?.original.services).filter(
            (key) => {
              return cell?.row?.original?.services[key];
            }
          );

          let newVal = filtered.map((filter, key) => {
            return (
              <Typography
                key={key}
                sx={{
                  color: "rgba(58, 53, 65, 0.87)",
                  fontSize: "13px",
                  fontWeight: 500,
                }}
              >
                {useCaseServiceName[filter]}
              </Typography>
            );
          });
          return newVal;
        },
      },
      {
        accessorKey: "progressStep",
        header: "Status",
        size: 200,
        Cell: ({ cell }) => {
          return (
            <div>
              <Box>
                <ul className="progres_listingbx">
                  {(cell?.row?.original.progress === "success" ||
                    cell?.row?.original.progress === "destroyed") && (
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
                        {cell?.row?.original.progress}
                      </span>
                    </li>
                  )}

                  {(cell?.row?.original.progress === "initializing" ||
                    cell?.row?.original.progress === "destroying" ||
                    cell?.row?.original.progress === "provisioning") && (
                    <li>
                      <span className="iconbx progress_circle">
                        <CircularProgress sx={{ color: "#a6a6a6" }} />
                      </span>
                      <span
                        className="tex_progres"
                        style={{ textTransform: "capitalize" }}
                      >
                        {cell?.row?.original.progress}
                      </span>
                    </li>
                  )}
                  {cell?.row?.original.progress === "error" && (
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
                        {cell?.row?.original.progress}
                      </span>
                    </li>
                  )}
                </ul>
              </Box>
            </div>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Creation Date",
        size: 150,
        Cell: ({ cell }) =>
          getFormatedDate(cell?.row.original.createdAt, "ddd MMM DD yyyy"),
      },
      {
        accessorKey: "action",
        header: "Action",
        size: 150,
        Cell: ({ cell }) => (
          <Box>
            {cell?.row?.original.progress === "success" && (
              <IconButton
                color="error"
                aria-label="add to shopping cart"
                sx={{
                  backgroundColor: "rgba(255, 76, 81, 0.08)",
                  padding: "6px",
                }}
                onClick={(event) => {
                  setOpenD(true);
                  setSelectedDelete(cell?.row?.original);
                }}
              >
                <DeleteOutlineOutlinedIcon sx={{ fontSize: "18px" }} />
              </IconButton>
              // <IconButton
              //   size="small"
              //   className="card-more-options"
              //   onClick={(event) => {
              //     setOpenD(true);
              //     setSelectedDelete(cell?.row?.original);
              //   }}
              //   sx={{
              //     color: "text.secondary",
              //     width: "30px",
              //     height: "30px",
              //     backgroundColor: theme.palette.background.policiesicon,
              //     display: "flex",
              //     alignItems: "center",
              //     justifyContent: "center",
              //     "& .MuiSvgIcon-root": {
              //       fontSize: "18px",
              //     },
              //   }}
              // >
              //   <DeleteIcon />
              // </IconButton>
            )}
          </Box>
        ),
      },
    ],
    []
  );

  const handleDelete = async () => {
    // setLoader(true);
    setDeleteLoader(true);
    const res = await deleteDeployedStack(selectedDelete.id);

    if (res) {
      getDeplouments();
      setOpenD(false);
      setDeleteLoader(false);
    }
  };

  return (
    <>
      <Socket on="progress" callback={handleProgress} />
      <Card>
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
                "&.newbox .MuiPaper-root > .MuiToolbar-root": {
                  minHeight: "12px",
                },
              }}
            >
              <MaterialReactTable
                columns={columns}
                data={deployList}
                enableStickyFooter={{ first: true }}
                enableStickyHeader={{ first: true }}
                enableHiding={false}
                enableColumnResizing={{ first: true }}
                enableMultiRowSelection={false}
                enableFullScreenToggle={false} // hide fullScreen
                enableDensityToggle={false} // disble density
                enableGlobalFilter={false} // hide search section
                enableColumnFilters={false} // hide column filter icon
                enableColumnActions={false}
                columnFilterModeOptions={false}
                enableColumnVirtualization={false}
                className="material_tablebx"
                renderEmptyRowsFallback={({ table }) => {
                  return (
                    <Box
                      sx={{
                        position: "relative",
                        minHeight: "100px",
                        display: "flex",
                        alignItems: "center",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        paddingLeft: "20px",

                        "& .cstm_loaderbx": {
                          alignItems: "center",
                        },
                      }}
                    >
                      No Data Found
                    </Box>
                  );
                }}
              />
            </Box>
          ) : (
            <CustomLoader />
          )}
        </Box>
        {stackOpen && (
          <DeployStack
            open={stackOpen.open}
            onClose={() => setStackOpen({ ...stackOpen, open: false })}
            stackOpen={stackOpen}
            setStackOpen={setStackOpen}
            getDeplouments={getDeplouments}
          />
        )}
        {openD && (
          <CustomConfirm
            open={openD}
            handleClose={() => setOpenD(false)}
            apiCall={() => handleDelete()}
            label="Do you want to delete this Stack?"
            loader={deleteLoader}
          />
        )}
      </Card>
    </>
  );
};

export default MaterialBasicTable;
