import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import CardSettings from "src/theme/components/card-statistics/card-stats-vertical/card-settings";
import FormConnector from "src/components/Modals/forms/connector";
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
import AwsIcon from "public/images/awsimg/aws.svg";
import Image from "next/image";

const Settings = () => {
  const [open, setOpen] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [formType, setFormType] = useState("");
  const [policy, setPolicy] = useState();
  const [loaderShow, setLoaderShow] = useState(false);
  const [connectorType, setConnectorType] = useState("");
  const [connectorData, setConnectorData] = useState([]);
  const [selectedConnectorId, setSelectedConnectorId] = useState();

  const theme = useTheme();

  const handleConnectorPolicy = async (type) => {
    try {
      // const data = await cloudConnectorPolicy(type);
      const data = await cloudConnectorPolicy();
      if (data) {
        setPolicy(JSON.stringify(data.data, null, 4));
        setLoaderShow(false);
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.error || err?.message || "something went wrong"
      );
      return;
    }
  };

  const handleOpen = (type) => {
    setOpen(true);
    setLoaderShow(true);
    handleConnectorPolicy(type);
  };

  const handleCloseDelete = () => setOpenDelete(false);

  const handleClose = () => setOpen(false);

  const handleDeleteConnector = async (id) => {
    setSelectedConnectorId(id);
    setOpenDelete(true);
  };

  const handleEditConnector = (id, type) => {
    setSelectedConnectorId(id);
    setOpen(true);
    setLoaderShow(true);
    handleConnectorPolicy(type);
  };

  //should be memoized or stable
  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        size: 150,
        Cell: ({ renderedCellValue }) => (
          <Box className="truncate">
            <Image src={AwsIcon} alt="aws icon" width={18} />{" "}
            {renderedCellValue}
          </Box>
        ),
      },
      {
        accessorKey: "accountId",
        header: "Account ID",
        size: 150,
        Cell: ({ renderedCellValue }) => (
          <Box className="truncate">{renderedCellValue}</Box>
        ),
      },
      {
        accessorKey: "accessKey",
        header: "Access Details",
        size: 200,
        Cell: ({ renderedCellValue }) => (
          <Box className="truncate">{renderedCellValue}</Box>
        ),
      },
      {
        accessorKey: "status",
        header: "Description",
        size: 150,
        Cell: ({ renderedCellValue }) => (
          <Box className="truncate" sx={{ textTransform: "capitalize" }}>
            {renderedCellValue}
          </Box>
        ),
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
                setConnectorType(row.original.cloud);
                handleConnectorPolicy(row.original.cloud);
                handleEditConnector(row.original.id, row.original.cloud);
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
              disabled={Boolean(row.original.StackConnector?.length)}
              onClick={() => handleDeleteConnector(row.original.id)}
            >
              <DeleteOutlineOutlinedIcon sx={{ fontSize: "20px" }} />
            </IconButton>
          </Box>
        ),
      },
    ],
    []
  );

  const handleConnectorsData = async () => {
    try {
      setLoaderShow(true);
      const data = await cloudConnector();
      const connectorData = data.data;
      let dataCloud = [];
      if (connectorData) {
        for (let i = 0; i < connectorData.length; i++) {
          dataCloud.push({ ...connectorData[i] });
        }
        setConnectorData(dataCloud);
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
    handleConnectorsData();
  }, []);

  return (
    <>
      <Box className="main_setting_bx">
        <Grid item xs={12}>
          <Grid container spacing={{ xs: 3, md: 6 }}>
            <Grid item xs={6} md={3}>
              <Box
                onClick={() => {
                  setConnectorType("AWS");
                  handleOpen("aws");
                  setFormType("add");
                }}
                sx={{
                  cursor: "pointer",
                }}
              >
                <CardSettings
                  icon="/images/logos/aws.png"
                  color="success"
                  title="Amazon Web Services (AWS)"
                  classBox="bg_box1"
                  bgcolor={`${theme.palette.background.skycard} !important`}
                />
              </Box>
            </Grid>
            <Grid item xs={6} md={3}>
              <CardSettings
                icon="/images/logos/Microsoft_Azure_Logo.png"
                color="secondary"
                title="Microsoft Azure"
                classBox="bg_box1"
                bgcolor={`${theme.palette.background.skycard} !important`}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <CardSettings
                icon="/images/logos/google_cloud.png"
                color="secondary"
                title="Google Cloud"
                classBox="bg_box1"
                bgcolor={`${theme.palette.background.skycard} !important`}
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <CardSettings
                icon="/images/logos/oracle-cloud.png"
                color="warning"
                title="Oracle Cloud"
                classBox="bg_box1"
                bgcolor={`${theme.palette.background.skycard} !important`}
              />
            </Grid>
          </Grid>
        </Grid>
      </Box>
      <FormConnector
        open={open}
        handleClose={handleClose}
        selectedConnectorId={selectedConnectorId}
        connectorType={connectorType}
        policy={policy}
        setConnectorData={setConnectorData}
        connectorData={connectorData}
        loaderShow={loaderShow}
        formType={formType}
      ></FormConnector>
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
              data={connectorData}
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
