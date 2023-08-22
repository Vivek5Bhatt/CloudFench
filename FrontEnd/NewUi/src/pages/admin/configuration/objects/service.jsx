import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import CardSettings from "src/theme/components/card-statistics/card-stats-vertical/card-settings";
import FormService from "src/components/Modals/forms/service";
import { useMemo } from "react";
import { MaterialReactTable } from "material-react-table";
import Card from "@mui/material/Card";
import {
  cloudConnectorPolicy,
  cloudConnector,
  deleteCloudConnector,
} from "utils/apis/routes/settings";
import { toast } from "react-toastify";
import IconButton from "@mui/material/IconButton";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ConfirmationDialog from "src/components/Modals/confirmationDialog";

const Settings = () => {
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [formType, setFormType] = useState("");
  const [loaderShow, setLoaderShow] = useState(false);
  const [serviceType, setServiceType] = useState("");
  const [serviceData, setServiceData] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState();

  const theme = useTheme();

  const handleOpen = (type) => {
    setOpen(true);
    setLoaderShow(true);
  };

  const handleCloseDelete = () => setOpenDelete(false);

  const handleClose = () => setOpen(false);

  const handleDeleteService = async (id) => {
    setSelectedServiceId(id);
    setOpenDelete(true);
  };

  const handleEditService = (id, type) => {
    setSelectedServiceId(id);
    setOpen(true);
    setLoaderShow(true);
  };

  //should be memoized or stable
  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        size: 150,
        Cell: ({ renderedCellValue }) => <Box className="truncate">HTTP</Box>,
      },
      {
        accessorKey: "cloud",
        header: "Details",
        size: 150,
        Cell: ({ renderedCellValue }) => <Box className="truncate">TCP/80</Box>,
      },
      {
        accessorKey: "accessKey",
        header: "Protocol",
        size: 200,
        Cell: ({ renderedCellValue }) => <Box className="truncate">TCP</Box>,
      },
      {
        accessorKey: "accountId",
        header: "Type",
        size: 150,
        Cell: ({ renderedCellValue }) => (
          <Box className="truncate">Predefined</Box>
        ),
      },
      {
        accessorKey: "status",
        header: "Description",
        size: 150,
        Cell: ({ renderedCellValue }) => <Box className="truncate">WEB</Box>,
      },
      {
        accessorKey: "id",
        header: "Action",
        size: 150,
        Cell: ({ row }) => (
          <Box
            className="icon_td"
            sx={{
              display: "flex",
              alignItems: "center",
              lineHeight: "1",
            }}
          >
            <IconButton
              color="success"
              aria-label="add an alarm"
              sx={{
                backgroundColor: "rgba(86, 202, 0, 0.08)",
                marginRight: "5px",
                padding: "6px",
              }}
              onClick={() => {
                setServiceType(row.original.cloud);
                handleEditService(row.original.id, row.original.cloud);
                setFormType("edit");
              }}
            >
              <EditOutlinedIcon sx={{ fontSize: "20px" }} />
            </IconButton>
            <IconButton
              color="error"
              aria-label="add to shopping cart"
              sx={{
                backgroundColor: "rgba(255, 76, 81, 0.08)",
                padding: "6px",
              }}
              // disabled={Boolean(row.original.StackConnector?.length)}
              onClick={() => handleDeleteService(row.original.id)}
            >
              <DeleteOutlineOutlinedIcon sx={{ fontSize: "20px" }} />
            </IconButton>
          </Box>
        ),
      },
    ],
    []
  );

  const handleServiceData = async () => {
    try {
      setLoaderShow(true);
      const data = await cloudConnector();
      const serviceData = data.data;
      let dataService = [];
      if (serviceData) {
        for (let i = 0; i < serviceData.length; i++) {
          dataService.push({ ...serviceData[i] });
        }
        setServiceData(dataService);
        setLoaderShow(false);
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.error || err?.message || "something went wrong"
      );
      return;
    }
  };

  const handleDelete = async () => {
    try {
      const data = await deleteCloudConnector(selectedServiceId);
      if (data.data && data.status === 200) {
        const updatedService = serviceData.filter(
          (service) => service.id !== selectedServiceId
        );
        setConnectorData([...updatedService]);
        toast.success(data.data.message);
        handleClose();
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.error || err?.message || "something went wrong"
      );
      return;
    }
  };

  useEffect(() => {
    handleServiceData();
  }, []);

  return (
    <>
      <Box className="main_setting_bx">
        <Grid item xs={12}>
          <Grid container spacing={{ xs: 3, md: 6 }}>
            <Grid item xs={6} md={4}>
              <Box
                onClick={() => {
                  handleOpen("aws");
                  setFormType("add");
                }}
                sx={{
                  cursor: "pointer",
                }}
              >
                <CardSettings
                  icon="/images/logos/tcp.png"
                  color="success"
                  title="TCP/UDP Service"
                  classBox="bg_box1"
                />
              </Box>
            </Grid>
            <Grid item xs={6} md={4}>
              <Box
                onClick={() => {
                  handleOpen("aws");
                  setFormType("add");
                }}
                sx={{
                  cursor: "pointer",
                }}
              >
                <CardSettings
                  icon="/images/logos/network_icon.png"
                  color="secondary"
                  title="ICMP Service"
                  classBox="bg_box2"
                />
              </Box>
            </Grid>
            <Grid item xs={6} md={4}>
              <Box
                onClick={() => {
                  handleOpen("aws");
                  setFormType("add");
                }}
                sx={{
                  cursor: "pointer",
                }}
              >
                <CardSettings
                  icon="/images/logos/ip-address.svg"
                  color="secondary"
                  title="IP Service"
                  classBox="bg_box3"
                />
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <FormService
        open={open}
        handleClose={handleClose}
        selectedServiceId={selectedServiceId}
        serviceType={serviceType}
        setServiceData={setServiceData}
        serviceData={serviceData}
        loaderShow={loaderShow}
        formType={formType}
      ></FormService>
      <ConfirmationDialog
        open={openDelete}
        handleClose={handleCloseDelete}
        handleOldData={handleDelete}
        buttonType="delete"
      />
      <Card sx={{ marginTop: "30px" }}>
        <Box className="table_material_inner">
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
            <MaterialReactTable
              columns={columns}
              data={serviceData}
              enableStickyFooter={true}
              enableTopToolbar={false}
              enableStickyHeader={true}
              enableColumnResizing={true}
              enableMultiRowSelection={false}
              enableFullScreenToggle={false} // hide fullScreen
              enableDensityToggle={false} // disble density
              enableGlobalFilter={false} // hide search section
              enableColumnFilters={false} // hide column filter icon
              enableColumnActions={false}
              columnFilterModeOptions={false}
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
        </Box>
      </Card>
    </>
  );
};

export default Settings;
