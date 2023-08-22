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
      label: "Serverless",
      textAlign: "start",
    },
    {
      id: "location",
      label: "Runtime",
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
const ExposedDatabase = () => {
  const theme = useTheme();
  const rows = () => {
    if (Array.isArray([1])) {
      if ([1]) {
        return [1].map((row, index) => ({
          virtual_machine: (
            <BytesStyle>
              <Typography id="mouse-id" sx={{ fontSize: "12px", ml: "10px" }}>
                serverless
              </Typography>
            </BytesStyle>
          ),
          location: (
            <Box sx={{ display: "flex", justifyContent: "start" }}>
              <Typography
                className="truncate"
                sx={{ fontSize: "12px", maxWidth: "300px", ml: "5px" }}
              >
                Runtime
              </Typography>
            </Box>
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
export default ExposedDatabase;
