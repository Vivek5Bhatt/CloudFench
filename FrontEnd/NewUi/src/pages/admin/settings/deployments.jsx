// ** MUI Imports
import Grid from "@mui/material/Grid";
// ** Styled Component Import
import ApexChartWrapper from "src/theme/styles/libs/react-apexcharts";
import BreadcrumbHeading from "src/components/BreadcrumbHeading";
// ** Demo Components Imports
import MaterialBasicTable from "src/components/Tables/MaterialTable/Basic";
import { useRouter } from "next/router";
import { Box, Button } from "@mui/material";
import { useState } from "react";

const Deployments = () => {
  const router = useRouter();
  const [stackOpen, setStackOpen] = useState({
    open: false,
    first: false,
    second: false,
    third: false,
    forth: false,
  });
  const currentPageUrl = router.pathname;
  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <BreadcrumbHeading
              title="Malware Protection"
              url={currentPageUrl}
            />
            <Button
              size="small"
              variant="contained"
              sx={{
                minWidth: "84px",
              }}
              onClick={() =>
                setStackOpen({ ...stackOpen, open: true, first: true })
              }
            >
              Deploy Stack
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <MaterialBasicTable
            stackOpen={stackOpen}
            setStackOpen={setStackOpen}
          />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  );
};

export default Deployments;
