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
      label: "API",
      textAlign: "start",
    },
    {
      id: "location",
      label: "Location",
      textAlign: "start",
    },
    {
      id: "public_endpoint",
      label: "Public endpoints",
      textAlign: "start",
    },
    {
      id: "DNS",
      label: "URL",
      textAlign: "start",
    },
    {
      id: "internet_exposed_ports",
      label: "Target Resources",
      textAlign: "start",
    },
    {
      id: "attached_identity",
      label: "Attached Policy",
      textAlign: "start",
    },
    {
      id: "resource",
      label: "Resource",
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
const Serverless = () => {
  const theme = useTheme();
  const rows = () => {
    if (Array.isArray([1])) {
      if ([1]) {
        return [1].map((row, index) => ({
          virtual_machine: (
            <BytesStyle>
              <Typography id="mouse-id" sx={{ fontSize: "12px", ml: "10px" }}>
                api
              </Typography>
            </BytesStyle>
          ),
          location: (
            <Box sx={{ display: "flex", justifyContent: "start" }}>
              <Typography
                className="truncate"
                sx={{ fontSize: "12px", maxWidth: "300px", ml: "5px" }}
              >
                location
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
              <Typography sx={{ fontSize: "12px", mr: "10px" }}>url</Typography>
            </BytesStyle>
          ),
          internet_exposed_ports: (
            <BytesStyle>
              <Typography sx={{ fontSize: "12px", mr: "10px" }}>
                TARGET RESOURCE
              </Typography>
            </BytesStyle>
          ),
          attached_identity: (
            <BytesStyle>
              <Typography sx={{ fontSize: "12px", mr: "10px" }}>
                AUTHORIZATION
              </Typography>
            </BytesStyle>
          ),
          resource: (
            <BytesStyle>
              <Typography sx={{ fontSize: "12px", mr: "10px" }}>
                resource
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
export default Serverless;
