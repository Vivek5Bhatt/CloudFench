import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import CardSettings from "src/theme/components/card-statistics/card-stats-vertical/card-settings";
import FormAddress from "src/components/Modals/forms/address";
import { useMemo } from "react";
import { MaterialReactTable } from "material-react-table";
import Card from "@mui/material/Card";
import {
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
  const [addressType, setAddressType] = useState("");
  const [addressData, setAddressData] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState();

  const theme = useTheme();

  const handleOpen = (type) => {
    setOpen(true);
    setLoaderShow(true);
  };

  const handleCloseDelete = () => setOpenDelete(false);

  const handleClose = () => setOpen(false);

  const handleDeleteAddress = async (id) => {
    setSelectedAddressId(id);
    setOpenDelete(true);
  };

  const handleEditAddress = (id, type) => {
    setSelectedAddressId(id);
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
        Cell: ({ renderedCellValue }) => <Box className="truncate">name</Box>,
      },
      {
        accessorKey: "cloud",
        header: "Details",
        size: 150,
        Cell: ({ renderedCellValue }) => (
          <Box className="truncate">details</Box>
        ),
      },
      {
        accessorKey: "accessKey",
        header: "Type",
        size: 200,
        Cell: ({ renderedCellValue }) => <Box className="truncate">type</Box>,
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
                setAddressType(row.original.cloud);
                handleEditAddress(row.original.id, row.original.cloud);
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
              onClick={() => handleDeleteAddress(row.original.id)}
            >
              <DeleteOutlineOutlinedIcon sx={{ fontSize: "20px" }} />
            </IconButton>
          </Box>
        ),
      },
    ],
    []
  );

  const handleAddressData = async () => {
    try {
      setLoaderShow(true);
      const data = await cloudConnector();
      const addressData = data.data;
      let dataAddress = [];
      if (addressData) {
        for (let i = 0; i < addressData.length; i++) {
          dataAddress.push({ ...addressData[i] });
        }
        setAddressData(dataAddress);
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
      const data = await deleteCloudConnector(selectedConnectorId);
      if (data.data && data.status === 200) {
        const updatedConnectors = connectorData.filter(
          (connector) => connector.id !== selectedConnectorId
        );
        setConnectorData([...updatedConnectors]);
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
    handleAddressData();
  }, []);

  return (
    <>
      <Box className="main_setting_bx">
        <Grid item xs={12}>
          <Grid container spacing={{ xs: 3, md: 6 }}>
            <Grid item xs={6} md={6}>
              <Box
                onClick={() => {
                  setAddressType("address");
                  handleOpen("address");
                  setFormType("add");
                }}
                sx={{
                  cursor: "pointer",
                }}
              >
                <CardSettings
                  icon="/images/logos/ip-address.svg"
                  color="secondary"
                  title="Address Object"
                  classBox="bg_box1"
                />
              </Box>
            </Grid>
            <Grid item xs={6} md={6}>
              {/* <Box
                onClick={() => {
                  setAddressType("geography");
                  handleOpen("geography");
                  setFormType("add");
                }}
                sx={{
                  cursor: "pointer",
                }}
              > */}
              <CardSettings
                icon="/images/logos/network_icon.png"
                color="success"
                title="Geography Object"
                classBox="bg_box2"
              />
              {/* </Box> */}
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <FormAddress
        open={open}
        handleClose={handleClose}
        selectedAddressId={selectedAddressId}
        addressType={addressType}
        setAddressData={setAddressData}
        addressData={addressData}
        loaderShow={loaderShow}
        formType={formType}
      ></FormAddress>
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
              data={addressData}
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
