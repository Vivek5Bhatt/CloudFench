import Box from "@mui/material/Box";
import { MaterialReactTable } from "material-react-table";
import { useEffect, useState } from "react";
import Loader from "../../Loader";
import { useTheme } from "@mui/material/styles";
import {
  getColumnVisibility,
  updateColumnVisibility,
  deploymentsDefault,
} from "utils/apis/routes/monitorLogs";
// ** Toast
import { toast } from "react-toastify";

export default function MaterialTable({
  isEmptyData,
  loaderShow,
  setOpen,
  setSelectActivity,
  setActivity,
  setActivitySelected,
  setLimit,
  limit,
  total,
  page,
  setPage,
  setOpenSourceHover,
  setSrcinfo,
  callingFrom,
  columns,
  tableData,
  setAnchorEl,
  rightsectionanchor,
  trafficActivities,
}) {
  const [pagination, setPagination] = useState({
    pageIndex: page,
    pageSize: limit, //customize the default page size
  });
  const [columnLoader, setColumnLoader] = useState(false);
  const [columnVisibilities, setColumnVisibility] = useState({
    date: true,
    time: true,
    "selectActivity.name": true,
    "selectActivity.cloud": false,
    "selectActivity.region": false,
    action: true,
    utmaction: false,
    threats: false,
    threattyps: false,
    crlevel: false,
    policyname: false,
    sourceName: true,
    srcport: false,
    sCountry: true,
    "srcinfo.VPCId": false,
    "srcinfo.VPCName": false,
    "srcinfo.SubnetId": false,
    "srcinfo.SubnetName": false,
    "srcinfo.Type": false,
    destinationName: true,
    dstport: false,
    dstinetsvc: true,
    hostname: true,
    dCountry: true,
    dstregion: false,
    dstcity: false,
    dstreputation: false,
    "dstinfo.VPCId": false,
    "dstinfo.VPCName": false,
    "dstinfo.SubnetId": false,
    "dstinfo.SubnetName": false,
    "dstinfo.Type": false,
    service: true,
    app: true,
    appcat: true,
    proto: false,
    duration: false,
    sentbyte: false,
    rcvdbyte: false,
    sentpkt: false,
    rcvdpkt: false,
  });
  const [orignalColumnVisibilities, setOrignalColumnVisibility] = useState({
    "selectActivity.name": true,
    "selectActivity.cloud": false,
    "selectActivity.region": true,
    date: true,
    time: true,
    action: true,
    utmaction: false,
    threats: false,
    threattyps: false,
    crlevel: false,
    policyname: false,
    sourceName: true,
    srcport: false,
    sCountry: true,
    "srcinfo.VPCId": false,
    "srcinfo.VPCName": false,
    "srcinfo.SubnetId": false,
    "srcinfo.SubnetName": false,
    "srcinfo.Type": false,
    destinationName: true,
    dstport: false,
    dstinetsvc: false,
    hostname: false,
    dCountry: true,
    dstregion: false,
    dstcity: false,
    dstreputation: false,
    "dstinfo.VPCId": false,
    "dstinfo.VPCName": false,
    "dstinfo.SubnetId": false,
    "dstinfo.SubnetName": false,
    "dstinfo.Type": false,
    service: true,
    app: true,
    appcat: true,
    proto: false,
    duration: false,
    sentbyte: false,
    rcvdbyte: false,
    sentpkt: false,
    rcvdpkt: false,
  });

  const onRowClick = (row) => {
    try {
    } catch (error) {}
  };

  const onDoubleClickRow = (row) => {
    try {
      if (callingFrom === "trafficActivity") {
        setOpenSourceHover(false);
        setSrcinfo(null);
        setAnchorEl(null);
        setOpen(true);
        setActivitySelected(row?.original);
      }
    } catch (error) {}
  };

  const theme = useTheme();

  const onMouseHoverEvent = (e, cell, column) => {
    try {
      e.stopPropagation();
      if (column.id == "sourceName" && callingFrom === "trafficActivity") {
        if (cell?.row?.original && cell?.row?.original?.srcinfo) {
          let scrInfo = cell?.row?.original?.srcinfo;
          if (
            !scrInfo ||
            (scrInfo?.Name == "" &&
              scrInfo?.SubnetId == "" &&
              scrInfo?.SubnetName == "" &&
              scrInfo?.Type == "" &&
              scrInfo?.VPCId == "" &&
              scrInfo?.VPCName == "" &&
              dstInfo?.Description)
          ) {
            return;
          }
          setAnchorEl(e.currentTarget);
          setOpenSourceHover(true);
          setSrcinfo({
            ...cell?.row?.original?.srcinfo,
            callingFrom: "Source",
            rowId: cell?.row?.id,
            columnId: cell?.column?.id,
          });
        }
      } else if (
        column.id == "destinationName" &&
        callingFrom === "trafficActivity"
      ) {
        let dstInfo = cell?.row?.original?.dstinfo;
        if (
          !dstInfo ||
          (dstInfo?.Name == "" &&
            dstInfo?.SubnetId == "" &&
            dstInfo?.SubnetName == "" &&
            dstInfo?.Type == "" &&
            dstInfo?.VPCId == "" &&
            dstInfo?.VPCName == "" &&
            dstInfo?.Description == "")
        ) {
          return;
        }
        setAnchorEl(e.currentTarget);
        setOpenSourceHover(true);
        setSrcinfo({
          ...cell?.row?.original?.dstinfo,
          callingFrom: "Destination",
          rowId: cell?.row?.id,
          columnId: cell?.column?.id,
        });
      }
    } catch (err) {}
  };

  const onMouseLeaveEvent = (e) => {
    try {
      if (callingFrom === "trafficActivity") {
        setOpenSourceHover(false);
        setSrcinfo(null);
        setAnchorEl(null);
      }
    } catch (err) {}
  };

  const handleUpdateColumn = async (columnData) => {
    try {
      const body = { status: JSON.stringify(columnData) };
      const data = await updateColumnVisibility(body);
      if (data && data?.data?.data?.status) {
        setOrignalColumnVisibility(JSON.parse(data?.data?.data?.status));
      } else {
        // in case api fail update orignal column data
        setColumnVisibility(orignalColumnVisibilities);
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.error || err?.message || "something went wrong"
      );
      return;
    }
  };

  const onCloumnShowHide = (event) => {
    try {
      if (event?.call) {
        const updatedColumn = event();
        let newColumnValues = { ...columnVisibilities, ...updatedColumn };
        setColumnVisibility(newColumnValues);
        handleUpdateColumn(newColumnValues);
      } else {
        let allVisible = { ...event };
        let newColumnValues = { ...columnVisibilities, ...allVisible };
        setColumnVisibility(newColumnValues);
        handleUpdateColumn(newColumnValues);
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.error || err?.message || "something went wrong"
      );
      return;
    }
  };

  const handleTrafficActivity = async () => {
    try {
      const data = await deploymentsDefault();
      if (data.data) {
        setSelectActivity(data.data[0]);
        setActivity(data.data);
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.error || err?.message || "something went wrong"
      );
      return;
    }
  };

  useEffect(() => {
    setPage(pagination.pageIndex);
  }, [pagination.pageIndex]);

  useEffect(() => {
    setLimit(pagination.pageSize);
    setPage(0);
  }, [pagination.pageSize]);

  useEffect(() => {
    const fetchColumnsData = async () => {
      try {
        const data = await getColumnVisibility();
        if (data && data?.data?.data?.status) {
          setColumnVisibility(JSON.parse(data?.data?.data?.status));
          setOrignalColumnVisibility(JSON.parse(data?.data?.data?.status));
          setColumnLoader(true);
          handleTrafficActivity();
        }
      } catch (err) {
        toast.error(
          err?.response?.data?.error || err?.message || "something went wrong"
        );
        return;
      }
    };
    fetchColumnsData();
  }, []);

  return (
    <Box
      className="newbox"
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
        "& .MuiTable-root thead tr th .MuiButtonBase-root .MuiSvgIcon-root": {
          color: theme.palette.primary.contrastText,
        },
        "& .MuiTable-root tbody tr td": {
          color: theme.palette.text.primary,
          fontSize: "13px",
          fontWeight: "500",
        },
        "& .MuiTable-root thead tr th:last-child .Mui-TableHeadCell-ResizeHandle-Wrapper":
          {
            right: "8px",
          },
      }}
    >
      {!columnLoader && <Loader />}
      <MaterialReactTable
        columns={columns}
        enableStickyFooter={true}
        enableStickyHeader={true}
        enableColumnResizing={true}
        data={tableData}
        enableColumnOrdering={true}
        enableMultiRowSelection={false}
        enableFullScreenToggle={false} // hide fullScreen
        enableDensityToggle={false} // disble density
        enableGlobalFilter={false} // hide search section
        enableColumnFilters={false} // hide column filter icon
        enableColumnActions={false}
        columnFilterModeOptions={false}
        className="material_tablebx"
        muiTableBodyCellProps={({ cell, column }) => ({
          onMouseOver: (e) => {
            onMouseHoverEvent(e, cell, column);
          },
          onMouseLeave: (e) => {
            onMouseLeaveEvent(e);
          },
        })}
        muiTableBodyRowProps={({ row }) => ({
          onClick: (e) => onRowClick(row, e),
          onDoubleClick: () => {
            row.getToggleSelectedHandler();
            onDoubleClickRow(row);
          },
          sx: { cursor: "pointer" },
        })}
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
                height: "calc(100vh - 314px)",

                "& .cstm_loaderbx": {
                  alignItems: "center",
                },
              }}
            >
              {loaderShow && <Loader />}

              {trafficActivities.length === 0 && "No Data Found"}
              {/* {!loaderShow && isEmptyData && "No Data Found"} */}
            </Box>
          );
        }}
        initialState={{ columnVisibility: columnVisibilities }}
        manualPagination
        rowCount={total}
        onPaginationChange={setPagination}
        state={{ pagination, columnVisibility: columnVisibilities }}
        muiTableContainerProps={{
          sx: {
            height:
              rightsectionanchor == "right"
                ? "calc(100vh - 264px)"
                : "calc(100vh - 474px)",
          },
        }}
        onColumnVisibilityChange={(event) => {
          onCloumnShowHide(event);
        }}
      />
    </Box>
  );
}
