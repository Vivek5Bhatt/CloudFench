import { useRouter } from "next/router";
// ** MUI Imports
import Grid from "@mui/material/Grid";
// ** Styled Component Import
import ApexChartWrapper from "src/theme/styles/libs/react-apexcharts";
import BreadcrumbHeading from "src/components/BreadcrumbHeading";
// ** Demo Components Imports
import MaterialBasicTable from "src/components/Tables/MaterialTable/Basic";
import { stackConnectivity } from "utils/apis/routes/monitorLogs";
import StackTable from "./StackTable";
import { Box } from "@mui/system";
import { Button } from "@mui/material";
import { useState } from "react";

const StackConnectivity = () => {
  const router = useRouter();
  const currentPageUrl = router.pathname;
  const [openM, setOpenM] = useState(false);
  return (
    <ApexChartWrapper>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <BreadcrumbHeading url={currentPageUrl} />

            <Button
              size="small"
              variant="contained"
              sx={{
                minWidth: "84px",
                marginRight: "10px",
              }}
              onClick={() => setOpenM(true)}
            >
              Connect Stack
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <StackTable openM={openM} setOpenM={setOpenM} />
        </Grid>
      </Grid>
    </ApexChartWrapper>
  );
};

export default StackConnectivity;
