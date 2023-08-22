import { Typography, useTheme } from "@mui/material";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import Loader from "src/components/Loader";
import { Box, style } from "@mui/system";
import CustomTable from "../Tables/CustomTable";
import SelectSize from "./SelectSize";
import { styled } from "@mui/material/styles";
import { showAWSIconAndClass } from "utils/commonFunctions";
import { useState } from "react";
import React from "react";
import Popover from "@mui/material/Popover";
import TablePopOver from "./TablePopover";
import CustomLoader from "../Loader/CustomLoader";

const columndD = (theme) => {
  const columns = [
    {
      id: "dstip",
      label: "Destinations",
      isBorder: `1px solid ${theme.palette.action.focus}`,
      textAlign: "start",
    },
    {
      id: "agg_app",
      label: "Application",
      isBorder: `1px solid ${theme.palette.action.focus}`,
      textAlign: "start",
    },
    {
      id: "bandwidth",
      label: "Bytes",
      isBorder: `1px solid ${theme.palette.action.focus}`,
      textAlign: "start",
    },
  ];
  return columns;
};

const BytesStyle = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "start",
});

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 6,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.green.greenOpct,
  },
  [`& .${linearProgressClasses.bar}`]: {
    backgroundColor: theme.palette.grey.A800,
  },
}));

const DestinationTable = (props) => {
  const [cellData, setCellData] = useState({});
  const {
    value,
    onChange,
    destinationList,
    tableLoader,
    daysData,
    setDaysData,
    refreshClick,
  } = props || {};
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handlePopoverOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setCellData(row);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const rows = () => {
    if (Array.isArray(destinationList)) {
      if (destinationList) {
        return destinationList.map((row, index) => ({
          dstip: (
            <BytesStyle>
              <Typography
                id="mouse-id"
                sx={{ fontSize: "12px", ml: "10px" }}
                onMouseEnter={(e) => handlePopoverOpen(e, row)}
                onMouseLeave={handlePopoverClose}
              >
                <Box className="truncate">
                  {row?.dstinfo?.Name ||
                    row?.dstinfo?.Description ||
                    row?.dstip}
                </Box>
              </Typography>
            </BytesStyle>
          ),
          agg_app: (
            <Box sx={{ display: "flex", justifyContent: "start" }}>
              {showAWSIconAndClass(row, false, 1)}
              <Typography
                className="truncate"
                sx={{ fontSize: "12px", maxWidth: "300px", ml: "5px" }}
              >
                {row.agg_app || row.dstip}
              </Typography>
            </Box>
          ),
          bandwidth: (
            <BytesStyle>
              <Typography sx={{ fontSize: "12px", mr: "10px" }}>
                {row.bandwidth} KB
              </Typography>
              <BorderLinearProgress
                sx={{ width: "100px" }}
                variant="determinate"
                value={(row.traffic_out / row.bandwidth) * 100}
              />
            </BytesStyle>
          ),
        }));
      } else {
        return [];
      }
    } else {
      return [];
    }
  };

  return (
    <Box>
      <SelectSize
        id="destination-table-size-select"
        value={value}
        onChange={onChange}
        label="Top Destination Website"
        daysData={daysData.des}
        setDaysData={setDaysData}
        refreshClick={() => refreshClick()}
      />
      {/* {tableLoader ? (
        <CustomLoader />
      ) : ( */}
      <CustomTable
        rows={rows()}
        headCells={columndD(theme)}
        isPagination={false}
      />
      {/* )} */}

      {cellData?.dstinfo?.ip != "" && (
        <Popover
          id="mouse-over-popover"
          sx={{
            pointerEvents: "none",
          }}
          open={open}
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          onClose={handlePopoverClose}
          disableRestoreFocus
        >
          <TablePopOver data={cellData?.dstinfo} />
        </Popover>
      )}
    </Box>
  );
};

export default DestinationTable;
