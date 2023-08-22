import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import styled from "@emotion/styled";
import CustomTable from "src/components/Tables/CustomTable";
import { useTheme } from "@emotion/react";
import { useState } from "react";

const columndD = (theme) => {
  const columns = [
    {
      id: "virtual_machine",
      label: "Load Balancer",
      textAlign: "start",
    },
    {
      id: "location",
      label: "Type",
      textAlign: "start",
    },
    {
      id: "public_endpoint",
      label: "Public endpoint ",
      textAlign: "start",
    },
    {
      id: "DNS",
      label: "Target",
      textAlign: "start",
    },
    {
      id: "internet_exposed_ports",
      label: "Target Resource",
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
const ExposeContainer = () => {
  const theme = useTheme();
  const rows = () => {
    if (Array.isArray([1])) {
      if ([1]) {
        return [1].map((row, index) => ({
          virtual_machine: (
            <BytesStyle>
              <Typography id="mouse-id" sx={{ fontSize: "12px", ml: "10px" }}>
                load balancer
              </Typography>
            </BytesStyle>
          ),
          location: (
            <Box sx={{ display: "flex", justifyContent: "start" }}>
              <Typography
                className="truncate"
                sx={{ fontSize: "12px", maxWidth: "300px", ml: "5px" }}
              >
                type
              </Typography>
            </Box>
          ),
          public_endpoint: (
            <BytesStyle>
              <Typography sx={{ fontSize: "12px", mr: "10px" }}>
                public endpoint
              </Typography>
            </BytesStyle>
          ),
          DNS: (
            <BytesStyle>
              <Typography sx={{ fontSize: "12px", mr: "10px" }}>
                terget
              </Typography>
            </BytesStyle>
          ),
          internet_exposed_ports: (
            <BytesStyle>
              <Typography sx={{ fontSize: "12px", mr: "10px" }}>
                TARGET RESOURCE
              </Typography>
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
    <CustomTable
      rows={rows()}
      headCells={columndD(theme)}
      isPagination={false}
    />
  );
};
export default ExposeContainer;
