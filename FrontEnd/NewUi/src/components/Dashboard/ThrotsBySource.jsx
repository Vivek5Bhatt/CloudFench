import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import { styled, useTheme } from "@mui/material/styles";
import { Box } from "@mui/system";
import SelectSize from "./SelectSize";
import Loader from "../Loader";
import CustomTable from "../Tables/CustomTable";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { Popover } from "@mui/material";
import TablePopOver from "./TablePopover";
import CustomLoader from "../Loader/CustomLoader";

const columnsD = (theme) => {
  const columns = [
    {
      id: "srcip",
      label: "Source",
      isBorder: `1px solid ${theme.palette.action.focus}`,
      textAlign: "start",
    },
    {
      id: "dev_src",
      label: "Device Type",
      isBorder: `1px solid ${theme.palette.action.focus}`,
      textAlign: "start",
    },
    {
      id: "threatweight",
      label: "Threats Score",
      isBorder: `1px solid ${theme.palette.action.focus}`,
      textAlign: "start",
    },
    {
      id: "incidents",
      label: "Incidents",
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
    backgroundColor: "white",
  },
  [`& .${linearProgressClasses.bar}`]: {
    backgroundColor: "#f5d069",
  },
}));

const SessionProgress = styled(LinearProgress)(({ theme }) => ({
  height: 6,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: "white",
  },
  [`& .${linearProgressClasses.bar}`]: {
    backgroundColor: "#f5d069",
  },
}));

const ThrotsBySource = (props) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [cellData, setCellData] = useState({});

  const handlePopoverOpen = (event, row) => {
    setAnchorEl(event.currentTarget);
    setCellData(row);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const {
    onChange,
    value,
    threatSource,
    daysData,
    setDaysData,
    srcLoader,
    refreshClick,
  } = props;
  const theme = useTheme();

  const rows = () => {
    if (Array.isArray(threatSource)) {
      if (threatSource) {
        return threatSource.map((row, index) => ({
          srcip: (
            <BytesStyle>
              <Typography
                id="mouse-id"
                sx={{ fontSize: "12px", ml: "10px" }}
                onMouseEnter={(e) => handlePopoverOpen(e, row)}
                onMouseLeave={handlePopoverClose}
              >
                <Box className="truncate">
                  {row?.srcinfo?.Name || row.srcinfo?.Description || row?.srcip}
                </Box>
              </Typography>
            </BytesStyle>
          ),
          dev_src: (
            <Box sx={{ display: "flex", justifyContent: "start" }}>
              {/* {showAWSIconAndClass(row, false, 1)} */}
              <Typography
                className="truncate"
                sx={{ fontSize: "12px", maxWidth: "300px", ml: "5px" }}
              >
                {row.dev_src}
              </Typography>
            </Box>
          ),
          threatweight: (
            <BytesStyle>
              <Typography sx={{ fontSize: "12px", mr: "10px" }}>
                {row.threatweight}
              </Typography>
              <BorderLinearProgress
                sx={{ width: "100px" }}
                variant="determinate"
                value={(row.threat_block / row.threat_pass) * 100}
              />
            </BytesStyle>
          ),
          incidents: (
            <BytesStyle>
              <Typography sx={{ fontSize: "12px", mr: "10px" }}>
                {row.incidents}
              </Typography>
              <SessionProgress
                sx={{ width: "100px" }}
                variant="determinate"
                value={(row.incident_block / row.incident_pass) * 100}
                // value={40}
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
        id="threatBySource-size-select"
        onChange={onChange}
        value={value}
        label="Top Threats By Source"
        daysData={daysData.sorce}
        setDaysData={setDaysData}
        refreshClick={() => refreshClick()}
      />

      {/* {srcLoader ? (
        <CustomLoader />
      ) : ( */}
      <CustomTable
        rows={rows()}
        headCells={columnsD(theme)}
        isPagination={false}
      />
      {/* )} */}
      {cellData?.srcinfo?.ip != "" && (
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
          <TablePopOver data={cellData?.srcinfo} />
        </Popover>
      )}
    </Box>
  );
};

export default ThrotsBySource;
